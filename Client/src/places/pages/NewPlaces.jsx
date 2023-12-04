import React, { useContext } from "react";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import Input from "../../shared/components/FormElements/Input";
import { useForm } from "../../shared/hooks/FormHook";
import {AuthContext} from "../../shared/context/AuthContext";
import { useHttpClient } from "../../shared/hooks/httpHook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom"; //used to perform redirection
import ImageUpload from "../../shared/components/FormElements/imageUpload";

const NewPlaces = () => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const histroy = useHistory();
  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      console.log(auth.user);
      const formData = new FormData();
      formData.append('title',formState.inputs.title.value);
      formData.append('description',formState.inputs.dsc.value);
      formData.append('address',formState.inputs.address.value);
      formData.append('creator',auth.userId);
      formData.append('image',formState.inputs.image.value);

      await sendRequest(
        `${process.env.REACT_APP_HOSTED_URL}api/places/`,
        "POST",
        formData,
        {Authorization: `Bearer ${auth.token}`}
      );
      histroy.push('/');//redirect user to starting page
    } catch (error) {}
  };
  const [formState, inputChangeHandler] = useForm(
    {
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
      image:{
        value:null,
        isValid: false
      }
    },
    false
  );

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
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
        <ImageUpload id="image" height={200} width={300} onInput={inputChangeHandler} />
        <button type="submit" disabled={!formState.isValid}>
          Add Place
        </button>
      </form>
    </>
  );
};

export default NewPlaces;
