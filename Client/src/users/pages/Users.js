import React,{useEffect, useState} from "react";
import UserList from "../components/UsersList";
import { useHttpClient } from "../../shared/hooks/httpHook";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

const Users = () => {

  const [loadedUsers, setLoadedUsers] = useState([]);

  const {isLoading, error, sendRequest, clearError} = useHttpClient();

  useEffect(()=>{
    const fetchUsers= async()=>{
      try{
        const responseData = await sendRequest(`${process.env.REACT_APP_HOSTED_URL}api/users`);
        setLoadedUsers(responseData.users)
      }catch(error){
        console.log(error);
      }
    }
    fetchUsers();
  },[sendRequest]);

  return <>
  <ErrorModal error={error} onClear={clearError} />
  {isLoading && (
    <div style={{display: "flex", alignItems: "center", justifyContent:"center",height:"90vh", width:"100%"}}>
      <LoadingSpinner />
    </div>
  )}
  <UserList items={loadedUsers} />

  </> ;
};

export default Users;
