const HttpError = require('../models/http-error');
const {v4} = require('uuid');
const {validationResult} = require("express-validator");

let DummyUsers = [
    {
        id:"u1",
        name: "Pranav Sikarwal",
        email: "test@gmail.com",
        password: "Test@1234"
    }
];

exports.getUsers = (req,res,next)=>{
    res.json({users: DummyUsers});
}

exports.postSignUp = (req,res,next)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError("Invalid Submission", 422));
    }
    const {name, email, password} = req.body;
    const existingUser = DummyUsers.find(u=>u.email===email);
    if(existingUser){
        return next(new HttpError("Email already Registered",422)); //422 denotes invalid user input
    }
    const newUser = {
        id: v4(),
        name, //shortcut to name: name
        email,
        password
    }
    DummyUsers.push(newUser);
    res.status(201).json({message: "Created new user", createdUser: newUser});
}

exports.postLogIn = (req,res,next)=>{
    const {email, password} = req.body;
    const user = DummyUsers.find(u =>u.email===email);
    console.log(user);
    if(user && user.password === password){
        res.json({message:"Logged in user."})
    }else{
        return next(new HttpError("Wrong credentials or email not registered",401)) //status code 401 reflects wrong credentials
    }
}

