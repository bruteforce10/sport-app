"use client";
import EventCard from "../components/EventCard";
import { events } from "../events";

export default function EventsPage({ searchParams }) {
  const search = (searchParams?.search || "").toString().trim();
  const keyword = search.toLowerCase();

  const filtered = keyword
    ? events.filter((e) => {
        const haystack = [
          e.name,
          e.category,
          e.location,
          e.club?.name,
          e.skillLevel,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(keyword);
      })
    : events;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Daftar Kegiatan</h1>
          {search && (
            <p className="text-sm text-gray-600">
              Hasil untuk: <span className="font-medium">{search}</span> 
              <span className="ml-2 text-gray-400">({filtered.length})</span>
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            Tidak ada kegiatan yang cocok.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} isSelected={false} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


