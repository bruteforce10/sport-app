"use client";
import { Card, CardContent } from "@/components/ui/card";

export default function EventCard({ event, isSelected, onClick }) {
  const getCategoryColor = (category) => {
    const colors = {
      "Badminton": "bg-red-500",
      "Futsal": "bg-blue-500",
      "Basketball": "bg-orange-500",
      "Tennis": "bg-green-500",
      "Football": "bg-purple-500",
      "Volleyball": "bg-pink-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const renderParticipants = () => {
    const circles = [];
    for (let i = 0; i < event.participants.max; i++) {
      circles.push(
        <div
          key={i}
          className={`w-6 h-6 rounded-full border-2 ${
            i < event.participants.current
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300"
          }`}
        />
      );
    }
    return circles;
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? "border-2 border-blue-500 bg-blue-50 shadow-lg transform scale-[1.02]" 
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Event Title */}
        <h3 className={`font-bold text-lg mb-3 ${
          isSelected ? "text-blue-900" : "text-gray-900"
        }`}>
          {event.name}
        </h3>

        {/* Category and Skill Level */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-600 text-sm">{event.skillLevel}</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-700 text-sm">
            {event.date}, {event.time}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-gray-700 text-sm">
            {event.location}
          </span>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {renderParticipants()}
          </div>
          <span className="text-gray-600 text-sm">
            {event.participants.current}/{event.participants.max}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-300 mb-4"></div>

        {/* Club Information */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">
              {event.club.name}
            </h4>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-gray-600 text-sm">
                {event.club.rating} ({event.club.reviews})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 