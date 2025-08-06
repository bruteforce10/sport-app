"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { events } from "../events";
import EventCard from "./EventCard";
import { Badge } from "lucide-react";
import Legend from "./Legend";
import { SPORT_COLORS, SPORT_ICONS } from "@/constant/ASSET";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYXNlcDEyIiwiYSI6ImNtOWhlczFscDA0M3kyb3E0c3B2M3JpczgifQ.sysimBWh0Tepfm3GFp1Nkg";

// Custom Marker Component dengan concentric circles dan icon
function CustomMarker({ sport, isSelected, onClick }) {
  const color = SPORT_COLORS[sport] || "#666666";
  const IconComponent = SPORT_ICONS[sport] || Badge;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        transform: isSelected ? "scale(1.2)" : "scale(1)",
        transition: "transform 0.2s ease",
        filter: isSelected ? "drop-shadow(0 0 8px rgba(0,0,0,0.3))" : "none",
      }}
    >
      {/* Outer circle (halo effect) */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: color,
          opacity: 0.3,
          position: "absolute",
          top: "-20px",
          left: "-20px",
          zIndex: 1,
        }}
        className="animate-ping"
      />
      {/* Inner circle (solid) */}
      <div
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          backgroundColor: color,
          position: "absolute",
          top: "-16px",
          left: "-16px",
          zIndex: 2,
          border: "2px solid white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconComponent size={16} color="white" />
      </div>
    </div>
  );
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Fungsi untuk membuat GeoJSON lingkaran
function createGeoJSONCircle(center, radiusInKm) {
  const points = 64;
  const coords = {
    latitude: center.lat,
    longitude: center.lng,
  };

  const km = radiusInKm;
  const ret = [];
  const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
  const distanceY = km / 110.574;

  let theta, x, y;
  for (let i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI);
    x = distanceX * Math.cos(theta);
    y = distanceY * Math.sin(theta);
    ret.push([coords.longitude + x, coords.latitude + y]);
  }
  ret.push(ret[0]); // Tutup poligon

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [ret],
        },
        properties: {},
      },
    ],
  };
}

export default function SportMap() {
  const [userLoc, setUserLoc] = useState({ lat: -6.2, lng: 106.816666 });
  const [radius, setRadius] = useState(10); // km
  const [selected, setSelected] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const cardRefs = useRef({});
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: userLoc.lng,
    latitude: userLoc.lat,
    zoom: 12,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const newLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserLoc(newLoc);
        setViewState({
          longitude: newLoc.lng,
          latitude: newLoc.lat,
          zoom: 12,
        });
      });
    }
  }, []);

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (e) => haversine(userLoc.lat, userLoc.lng, e.lat, e.lng) <= radius
      ),
    [userLoc, radius]
  );

  // Data GeoJSON untuk lingkaran radius
  const radiusData = useMemo(
    () => createGeoJSONCircle(userLoc, radius),
    [userLoc, radius]
  );

  const handleMarkerClick = (event) => {
    setSelected(event.id);
    setPopupInfo(event);

    // Zoom dan fokus ke marker yang diklik
    setViewState({
      longitude: event.lng,
      latitude: event.lat,
      zoom: 15,
      transitionDuration: 1000,
    });

    // Auto-scroll to the selected card
    setTimeout(() => {
      const cardElement = cardRefs.current[event.id];
      const containerElement = containerRef.current;

      if (cardElement && containerElement) {
        const cardRect = cardElement.getBoundingClientRect();

        const cardTop = cardElement.offsetTop;
        const containerHeight = containerElement.clientHeight;

        // Calculate the scroll position to center the card
        const targetScrollTop =
          cardTop - containerHeight / 2 + cardRect.height / 2;

        containerElement.scrollTo({
          top: targetScrollTop,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleCardClick = (eventId) => {
    const event = filteredEvents.find((e) => e.id === eventId);
    if (event) {
      setSelected(eventId);
      setPopupInfo(null);

      // Zoom dan fokus ke marker yang terkait dengan card yang diklik
      setViewState({
        longitude: event.lng,
        latitude: event.lat,
        zoom: 15,
        transitionDuration: 1000,
      });
    }
  };

  const closePopup = () => {
    setPopupInfo(null);
  };

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <div className="md:w-2/3 w-full h-[400px] md:h-[500px] relative">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {/* Radius Overlay */}
          <Source id="radius-circle" type="geojson" data={radiusData}>
            <Layer
              id="radius-circle-fill"
              type="fill"
              paint={{
                "fill-color": "#3B82F6",
                "fill-opacity": 0.1,
              }}
            />
            <Layer
              id="radius-circle-border"
              type="line"
              paint={{
                "line-color": "#3B82F6",
                "line-width": 2,
                "line-opacity": 0.6,
              }}
            />
          </Source>

          {/* Marker user */}
          <Marker longitude={userLoc.lng} latitude={userLoc.lat} color="red" />

          {/* Custom Marker event dengan concentric circles */}
          {filteredEvents.map((e) => (
            <Marker
              key={e.id}
              longitude={e.lng}
              latitude={e.lat}
              onClick={() => handleMarkerClick(e)}
            >
              <CustomMarker
                sport={e.category}
                isSelected={selected === e.id}
                onClick={() => handleMarkerClick(e)}
              />
            </Marker>
          ))}

          {/* Popup for selected marker */}
          {popupInfo && (
            <Popup
              longitude={popupInfo.lng}
              latitude={popupInfo.lat}
              anchor="bottom"
              onClose={closePopup}
              closeButton={true}
              closeOnClick={false}
              className="z-10"
            >
              <div className="p-2">
                <h3 className="font-bold text-sm">{popupInfo.name}</h3>
                <p className="text-xs text-gray-600">{popupInfo.category}</p>
                <p className="text-xs text-gray-500">{popupInfo.location}</p>
              </div>
            </Popup>
          )}

          {/* Kotak informasi jumlah event dalam radius */}
          <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md z-10 border border-gray-200">
            <h3 className="font-bold text-sm mb-1">Informasi Radius</h3>
            <p className="text-sm">
              <span className="font-medium">{filteredEvents.length}</span> event
              dalam radius {radius} km
            </p>
          </div>

          {/* Legend */}
          <Legend />
        </Map>
        <div className="mt-2">
          <label>
            Radius:{" "}
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
      <div
        ref={containerRef}
        className="md:w-1/3 w-full flex flex-col gap-4 mt-4 md:mt-0 max-h-[500px] overflow-y-auto scroll-smooth"
      >
        {filteredEvents.map((e) => (
          <div
            key={e.id}
            ref={(el) => {
              cardRefs.current[e.id] = el;
            }}
          >
            <EventCard
              event={e}
              isSelected={selected === e.id}
              onClick={() => handleCardClick(e.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
