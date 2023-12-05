import React, { useEffect, useState, useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import { useParams } from "react-router-dom";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/FormHook";
import { AuthContext } from "../../shared/context/AuthContext";
import { useHttpClient } from "../../shared/hooks/httpHook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const UpdatePlace = (props) => {
  const histroy = useHistory();
  const auth = useContext(AuthContext);
  const placeId = useParams().placeid;
  const { isLoading, error, sendRequest, clearError, cleanUpCode } = useHttpClient();
  const [identifiedPlace, setIdentifiedPlace] = useState();

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    try {
        console.log(formState);
        await sendRequest(
          `${process.env.REACT_APP_HOSTED_URL}api/places/${placeId}`,
          "PATCH",
          JSON.stringify({
            title: formState.inputs.title.value,
            description: formState.inputs.dsc.value
          }),
          { "Content-Type": "application/json" ,
          Authorization: `Bearer ${auth.token}`}
        );
        histroy.push('/'+auth.userId+'/places');//redirect user to starting page
      } catch (error) {}
  };

  const [formState, inputChangeHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      dsc: {
        value: "",
        isValid: false,
      },
    },
    true
  );

  useEffect(() => {
    const fetchPlaces = async () => {
        try{
            const responseData = await sendRequest(
                `${process.env.REACT_APP_HOSTED_URL}api/places/${placeId}`
              );
              setIdentifiedPlace(responseData.place);
      
              setFormData(
                {
                  title: {
                    value: responseData.place.title,
                    isValid: true,
                  },
                  dsc: {
                    value: responseData.place.description,
                    isValid: true,
                  },
                },
                true
              );
        }catch(error){
            console.log(error);
        }
      
    };
    fetchPlaces();
  }, [setFormData, sendRequest, placeId, cleanUpCode]);

  if (!identifiedPlace) {
    return <div>No place found...</div>;
  }
  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && identifiedPlace && (
        <form onSubmit={onSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            errorText="Enter valid Title"
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={identifiedPlace.title}
            initialValid={true}
            onInput={inputChangeHandler}
          />
          <Input
            id="dsc"
            type="text"
            label="Description"
            errorText="Enter valid Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            initialValue={identifiedPlace.description}
            initialValid={true}
            onInput={inputChangeHandler}
          />
          <button style={{margin:"0"}} className="card-button" type="submit" disabled={!formState.isValid}>
            Update
          </button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
