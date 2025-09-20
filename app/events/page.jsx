"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "../../components/molecules/EventCard";
import { events } from "../events";
import SearchSection from "../../components/organisms/SearchSection";

function filterEvents({ search, city, category }) {
  const keyword = (search || "").toString().trim().toLowerCase();
  const cityLower = (city || "").toString().trim().toLowerCase();
  const categoryLower = (category || "").toString().trim().toLowerCase();

  return events.filter((e) => {
    // keyword match across multiple fields
    const matchesKeyword = keyword
      ? [e.name, e.category, e.location, e.club?.name, e.skillLevel]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      : true;

    // city match inside the location text
    const matchesCity = cityLower
      ? (e.location || "").toLowerCase().includes(cityLower)
      : true;

    // category exact match
    const matchesCategory = categoryLower
      ? (e.category || "").toLowerCase() === categoryLower
      : true;

    return matchesKeyword && matchesCity && matchesCategory;
  });
}

export default function EventsPage() {
  const searchParams = useSearchParams();
  const search = (searchParams.get("search") || "").toString().trim();
  const city = (searchParams.get("city") || "").toString().trim();
  const category = (searchParams.get("category") || "").toString().trim();
  const filtered = useMemo(
    () => filterEvents({ search, city, category }),
    [search, city, category]
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <SearchSection />
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Daftar Kegiatan</h1>
          <p className="text-sm text-gray-600 flex flex-wrap items-center gap-2">
            <span className="text-gray-500">Menampilkan</span>
            <span className="font-medium">{filtered.length}</span>
            <span className="text-gray-500">event mabar</span>
            {(search || city || category) && (
              <span className="text-gray-400">•</span>
            )}
            {search && (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">kata: {search}</span>
            )}
            {city && (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">kota: {city}</span>
            )}
            {category && (
              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">cabang: {category}</span>
            )}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            Tidak ada kegiatan yang cocok.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} isSelected={false} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}


