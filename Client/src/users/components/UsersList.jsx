import React from "react";
import UserItem from "./UserItems";
import styles from './UsersList.module.css'

const UsersList = (props) => {
  if (props.items.length === 0) {
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
          image={user.image}
          placeCount={user.places}
        />
      )}
    </ul>
  );
};

export default UsersList;