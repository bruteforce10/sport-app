"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, MapPin, Dumbbell } from "lucide-react";

export default function SearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    setKeyword(searchParams.get("search") ?? "");
    setCity(searchParams.get("city") ?? "");
    setCategory(searchParams.get("category") ?? "");
  }, [searchParams]);

  const submit = (e) => {
    e.preventDefault();
    const qp = new URLSearchParams();
    if (keyword.trim()) qp.set("search", keyword.trim());
    if (city) qp.set("city", city);
    if (category) qp.set("category", category);
    const url = qp.toString() ? `/events?${qp.toString()}` : "/events";
    router.push(url);
  };

  return (
    <form onSubmit={submit} className="w-full">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
        {/* Keyword */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Cari event mabar"
            aria-label="Cari event mabar"
            className="pl-9"
          />
        </div>

        {/* City */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Select value={city || undefined} onValueChange={(v) => setCity(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full pl-9">
              <SelectValue placeholder="Pilih Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              <SelectItem value="Jakarta Barat">Jakarta Barat</SelectItem>
              <SelectItem value="Jakarta Timur">Jakarta Timur</SelectItem>
              <SelectItem value="Jakarta Selatan">Jakarta Selatan</SelectItem>
              <SelectItem value="Jakarta Pusat">Jakarta Pusat</SelectItem>
              <SelectItem value="Jakarta Utara">Jakarta Utara</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="relative">
          <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
          <Select value={category || undefined} onValueChange={(v) => setCategory(v === 'all' ? '' : v)}>
            <SelectTrigger className="w-full pl-9">
              <SelectValue placeholder="Pilih Cabang Olahraga" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Olahraga</SelectItem>
              <SelectItem value="Badminton">Badminton</SelectItem>
              <SelectItem value="Futsal">Futsal</SelectItem>
              <SelectItem value="Basketball">Basketball</SelectItem>
              <SelectItem value="Tennis">Tennis</SelectItem>
              <SelectItem value="Football">Football</SelectItem>
              <SelectItem value="Volleyball">Volleyball</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter button (placeholder) */}
        <Button type="button" variant="destructive" className="bg-rose-100 text-rose-600 hover:bg-rose-200">
          <SlidersHorizontal className="size-4" />
        </Button>

        {/* Submit */}
        <Button type="submit" variant="destructive" className="px-6">
          Cari mabar
        </Button>
      </div>
    </form>
  );
}


