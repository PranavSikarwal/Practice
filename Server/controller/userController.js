const HttpError = require('../models/http-error');
const {v4} = require('uuid');
const {validationResult} = require("express-validator");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config;
const { Readable } = require('stream');
const pinataSDK = require('@pinata/sdk');



exports.getUsers = async (req,res,next)=>{
    let users;
    try{
        users = await User.find();
    }catch(error){
        console.log(error);
        return next(HttpError("Error while loading users", 500));
    }
    res.status(201).json({users: users.map(user=>user.toObject({getters:true}))});
}

exports.postSignUp = async (error,req,res,next)=>{
    const err = validationResult(req);
    if(!err.isEmpty()){
        console.log(error);
        return next(new HttpError("Invalid Submission", 422));
    }
    //multer will also give req.file as file i.e. image
    const {name, email, password} = req.body;
    //find user 
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch(err){
        return next(new HttpError("fetching email failed, check email or try again later.",500));
    }
    
    if(existingUser){
        return next(new HttpError("Email already Registered",422)); //422 denotes invalid user input
    }

    //hasing password using bcrypt
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hash(password, 12); //12 indicates salting rounds

    }catch(err){
        return next(new HttpError("hashing Password failed, could not create User.", 500));
    }
    let ImgHash;
    if(!error){
        const stream = Readable.from(req.file.buffer);
        const pinata = new pinataSDK({pinataJWTKey: process.env.PINATA_API_JWT});
        const result = await pinata.pinFileToIPFS(stream, {
            pinataMetadata: {
                name: process.env.MYNAME
            }
        }
        );
        ImgHash = result.IpfsHash;
        console.log(result, ImgHash);
    } else{
        return next(new HttpError("Unable to upload image, Size of image should be less than 100kb", 500));
    }
    

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        image: ImgHash,
        places: []
    });

    try{
        await newUser.save();
    }catch(error){
        return next(new HttpError("Saving User failed, try to sign up again",500));
    }
    let token;
    try{
        token = jwt.sign({userId: newUser.id, email: newUser.email}, process.env.PRIVATE_KEY, {expiresIn: '1h'});
        
    }catch(err){
        return next(new HttpError("Saving User failed, try to sign up again",500));
    }

    // res.status(201).json({message: "Created new user", user: newUser.toObject({getters: true})});
    res.status(201).json({userId: newUser.id, email: newUser.email, token: token});
}

exports.postLogIn = async(req,res,next)=>{
    const {email, password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch(error){
        return next(new HttpError("Fetching user for given email Id faild check Email or try again later",500));
    }

    if(!existingUser){
        return next(new HttpError("Wrong credentials or email not registered",401)) //status code 401 reflects wrong credentials  
    }

    let isValidPassword = false;
    try{
        
        isValidPassword = await bcrypt.compare(password, existingUser.password);

    }catch(err){
        const error = new HttpError("Could not log you in, please try again !!!", 500) //server sie error not wrong credentials
        return next(error);
    }
    //if isValidPassword is false
    if(!isValidPassword){
        return next(new HttpError("Wrong credentials or email not registered",401)) //status code 401 reflects wrong credentials
    }

    let token;
    try{
        
        token = await jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.PRIVATE_KEY, {expiresIn: '1h'});
        
    }catch(err){
        return next(new HttpError("Saving User failed, try to sign up again",500));
    }

    // res.json({message:"Logged in user.", user: existingUser.toObject({getters:true})});
    res.json({userId: existingUser.id, email: existingUser.email, token: token});

}
