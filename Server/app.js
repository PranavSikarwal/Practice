const express = require('express');
require('dotenv').config;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const placesRoutes = require('./routes/placesRoutes');
const bodyParser = require("body-parser");
const app = express();
const HttpError = require("./models/http-error");
const fs = require('fs');
const path = require('path');
const Port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "optionsSuccessStatus": 204,
    "headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  }));
app.use(bodyParser.json());//to parse json data passed thru post request into request body i.e. req.body object

// app.use('/uploads/images', express.static(path.join('uploads','images')));

//CORS error resolve for front-end
// app.use((req,res,next)=>{
//     res.setHeader('Access-Control-Allow-Origin',"*");
//     res.setHeader('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader('Access-Control-Allow-Methods',"GET, POST, PATCH, DELETE");
//     next();
// })

app.use('/api/users',userRoutes);
app.use('/api/places',placesRoutes);

app.use((req,res,next)=>{
    error = new HttpError("Could not Find this route", 404);
    throw error; //as sync we can throw error if async then return next(error) is must
})
app.use((error,req,res,next)=>{
    //very important with security pov
    //this is to delete file if got error on request which stores file
    // if(req.file){
    //     fs.unlink(req.file.path, err=>{
    //         console.log(err);
    //     });
    // }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 5000);
    res.json({message: error.message || "An Unknown Error Occured"});
})

mongoose.connect(`mongodb+srv://pranavsikarwal:${process.env.MONGODB_PWD}@places.yic06bw.mongodb.net/?retryWrites=true&w=majority`)
.then((res)=>{
    app.listen(Port);
    console.log("connected");

}).catch((err)=>{console.log(err)});
