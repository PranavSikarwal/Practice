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
// import Map from "./shared/components/UIElements/map";

const App = () => {
  return (
    
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

          <Redirect to="/" />
        
      </Switch>
      </main>
    </Router>
  );
};

export default App;
