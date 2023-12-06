import "./App.css";
import React, {Suspense} from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
// import Users from "./users/pages/Users";
// import NewPlaces from "./places/pages/NewPlaces";
import MainHeader from "./shared/components/NavBar/mainHeader";
// import UserPlaces from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/AuthContext";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";


const Users = React.lazy(()=> import('./users/pages/Users'));
const NewPlaces = React.lazy(()=> import('./places/pages/NewPlaces'));
const UserPlaces = React.lazy(()=> import('./places/pages/UserPlaces'));
const UpdatePlace= React.lazy(()=> import('./places/pages/UpdatePlace'));
const Auth = React.lazy(()=> import('./users/pages/Auth'));

const App = () => {
  let routes;
  const {token, login, logout, userId } = useAuth();
  
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new">
          <NewPlaces />
        </Route>
        <Route path="/places/:placeid">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedin: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainHeader />
        <Suspense fallback={<div style={{height:"80vh", width:"100vw", display:"flex", alignItems:"center", justifyContent:"center"}}><LoadingSpinner /></div>}>
        <main className="main">{routes}</main>
        </Suspense>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
