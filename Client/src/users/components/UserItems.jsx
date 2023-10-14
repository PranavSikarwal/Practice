import React from "react";
import { Link } from "react-router-dom";
import styles from "./UserItems.module.css";

const UserItems = (props) => {
  return (
    <Link className={styles.link} to={ `/${props.id}/places`}>
    <div className={styles.userItem} >
      
      <div className={styles.userInfo}>
        <div className={styles.img} style={{backgroundImage: `url(${props.image})`}}/>
        <div className={styles.name}><p>{props.name}</p></div>
      </div>
      <div className={styles.places}><p>{props.placeCount} {props.placeCount<1?"Place":"Places"}</p></div>
      
    </div>
    </Link>
  );
};

export default UserItems;
