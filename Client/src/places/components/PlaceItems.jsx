import React, { useState, useContext } from "react";
import styles from "./PlaceItems.module.css";
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
      `http://localhost:5000/api/places/${props.id}`,
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
        <div className={styles.mapContainer}>
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
      <li className="placeItem__container">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className={styles.image}>
          <img
            src={props.image}
            style={{ height: 200, width: 300 }}
            alt={props.title}
          />
        </div>
        <div className={styles.itemsInfo}>
          <h2>{props.title}</h2>
          <p>{props.address}</p>
          <p>{props.descriptiopn}</p>
        </div>
        <div className={styles.actions}>
          <button onClick={openMapHandler} className={styles.btn}>
            View on Map
          </button>
          {auth.userId === props.creatorId && (
            <>
              <Link to={`/places/${props.id}`}>
                <button className={styles.btn}>Edit</button>
              </Link>
              <button onClick={openDeleteModal} className={styles.btn}>
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
