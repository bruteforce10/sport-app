"use client";
import { useState, useMemo, useEffect } from "react";
import Map, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { events } from "../events";
import { Card } from "@/components/ui/card";

const MAPBOX_TOKEN = "pk.eyJ1IjoiYXNlcDEyIiwiYSI6ImNtOWhlczFscDA0M3kyb3E0c3B2M3JpczgifQ.sysimBWh0Tepfm3GFp1Nkg";

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function SportMap() {
  const [userLoc, setUserLoc] = useState({ lat: -6.2, lng: 106.816666 });
  const [radius, setRadius] = useState(10); // km
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          haversine(userLoc.lat, userLoc.lng, e.lat, e.lng) <= radius
      ),
    [userLoc, radius]
  );

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="md:w-2/3 w-full h-[400px] md:h-[500px]">
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: userLoc.lng,
            latitude: userLoc.lat,
            zoom: 12,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {/* Marker user */}
          <Marker longitude={userLoc.lng} latitude={userLoc.lat} color="blue" />
          {/* Marker event */}
          {filteredEvents.map((e) => (
            <Marker
              key={e.id}
              longitude={e.lng}
              latitude={e.lat}
              color={selected === e.id ? "red" : "green"}
              onClick={() => setSelected(e.id)}
            />
          ))}
        </Map>
        <div className="mt-2">
          <label>
            Radius: {" "}
            <input
              type="range"
              min={1}
              max={50}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            />{" "}
            {radius} km
          </label>
        </div>
      </div>
      <div className="md:w-1/3 w-full flex flex-col gap-2 mt-4 md:mt-0">
        {filteredEvents.map((e) => (
          <Card
            key={e.id}
            className={`p-4 cursor-pointer ${
              selected === e.id ? "border-2 border-blue-500" : ""
            }`}
            onClick={() => setSelected(e.id)}
          >
            <h3 className="font-bold">{e.name}</h3>
            <p>{e.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}