import React,{useContext, useState} from "react";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/FormHook";
import { AuthContext } from "../../shared/context/AuthContext";
import { useHttpClient } from "../../shared/hooks/httpHook";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from "../../shared/components/FormElements/imageUpload";

const Auth = (props) => {
    const [isLogin,setIsLogin] =useState(true);
    const auth = useContext(AuthContext);

    const {isLoading, error, sendRequest, clearError}= useHttpClient()

    const handleSubmit = async(event)=>{
        event.preventDefault();
        if(isLogin){
            try{
                const responseData = await sendRequest('http://localhost:5000/api/users/login',
               'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password:formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                })
                
                auth.login(responseData.userId, responseData.token);
            }catch(error){

            }
        }else{
            try{
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email',formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest('http://localhost:5000/api/users/signup',
               'POST',
                formData
                )
                auth.login(responseData.userId, responseData.token);
            }catch(error){

            }
        }
    }

    const loginToggle = (event)=>{
        event.preventDefault();
        if(!isLogin === true){
            let newInputs ={};
            let formValid = true;
            for (let obj in formState.inputs){
                if(obj==="name" || obj ==="image"){
                    continue;
                }
                formValid = formValid && (formState.inputs[obj].isValid);
                newInputs = {...newInputs, [obj]:{...formState.inputs[obj]}};
            }
            setFormState({
                ...newInputs
            },formValid);
        }else{
            setFormState({
                ...formState.inputs,
                name:{
                    value:"",
                    isValid: false
                },
                image:{
                    value: null,
                    isValid: false
                } 
            },false);
        }
        setIsLogin((previousState=>!previousState)); 
    }
    const [formState, inputHandler, setFormState] = useForm(
        {
            email: {
                value: "",
                isValid: false,
            },
            password: {
                value: "",
                isValid: false,
            },
        },
        false
    );
    return (
        <>
        
        {isLoading && <LoadingSpinner Overlay />}
        <ErrorModal error={error} onClear={clearError}/>

        <form
            onSubmit={handleSubmit}
        >
            <button onClick={loginToggle}>Toggle Mode</button>
            {!isLogin && <Input
                id="name"
                element="input"
                type="text"
                placeholder="Full Name"
                label="User Name"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Must Enter your name."
                onInput={inputHandler}
            />}
            {!isLogin && <ImageUpload id="image" height={300} width={250} onInput={inputHandler} />}
            <Input
                id="email"
                element="input"
                type="text"
                placeholder="Email"
                label="E-Mail"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Must Enter Email to perform Login..."
                onInput={inputHandler}
                
            />
            <Input
                id="password"
                element="input"
                type="password"
                placeholder="Password"
                label="Password"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Minimum 5 characters required."
                onInput={inputHandler}
            />
            <button type="submit" disabled={!formState.isValid}>{isLogin?"LOGIN":"SIGN UP"}</button>
        </form>
        </>
    );
};

export default Auth;
