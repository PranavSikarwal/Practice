import React,{useEffect, useState} from "react";
import Input from "../../shared/components/FormElements/Input";
import { useParams } from "react-router-dom";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/FormHook";
const DummyPlaces = [
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
    },
];

const UpdatePlace = (props) => {
    const [isLoading, setIsLoading]= useState(true);
    const placeId = useParams().placeid;
    const onSubmitHandler = (event)=>{
        event.preventDefault();
        console.log(formState);
    }
    
    const [formState, inputChangeHandler,setFormData] = useForm({
        title:{
            value: "",
            isValid: false
        },
        dsc:{
            value: "",
            isValid: false
        }
    }, true);
    const identifiedPlace = DummyPlaces.find((places) => placeId === places.id);
    useEffect(()=>{
        if(identifiedPlace){
            setFormData({
                title:{
                    value: identifiedPlace.title,
                    isValid: true
                },
                dsc:{
                    value: identifiedPlace.description,
                    isValid:true
                }
            },true);
            setIsLoading(false);
        }
    },[setFormData, identifiedPlace]);
    if(!identifiedPlace){
        return <div>No place found...</div>
    }
    if(isLoading){
        return <div>Loading...</div>
    }
    return (
        <form onSubmit={onSubmitHandler}>
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                errorText = "Enter valid Title"
                validators={[VALIDATOR_REQUIRE()]}
                initialValue = {formState.inputs.title.value}
                initialValid= {true}
                onInput={inputChangeHandler}

            />
            <Input
                id="dsc"
                type="text"
                label="Description"
                errorText = "Enter valid Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                initialValue = {formState.inputs.dsc.value}
                initialValid = {true}
                onInput={inputChangeHandler}
            />
            <button type="submit" disabled={!formState.isValid}>Update</button>
        </form>
    );
};

export default UpdatePlace;
