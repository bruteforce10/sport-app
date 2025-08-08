import SportMap from "./components/SportMap";
import { Search, SlidersHorizontal } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="font-extrabold tracking-wider text-lg">LOGO</div>
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari Kompetisi"
                className="w-full rounded-full border border-gray-200 bg-white px-9 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
          <button
            type="button"
            aria-label="Filter"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map + Content */}
      <SportMap />
    </main>
  );
}
