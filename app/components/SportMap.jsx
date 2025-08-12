"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import { LocateFixed } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";
import { events } from "../events";
import EventCard from "./EventCard";
import Legend from "./Legend";
import CustomMarker from "./CustomMarker";
import { haversine, calculateTravelTime, createGeoJSONCircle } from "@/lib/geo";
import { useSwipeable } from "react-swipeable";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiYXNlcDEyIiwiYSI6ImNtOWhlczFscDA0M3kyb3E0c3B2M3JpczgifQ.sysimBWh0Tepfm3GFp1Nkg";

export default function SportMap() {
  const [userLoc, setUserLoc] = useState({ lat: -6.2, lng: 106.816666 });
  const [radius, setRadius] = useState(10); // km
  const [selected, setSelected] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);
  const [selectedTransportMode, setSelectedTransportMode] = useState("driving");
  const cardRefs = useRef({});
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: userLoc.lng,
    latitude: userLoc.lat,
    zoom: 12,
  });

  // Swipe handlers
  const triggerSwipeHandlers = useSwipeable({
    onSwipedUp: () => setIsDrawerOpen(true),
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 15,
  });

  const contentSwipeHandlers = useSwipeable({
    onSwipedDown: () => setIsDrawerOpen(false),
    trackTouch: true,
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 15,
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

  // Reorder events for mobile so that the selected one appears first
  const mobileOrderedEvents = useMemo(() => {
    if (!selected) return filteredEvents;
    const selectedEvent = filteredEvents.find((e) => e.id === selected);
    if (!selectedEvent) return filteredEvents;
    const others = filteredEvents.filter((e) => e.id !== selected);
    return [selectedEvent, ...others];
  }, [filteredEvents, selected]);

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
    // Open the drawer on mobile
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsDrawerOpen(true);
    }

    // Scroll behavior: desktop centers to card, mobile scrolls to top
    setTimeout(() => {
      const containerElement = containerRef.current;
      if (!containerElement) return;
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        containerElement.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const cardElement = cardRefs.current[event.id];
      if (cardElement) {
        const containerRect = containerElement.getBoundingClientRect();
        const cardRect = cardElement.getBoundingClientRect();
        const currentScrollTop = containerElement.scrollTop;
        const offsetWithinContainer = cardRect.top - containerRect.top;
        const targetScrollTop =
          currentScrollTop + offsetWithinContainer - containerElement.clientHeight / 2 + cardRect.height / 2;
        const maxScroll = containerElement.scrollHeight - containerElement.clientHeight;
        const clamped = Math.max(0, Math.min(targetScrollTop, maxScroll));
        containerElement.scrollTo({ top: clamped, behavior: "smooth" });
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
    setIsDrawerOpen(false);
  };

  const renderMap = () => (
    <Map
      ref={mapRef}
      mapboxAccessToken={MAPBOX_TOKEN}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      style={{ height: "calc(100% - 64px)", width: "100%" }}
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
          <div className="p-3 min-w-[200px]">
            <h3 className="font-bold text-sm mb-2">{popupInfo.name}</h3>
            <p className="text-xs text-gray-600 mb-2">
              Jarak:{" "}
              {haversine(
                userLoc.lat,
                userLoc.lng,
                popupInfo.lat,
                popupInfo.lng
              ).toFixed(1)}{" "}
              km
            </p>

            {/* Transport Mode Selection */}
            <div className="mb-2">
              <label className="text-xs font-medium text-gray-700 mb-1 block">
                Mode Transportasi:
              </label>
              <div className="flex gap-1">
                {[
                  { value: "walking", label: "🚶", title: "Berjalan Kaki" },
                  { value: "motorcycle", label: "🏍️", title: "Motor" },
                  { value: "driving", label: "🚗", title: "Mobil" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setSelectedTransportMode(mode.value)}
                    className={`px-2 py-1 text-xs rounded border transition-colors ${
                      selectedTransportMode === mode.value
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    title={mode.title}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Time Display */}
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-700">
                <span className="font-medium">Estimasi Waktu:</span>
              </p>
              <p className="text-sm font-semibold text-blue-600">
                {calculateTravelTime(
                  haversine(
                    userLoc.lat,
                    userLoc.lng,
                    popupInfo.lat,
                    popupInfo.lng
                  ),
                  selectedTransportMode
                )}
              </p>
            </div>
          </div>
        </Popup>
      )}

      {/* Kotak informasi & radius control */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md z-10 border border-gray-200 w-64">
        <h3 className="font-bold text-sm mb-1">Informasi Radius</h3>
        <p className="text-sm mb-2">
          <span className="font-medium">{filteredEvents.length}</span> event
          dalam radius {radius} km
        </p>
        <input
          type="range"
          min={1}
          max={50}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Locate button */}
      <button
        type="button"
        aria-label="Lokasi saya"
        onClick={() =>
          setViewState((vs) => ({
            ...vs,
            longitude: userLoc.lng,
            latitude: userLoc.lat,
            zoom: 13,
            transitionDuration: 800,
          }))
        }
        className="absolute top-4 right-4 z-10 rounded-full border bg-white shadow-md p-2 text-gray-700 hover:bg-gray-50"
      >
        <LocateFixed className="w-5 h-5" />
      </button>

      {/* Legend */}
      <Legend />
    </Map>
  );

  return (
    <div className="w-full">
      {/* Mobile: full map with swipeable bottom drawer */}
      <div className="relative md:hidden h-[calc(100vh-64px)]">
        {renderMap()}

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger>
            <div
              {...triggerSwipeHandlers}
              className="absolute w-full min-h-40 -bottom-14 bg-white px-4 py-2 rounded-md "
            >
              <div className="w-24 h-1.5 mt-2 mx-auto bg-gray-100 rounded-full" />
            </div>
          </DrawerTrigger>
          <DrawerContent {...contentSwipeHandlers}>
            <DrawerHeader>
              <div className="p-4">
                <div
                  ref={containerRef}
                  className="max-h-[40vh] overflow-y-auto scroll-smooth space-y-4"
                >
                  {mobileOrderedEvents.map((e) => (
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
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Desktop: map + sidebar list */}
      <div className="hidden md:grid md:grid-cols-[2fr_1fr] md:gap-4 md:h-[calc(100vh-96px)]">
        <div className="relative w-full h-full rounded-lg overflow-hidden">
          {renderMap()}
        </div>
        <div
          ref={containerRef}
          className="w-full flex flex-col gap-4 max-h-full overflow-y-auto scroll-smooth"
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
    </div>
  );
}
