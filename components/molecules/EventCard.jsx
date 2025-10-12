import Image from "next/image";
import { MapPin, Calendar, Clock, Users, Star, Eye, Activity } from "lucide-react";

const EventCard = ({ event }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSportIcon = (sport) => {
    const icons = {
      badminton: Activity,
      basketball: "🏀",
      futsal: "⚽",
      tennis: "🎾",
      volleyball: "🏐",
      padel: "🎾"
    };
    return icons[sport] || Activity;
  };

  const getSportEmoji = (sport) => {
    const emojis = {
      badminton: "🏸",
      basketball: "🏀", 
      futsal: "⚽",
      tennis: "🎾",
      volleyball: "🏐",
      padel: "🎾"
    };
    return emojis[sport] || "🏸";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header dengan harga dan ikon */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(event.price)}
          </span>
          <span className="text-sm text-gray-500">, Inc. Shuttlecock</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-gray-400" />
          <span className="text-2xl">{getSportEmoji(event.sport)}</span>
        </div>
      </div>

      {/* Judul event */}
      <h3 className="font-bold text-lg text-gray-900 mb-3">
        {event.clubName} - {event.eventType}
      </h3>

      {/* Detail aktivitas */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <span className="text-lg">{getSportEmoji(event.sport)}</span>
          <span className="font-medium">{event.sport}</span>
          <span className="text-gray-400">•</span>
          <span>{event.skillLevel}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{event.date}</span>
          <span className="text-gray-400">•</span>
          <Clock className="w-4 h-4" />
          <span>{event.time}</span>
        </div>

        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <div>
            <span className="font-medium">{event.court}</span>
            <span className="text-gray-400"> • </span>
            <span>{event.venue}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 ml-6">
          {event.location}
        </div>
      </div>

      {/* Status booking */}
      <div className="mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Booked via AYO
        </span>
      </div>

      {/* Peserta dan kapasitas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Avatar peserta */}
          <div className="flex -space-x-2">
            {(Array.isArray(event.participants) ? event.participants : []).slice(0, 3).map((participant, index) => (
              <div key={index} className="relative">
                {participant.avatar ? (
                  <Image
                    src={participant.avatar}
                    alt={participant.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold">
                    {participant.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                )}
              </div>
            ))}
            
            {/* Slot kosong */}
            {Array.from({ length: Math.max(0, event.maxParticipants - (Array.isArray(event.participants) ? event.participants.length : 0)) }).map((_, index) => (
              <div key={`empty-${index}`} className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-xs">+</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <span className="text-gray-400">•</span> {event.currentParticipants || (Array.isArray(event.participants) ? event.participants.length : 0)}/{event.maxParticipants || 0}
        </div>
      </div>

      {/* Footer dengan logo club */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-700 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">🏸</span>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              BREAK POINT CLUB
            </div>
          </div>
          <div className="font-bold text-sm text-gray-900">
            {event.clubName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;