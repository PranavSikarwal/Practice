import React from "react";
import UserItem from "./UserItems";
import styles from './UsersList.module.css'

const UsersList = (props) => {
  if (props.items.length?props.items.length === 0:false) {
    return (
      <>
        <h2>No Users Found!!!</h2>
      </>
    );
  }
  return (
    <ul className={styles.list}>
      {props.items.map((user) => 
        < UserItem
          key={user.id}
          name={user.name}
          id={user.id}
          image={`${process.env.REACT_APP_PINATA_HOSTED_URL}${user.image}`}
          placeCount={user.places.length}
        />
      )}
    </ul>
  );
};

export default UsersList;