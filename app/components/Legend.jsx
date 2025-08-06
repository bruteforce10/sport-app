import React from "react";
import { Badge, Volleyball } from "lucide-react";
import {
  MdOutlineSportsSoccer,
  MdOutlineSportsTennis,
  MdOutlineSportsBasketball,
} from "react-icons/md";
import { TbSoccerField } from "react-icons/tb";

const SPORT_COLORS = {
  Badminton: "#FF6B6B", // Merah
  Futsal: "#4ECDC4", // Cyan
  Basketball: "#45B7D1", // Biru
  Tennis: "#96CEB4", // Hijau
  Football: "#FFEAA7", // Kuning
  Volleyball: "#DDA0DD", // Ungu
};

const SPORT_ICONS = {
  Badminton: Badge,
  Futsal: MdOutlineSportsSoccer,
  Basketball: MdOutlineSportsBasketball,
  Tennis: MdOutlineSportsTennis,
  Football: TbSoccerField,
  Volleyball: Volleyball,
};

const Legend = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-md shadow-md z-10 border border-gray-200 max-w-xs">
      <h3 className="font-bold text-sm mb-3">Kategori Olahraga</h3>
      <div className="space-y-2">
        {Object.entries(SPORT_COLORS).map(([sport, color]) => {
          const IconComponent = SPORT_ICONS[sport] || Badge;
          return (
            <div key={sport} className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8">
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    border: "2px solid white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent size={12} color="white" />
                </div>
              </div>
              <span className="text-xs font-medium">{sport}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Legend;
