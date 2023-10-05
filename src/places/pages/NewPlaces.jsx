import React, { useCallback, useReducer } from "react";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import styles from "./NewPlaces.module.css";
import Input from "../../shared/components/FormElements/Input";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          if(inputId!== "isValid"){
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid
      };
    default:
      return state;
  }
};

const NewPlaces = () => {
  const placeSubmitHandler = (event)=>{
    event.preventDefault();
  }
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: {
        value: "",
        isValid: false,
      },
      dsc: {
        value: "",
        isValid: false,
      },
      address:{
        value:"",
        isValid:false,
      },
      isValid: false,
    },
  });
  //this function must be inside useCallback as it is dependency of useEffect in Input element
  //So whenever NewPlace re renders new copy of below function is created
  //which triggers useEffect and hence trigger inputHandler again and loop runs again and again
  const inputHandler = useCallback((id, val, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: val,
      isValid: isValid,
      inputId: id
    })
  }, []);
  //[] specifies under no dependency the above callBack should be recreated
  return (
    <form onSubmit = {placeSubmitHandler}>
      <Input
        element="input"
        type="text"
        label="Title"
        id="title"
        errorText="Enter valid Ttitle"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
      />
      <Input
        type="text"
        label="Description"
        id="dsc"
        errorText="Enter valid Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        onInput={inputHandler}
      />
      <Input
        element="input"
        type="text"
        label="Address"
        id="address"
        errorText="Enter valid Address"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputHandler}
      />
      <button type="submit" disabled={!formState.isValid}>Add Place</button>
    </form>
  );
};

export default NewPlaces;
