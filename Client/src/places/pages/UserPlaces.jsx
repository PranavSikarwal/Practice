import React,{useEffect, useState} from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/httpHook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import styles from "./UserPlaces.module.css";


const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const uid = useParams().userId;
  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  useEffect(()=>{
    const fetchPlaces = async()=>{
      try{
        const responseData = await sendRequest(`${process.env.REACT_APP_HOSTED_URL}api/places/user/${uid}`);
        setLoadedPlaces(responseData.places);

      }catch(err){

      }
    }
    fetchPlaces();
  },[uid, sendRequest]);

  const placeDeleteHandler = (deletedId)=>{
    setLoadedPlaces(prevLoadedPlaces=> prevLoadedPlaces.filter(place=>place.id!==deletedId));
  }

  return (<>
  <ErrorModal error={error} onClear = {clearError} />
  {isLoading 
    && 
    <div style={{margin:"auto"}}>
      <LoadingSpinner /> 
    </div>}
  {!isLoading && < PlaceList onDeletePlace={placeDeleteHandler} items={loadedPlaces} />}
  </>);
};

export default UserPlaces;
