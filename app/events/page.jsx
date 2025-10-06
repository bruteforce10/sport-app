'use client';

import EventCard from "@/components/molecules/EventCard";

export default function EventsPage() {
  // Sample data berdasarkan referensi gambar
  const sampleEvents = [
    {
      id: 1,
      price: 45000,
      clubName: "Break Point Club",
      eventType: "Open Session",
      sport: "badminton",
      skillLevel: "Beginner - Intermediate",
      date: "Sen, 06 Okt 2025",
      time: "20:00 - 22:00",
      court: "Lapangan 1",
      venue: "Jifi Badminton Arena",
      location: "Tebet, Kota Jakarta Selatan",
      currentParticipants: 9,
      maxParticipants: 14,
      participants: [
        { name: "Ahmad Jaya", avatar: null },
        { name: "Indra Adi", avatar: null },
        { name: "Tina Fitri", avatar: null },
        { name: "Budi Santoso", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
        { name: "Sari Dewi", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" }
      ]
    },
    {
      id: 2,
      price: 35000,
      clubName: "Sports Center",
      eventType: "Weekly Training",
      sport: "basketball",
      skillLevel: "Intermediate - Advanced",
      date: "Rab, 08 Okt 2025",
      time: "19:00 - 21:00",
      court: "Court A",
      venue: "Basketball Arena",
      location: "Senayan, Jakarta Pusat",
      currentParticipants: 6,
      maxParticipants: 10,
      participants: [
        { name: "Rizky Pratama", avatar: null },
        { name: "Dewi Sari", avatar: null },
        { name: "Agus Wijaya", avatar: null }
      ]
    },
    {
      id: 3,
      price: 25000,
      clubName: "Futsal Pro",
      eventType: "Casual Play",
      sport: "futsal",
      skillLevel: "All Levels",
      date: "Jum, 10 Okt 2025",
      time: "18:00 - 20:00",
      court: "Lapangan 2",
      venue: "Futsal Center",
      location: "Menteng, Jakarta Pusat",
      currentParticipants: 8,
      maxParticipants: 10,
      participants: [
        { name: "Bambang", avatar: null },
        { name: "Citra", avatar: null },
        { name: "Dedi", avatar: null },
        { name: "Eka", avatar: null }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Events</h1>
          <p className="text-xl text-gray-600">
            Temukan dan ikuti event olahraga terbaik di sekitar Anda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}