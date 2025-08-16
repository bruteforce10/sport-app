import React from "react";
import { Badge } from "lucide-react";
import { SPORT_COLORS, SPORT_ICONS } from "@/constant/ASSET";

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
      
      {/* Distance Legend */}
      <div className="border-t border-gray-200 mt-3 pt-3">
        <h4 className="font-bold text-sm mb-2">Jarak</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">Dalam radius</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-amber-700 shadow-sm"></div>
            <span className="text-xs text-gray-600">Di luar radius (fallback)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;
