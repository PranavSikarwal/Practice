import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "./map.css";
const Map = (props) => {
  const mapElement = useRef(null);
  const map = useRef(null);
  const { lng, lat } = props.center;
  const zoom = props.zoom;
  useEffect(
    (props) => {
      if (map.current) return; // stops map from intializing more than once

      map.current = new maplibregl.Map({
        container: mapElement.current,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=kz8mKa100yMMjUbEVCYX`,
        center: [lng, lat],
        zoom: 15,
      });
      
      new maplibregl.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(map.current);
    },
    [lng, lat]
  );

  return (
    <div className="map-wrap">
      <div ref={mapElement} className="map" />
    </div>
  );
};

export default Map;
