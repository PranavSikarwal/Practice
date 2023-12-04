const jwt = require('jsonwebtoken');
require('dotenv').config;
const HttpError = require('../models/http-error');

module.exports = (req, res, next)=>{
    if(req.method==='OPTIONS'){
        return next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1]; //Authorization: "Bearer Token"
        if(!token){
            throw new Error("Authentication Failed");
        }
        const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
        req.userData = {userId: decodedToken.userId};
        next();

    }catch(err){
        const error = new HttpError("Authentication Failed", 401);
        return next(error);
    }
}