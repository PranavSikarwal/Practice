import React from "react";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/FormHook";

const NewPlaces = () => {
  const placeSubmitHandler = (event) => {
    event.preventDefault();
  };
  const [formState, inputChangeHandler] = useForm({
    title: {
      value: "",
      isValid: false,
    },
    dsc: {
      value: "",
      isValid: false,
    },
    address: {
      value: "",
      isValid: false,
    },
  },false);

  return (
    <form onSubmit={placeSubmitHandler}>
      <Input
        element="input"
        type="text"
        label="Title"
        id="title"
        errorText="Enter valid Ttitle"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputChangeHandler}
      />
      <Input
        type="text"
        label="Description"
        id="dsc"
        errorText="Enter valid Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        onInput={inputChangeHandler}
      />
      <Input
        element="input"
        type="text"
        label="Address"
        id="address"
        errorText="Enter valid Address"
        validators={[VALIDATOR_REQUIRE()]}
        onInput={inputChangeHandler}
      />
      <button type="submit" disabled={!formState.isValid}>
        Add Place
      </button>
    </form>
  );
};

export default NewPlaces;
