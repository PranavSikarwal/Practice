import React, { useState, useContext } from "react";
import "./PlaceItems.css";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/map";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHttpClient } from "../../shared/hooks/httpHook";
import ErrorModel from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/AuthContext";

const PlaceItems = (props) => {
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const openMapHandler = () => {
    setShowMap(() => true);
  };
  const closeMapHandler = () => setShowMap(false);
  const openDeleteModal = () => {
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
  };
  const confirmDeleteModal = async () => {
    setDeleteModal(false);
    console.log("Confirmed Deletion...");

    //we passed null in place of body
    await sendRequest(
      `${process.env.REACT_APP_HOSTED_URL}api/places/${props.id}`,
      "DELETE",
      null,
      { Authorization: `Bearer ${auth.token}` }
    );
    props.onDelete(props.id);
  };

  return (
    <>
      <ErrorModel error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onShow={openMapHandler}
        onClick={closeMapHandler}
        header={props.address}
        footer={<button onClick={closeMapHandler}>Cancel</button>}
      >
        <div>
          <Map center={props.coordinates} />
        </div>
      </Modal>
      <Modal
        show={showDeleteModal}
        onShow={openDeleteModal}
        onClick={closeDeleteModal}
        header={"Delete this Place"}
        footer={
          <>
            <button onClick={closeDeleteModal}>Cancel</button>
            <button onClick={confirmDeleteModal}>Delete</button>
          </>
        }
      >
        <p>Confirm delete this Place?</p>
      </Modal>
      <div styles={{display:"flex", height:"75vh", width:"100vw", alignItems:"center", justifyContent:"center"}}>
        {isLoading && <LoadingSpinner center asOverlay />}
      </div>
      <li className="custom-card">
        <h2 className="card-title">{props.title}</h2>

        <img
        className="card-image"
          src={props.image}
          style={{ height: 200, width: 300 }}
          alt={props.title}
        />
    
       
        <h3 className="card-description" >{props.description}</h3>
        <p className="card-address" style={{fontStyle:"italic"}}>{props.address}</p>
        
        <div className="button-container">
          <button className="card-button" onClick={openMapHandler} >
            View on Map
          </button>
          {auth.userId === props.creatorId && (
            <>
              <button  className="card-button " >
              <Link className="edit" to={`/places/${props.id}`}>
                Edit
              </Link>
              </button>
              <button className="card-button" onClick={openDeleteModal} >
                Delete
              </button>
            </>
          )}
        </div>
      </li>
    </>
  );
};

export default PlaceItems;
