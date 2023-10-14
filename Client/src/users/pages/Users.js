import React from "react";
import UserList from "../components/UsersList";

const Users = () => {
  const USERS = [
    {
      name: "John ABC",
      id: "u1",
      places: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOtu74pEiq7ofeQeTsco0migV16zZoBwSlGg&usqp=CAU",
    }
  ];
  return <UserList items={USERS} />;
};

export default Users;
