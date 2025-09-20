"use client";
import SportMap from "../components/organisms/SportMap";
import SearchSection from "../components/organisms/SearchSection";


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        <SearchSection />
      </div>
      <SportMap />
    </main>
  );
}
