const HttpError = require("../models/http-error");
const {validationResult} = require("express-validator");
const geoCoding = require('../utils/geoCoding');
const {v4} = require('uuid') //v4 specifically as it has timestamp component in it

let DummyPlaces = [
    {
      id: "p1",
      title: "Empire State Building",
      description: "One of the most famous sky scrapers in the world!!",
      imageUrl: "",
      address: "20 W 34th St, New York, NY 10001",
      location: {
        lat: 40.7484405,
        lng: -73.9878584,
      },
      creator: "u2",
    },
    {
      id: "p2",
      title: "Empire State Building",
      description: "One of the most famous sky scrapers in the world!!",
      imageUrl: "",
      address: "20 W 34th St, New York, NY 10001",
      location: {
        lat: 40.7484405,
        lng: -73.9878584,
      },
      creator: "u3",
    }
  ];
exports.getPlaceById = (req,res,next)=>{
    const pid = req.params.pid;
    console.log(pid);
    const place = DummyPlaces.find(p=> p.id===pid);
    if(!place){
        throw new HttpError("No such place found", 404); //only throw in sync code else do next()
    }

    res.json({place});

};
exports.getPlacesByUserId = (req,res,next)=>{
    const uid = req.params.uid;
    const places = DummyPlaces.filter(p=>p.creator==uid);
    if(places.length==0){
        return next(new HttpError("No user found",404));
    }
    res.json({places});
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
    const createdPlace = { 
        id: v4(),
        title: title, //also use just title as shortcut if key and value same
        description,
        imageUrl,
        address,
        location: coordinates,
        creator
    };
    DummyPlaces.push(createdPlace); //_.unshift() if want to add at start;
    res.status(201).json({place: createdPlace});
};

exports.updatePlace = (req,res,next)=>{
    const error = validationResult(req); //express-validator performs check operation and pass error obj to next middleware
    if(!error.isEmpty()){
        console.log(error);
        return next(new HttpError("Validation Failed", 422));
    }

    const {title, description} = req.body;
    const pid = req.params.pid;
    const updatePlace = {...DummyPlaces.find(p=>p.id===pid)}; //we copied the data of found place rather than making change at place directly
    //First create copy of change and then make change at that place rather than direclty making change at the place
    const updateIndex = DummyPlaces.findIndex(p=>p.id===pid);
    updatePlace.title= title;
    updatePlace.description = description;
    DummyPlaces[updateIndex] = updatePlace;
    res.status(200).json({place: updatePlace});
}

exports.deletePlace=(req,res,next) => {
    const pid= req.params.pid;
    const deletedPlace = DummyPlaces.find(p=>p.id===pid);
    if(!deletedPlace){
        return next(new HttpError("No such place found to perform deletion",404));
        //when place not found for deletion
    }

    DummyPlaces = DummyPlaces.filter(p => p.id!==pid);
    res.status(200).json({message: "deleted place", place: deletedPlace});
} ;

