import React, { useReducer, useEffect } from "react";
import { validate } from "../../../shared/util/validators";

//useReducer is used to connect multiple states based upon state,action and dispatch paradigm to learn
//follow the below example
//we made a inputReducer function which is passed to useReducer to trigger when dispatch
//action object was passed into the inputReducer when calling dispatch in the changeHandler
//action.type determines which state must be returned based upon the dispatch action object passed
//it is necessary to default return state itself.

const inputReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE":
            return {
                ...state,
                val: action.val,
                isValid: validate(action.val, action.validators),
            };
        //validators are provided from props
        case "TOUCH":
            return { ...state, isTouched: true };
        default:
            return state;
    }
};

const Input = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        isValid: props.initialValid || false,
        val: props.initialValue || "",
        isToched: false,
    });
    const {id, onInput}= props;
    const {isValid, val}= inputState;

    useEffect(()=>{
        onInput(id,val,isValid);
    },[id,isValid,onInput,val]);

    const changeHandler = (event) => {
        //type must be matching to action.type switch statement
        dispatch({
            type: "CHANGE",
            val: event.target.value,
            validators: props.validators,
        });
    };
    const touchHandler = () => {
        dispatch({ type: "TOUCH" });
    };

    const element =
        props.element === "input" ? (
            <input
                type={props.type}
                id={props.id}
                placeholder={props.placeholder}
                onChange={changeHandler}
                value={inputState.val}
                onBlur={touchHandler}
            ></input>
        ) : (
            <textarea
                id={props.id}
                onBlur={touchHandler}
                value={inputState.val}
                onChange={changeHandler}
                rows={props.rows || 3}
            />
        );

    return (
        <div>
            <label htmlFor={props.id}> {props.label}</label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
        </div>
    );
};

export default Input;
