import React from "react";
import PlaceList from "../components/PlaceList";
import styles from "./UserPlaces.module.css";
import { useParams } from "react-router-dom";

const DummyPlaces = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!!",
    imageUrl: "",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!!",
    imageUrl: "",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u3",
  }
];

const UserPlaces = () => {
  const uid= useParams().userId;
  const loadedPlaces = DummyPlaces.filter(places=>places.creator===uid);
  return (<PlaceList items={loadedPlaces} />);
};

export default UserPlaces;
