const express = require('express');
require('dotenv').config;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const placesRoutes = require('./routes/placesRoutes');
const bodyParser = require("body-parser");
const app = express();
const HttpError = require("./models/http-error");

app.use(bodyParser.json());//to parse json data passed thru post request into request body i.e. req.body object

//CORS error resolve for front-end
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, DELETE");
    next();
})

app.use('/api/users',userRoutes);
app.use('/api/places',placesRoutes);

app.use((req,res,next)=>{
    error = new HttpError("Could not Find this route", 404);
    throw error; //as sync we can throw error if async then return next(error) is must
})
app.use((error,req,res,next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "An Unknown Error Occured"});
})

mongoose.connect(`mongodb+srv://pranavsikarwal:${process.env.MONGODB_PWD}@places.yic06bw.mongodb.net/?retryWrites=true&w=majority`)
.then((res)=>{
    app.listen(5000);
    console.log("connected");

}).catch((err)=>{console.log(err)});
