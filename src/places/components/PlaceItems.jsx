import React, { useState } from "react";
import styles from "./PlaceItems.module.css";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/map";

const PlaceItems = (props) => {
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => {setShowMap(()=>true)};
  const closeMapHandler = () => setShowMap(false);
  
  return (
    <>
      <Modal
        show={showMap}
        onShow={openMapHandler}
        onClick={closeMapHandler}
        header={props.address}
        footer={<button onClick={closeMapHandler}>Cancel</button>}
      >
        <div className={styles.mapContainer}>
        <Map center={props.coordinates}/>
        </div>
      </Modal>
      <li className="placeItem__container">
        <div className={styles.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={styles.itemsInfo}>
          <h2>{props.title}</h2>
          <p>{props.address}</p>
          <p>{props.descriptiopn}</p>
        </div>
        <div className={styles.actions}>
          <button onClick={openMapHandler} className={styles.btn}>View on Map</button>
          <button className={styles.btn}>Edit</button>
          <button className={styles.btn}>Delete</button>
        </div>
      </li>
    </>
  );
};

export default PlaceItems;
