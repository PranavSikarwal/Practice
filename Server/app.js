const express = require('express');

const userRoutes = require('./routes/userRoutes');
const placesRoutes = require('./routes/placesRoutes');
const bodyParser = require("body-parser");
const app = express();
const HttpError = require("./models/http-error");

app.use(bodyParser.json());//to parse json data passed thru post request into request body i.e. req.body object

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
app.listen(5000);