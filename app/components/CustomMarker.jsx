"use client";

import { Badge } from "lucide-react";
import { SPORT_COLORS, SPORT_ICONS } from "@/constant/ASSET";

export default function CustomMarker({ sport, isSelected, onClick }) {
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


