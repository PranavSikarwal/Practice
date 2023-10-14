import React,{useContext, useState} from "react";
import Input from "../../shared/components/FormElements/Input";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH
} from "../../shared/util/validators";
import {useForm} from "../../shared/hooks/FormHook";
import { AuthContext } from "../../shared/context/AuthContext";
const Auth = (props) => {
    const [isLogin,setIsLogin] =useState(true);
    const auth = useContext(AuthContext);

    const loginToggle = (event)=>{
        event.preventDefault();
        if(!isLogin === true){
            let newInputs ={};
            let formValid = true;
            for (let obj in formState.inputs){
                if(obj==="name"){
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
        <form
            onSubmit={(event) => {
                event.preventDefault();
                auth.login();
            }}
        >
            <button onClick={loginToggle}>Toggle Mode</button>
            {!isLogin && <Input
                id="name"
                element="input"
                type="text"
                placeholder="Full Name"
                label="User Name"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Must Enter your name."
                onInput={inputHandler}
            />}
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
    );
};

export default Auth;
