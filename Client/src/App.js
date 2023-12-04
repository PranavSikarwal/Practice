import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Users from "./users/pages/Users";
import NewPlaces from "./places/pages/NewPlaces";
import MainHeader from "./shared/components/NavBar/mainHeader";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
// import Map from "./shared/components/UIElements/map";
import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/AuthContext";
import { useAuth } from "./shared/hooks/auth-hook";

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
        <main className="main">{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
