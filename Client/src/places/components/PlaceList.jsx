import React from "react";
import styles from "./PlaceList.module.css";
import PlaceItem from './PlaceItems';

const PlaceList = (props) => {

  if (props.items.length == 0) {
    return (
      <div>
        <h2>No Places found...</h2>
      </div>
    );
  }
 
  return (
    <>
      <div className={styles.placeList}>
        {props.items.map((item) => (
          <PlaceItem
            key={item.id}
            id={item.id}
            title={item.title}
            image={process.env.REACT_APP_PINATA_HOSTED_URL + item.image}
            description={item.description}
            creatorId={item.creator}
            address={item.address}
            coordinates={item.location}
            onDelete = {props.onDeletePlace}
          />
        ))}
      </div>
    </>
  );
};

export default PlaceList;