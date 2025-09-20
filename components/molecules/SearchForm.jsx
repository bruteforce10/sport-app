import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";

const SearchForm = ({ className = "" }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get("search") ?? "");

  useEffect(() => {
    const fromQuery = searchParams.get("search") ?? "";
    setKeyword(fromQuery);
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = keyword.trim();
    const target = q ? `/events?search=${encodeURIComponent(q)}` : "/events";
    router.push(target);
  };

  return (
    <form onSubmit={handleSearchSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Cari Kompetisi"
          aria-label="Cari Kompetisi"
          className="w-full rounded-full border border-gray-200 bg-white px-9 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        aria-label="Cari"
      >
        Cari
      </button>
    </form>
  );
};

export default SearchForm;
