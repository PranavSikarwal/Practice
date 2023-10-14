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
            image={item.imageUrl}
            description={item.description}
            creatorId={item.creator}
            address={item.address}
            coordinates={item.location}
          />
        ))}
      </div>
    </>
  );
};

export default PlaceList;