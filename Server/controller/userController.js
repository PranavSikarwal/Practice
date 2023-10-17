const HttpError = require('../models/http-error');
const {v4} = require('uuid');
const {validationResult} = require("express-validator");
const User = require('../models/User');


exports.getUsers = (req,res,next)=>{
    res.json({users: DummyUsers});
}

exports.postSignUp = async (req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError("Invalid Submission", 422));
    }
    const {name, email, password} = req.body;
    //find user 
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch(error){
        return next(new HttpError("fetching email failed, check email or try again later.",500));
    }
    
    if(existingUser){
        return next(new HttpError("Email already Registered",422)); //422 denotes invalid user input
    }

    const newUser = new User({
        name,
        email,
        password,
        image: "https://lh3.googleusercontent.com/a/default-user=s40-p",
        places: []
    });

    try{
        await newUser.save();
    }catch(error){
        return next(new HttpError("Saving User failed, try to sign up again",500))
    }

    res.status(201).json({message: "Created new user", user: newUser.toObject({getters: true})});
}

exports.postLogIn = async(req,res,next)=>{
    const {email, password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    }catch(error){
        return next(new HttpError("Fetching user for given email Id faild check Email or try again later",500));
    }

    if(existingUser && existingUser.password === password){
        res.json({message:"Logged in user.", user: existingUser.toObject({getters:true})});
    }else{
        return next(new HttpError("Wrong credentials or email not registered",401)) //status code 401 reflects wrong credentials
    }
}
