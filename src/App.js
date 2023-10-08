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
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace'
// import Map from "./shared/components/UIElements/map";
import Auth from "./users/pages/Auth";
import AuthContext from "./shared/context/AuthContext";

const App = () => {
  return (
    <AuthContext.provider>
      <Router>
        <MainHeader />
        <main className="main">
        <Switch>
          
            <Route path="/" exact>
              <Users />
            </Route>

            <Route path='/:userId/places' exact>
              <UserPlaces />
            </Route>
            
            <Route path="/places/new">
              <NewPlaces />
            </Route>
            <Route path="/places/:placeid">
              <UpdatePlace />
            </Route>
            <Route path="/auth">
              <Auth/>
            </Route>
            <Redirect to="/" />
          
        </Switch>
        </main>
      </Router>
    </AuthContext.provider>
  );
};

export default App;
