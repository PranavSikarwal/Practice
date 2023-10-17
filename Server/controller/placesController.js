const HttpError = require("../models/http-error");
const {validationResult} = require("express-validator");
const geoCoding = require('../utils/geoCoding');
const {v4} = require('uuid') //v4 specifically as it has timestamp component in it
const Place = require('../models/Place'); //model name should start with capital letter
const User = require('../models/User');
const mongoose = require('mongoose');
exports.getPlaceById = async(req,res,next)=>{
    const pid = req.params.pid;
    let place;
    try{
        place = await Place.findById(pid);
    }catch(error){
        return next(new HttpError("Could not find Product or Error occured, Check id once again", 500));
    }

    if(!place){
        throw new HttpError("No such place found", 404); //only throw in sync code else do next()
    }

    res.json({place: place.toObject({getters:true})});

};
exports.getPlacesByUserId = async(req,res,next)=>{
    const uid = req.params.uid;

    let places;
    try{
        places = await Place.find({creator: uid});
    }catch(error){
        return next(new HttpError("Could Not find user or Error Occured, Check userID once again",500))
    }
    if(places.length==0){
        return next(new HttpError("No user found",404));
    }
    res.json({places: places.map(place=>place.toObject({getters: true}))});
}

exports.createPlace = async(req,res, next)=>{
    const error = validationResult(req); //express-validator performs check operation and pass error obj to next middleware
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError("Validation Failed", 422));
    }
    const {title, description, address, imageUrl, creator} = req.body;
    let coordinates;
    try{
        coordinates = await geoCoding(address);
    }catch{
        return next(new HttpError("Place can not be geocoded",400));
    }

    const createdPlace = new Place({
        title,
        description,
        imageUrl,
        address,
        location: coordinates,
        creator
    });
    console.log(creator);
    let existingUser;
    try{
        existingUser = await User.findById(creator);
    }catch(error){
        console.log(error);
        return next(new HttpError("Fetching userId failed check id once again or try again later",500));
    }
    if(!existingUser){
        return next(new HttpError("UserId do not exist, try again with valid userId",500));
    }

    //if existingUser then we initiate a transaction
    //sessions is created first to initiate transaction
    //reason: transaction offers us to perform multiple steps of operations
    //if any one operation is with-held due to server error or any unexpected error
    //we would want whole previous processes should also be undone
    //i.e. here we want if place is created than that place id is added to user's place field
    //but if saving the place fails due to any of the server error than we want to undo the place creation
    //i.e. only and only if place is created then place id should be added to user
    //and if place created and adding id to user fails, then we want to undo the whole process
    //as this will lead to invalid data

    //jab bhi dependent task krne ho jo ki tabhi commit hone chiye jab dono kaam purre ho
    //then use transaction taki if anyone fails whole process is undone
    //jaise ki yaha pr agar user mai placeId add krne mai agar problem ayye toh place creation should be undone
    //taki place tabhi create ho jab wo user

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session: sess});
        //.push automatically pushes only ID of createdPlace as relation was previously established between them.
        //Note: push will not push complete cretedPlace document it will only push related Id as relation is already established. 
        existingUser.places.push(createdPlace);
        await existingUser.save({session: sess});

        await sess.commitTransaction();

    }catch(err){
        return next(new HttpError(err.message, 500));
    }
    res.status(201).json({place: createdPlace});
};

exports.updatePlace = async (req,res,next)=>{
    const error = validationResult(req); //express-validator performs check operation and pass error obj to next middleware
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError("Validation Failed", 422));
    }

    const {title, description} = req.body;
    const pid = req.params.pid;
    let updatePlace;
    try{
        updatePlace = await Place.findById(pid);

    }catch(err){
        //sometimes when id is abnormal i.e. not of sufficient length then error is thrown
        //mongodb id is always of same length hence if even 1 char less then error is thrown
        return next(new HttpError("Fetching place by ID failed, check id once again.",500));
    };

    //if no place found then updatePlace will be undefined, hence such cases should return no place found
    if(!updatePlace){
        return next(new HttpError("No place found with given ID, check id once again.",500));
    }
    updatePlace.title= title;
    updatePlace.description = description;
    try{
        await updatePlace.save();

    }catch(err){
        return next(new HttpError("Updating place failed, try once again",500));
    };
    res.status(200).json({place: updatePlace.toObject({getters:true})});
}

exports.deletePlace= async(req,res,next) => {
    const pid= req.params.pid;
    let deletedPlace;
    try{    
        deletedPlace = await Place.findById(pid).populate('creator');
        //.populate('creator') will populate the creator doc with matching creator id
        //this will help us reach to places array of the creator directly on deletedPlace object
    }catch(error){
        return next(new HttpError("Fetching id failed, check id once again or try again later.", 500));
    }
    if(!deletedPlace){
        return next(new HttpError("No such place found to perform deletion",404));
        //when place not found for deletion
    }

    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await deletedPlace.deleteOne({session:sess});
        deletedPlace.creator.places.pull(deletedPlace);
        //pull will same as push
        //it will only refer to Id of deletedPlace object and pull the matching object
        //hence push/pull only refers to Id of the object to perform remove or add operations
        //pull/push will only work if relation was established between concerned fields
        //you need to always save after push/pull
        await deletedPlace.creator.save({session: sess});
        //deletedPlace.creator was populated with user data hence we can perform save on that
        //and this will surely save the user as it was populated
        await sess.commitTransaction();
    }catch(error){
        console.log(error);
        return next(new HttpError("Removing place failed, try again later.",500));
    }


    res.status(200).json({message: "deleted place", place: deletedPlace.toObject({getters:true})});
} ;

