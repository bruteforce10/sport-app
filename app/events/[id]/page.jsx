"use client";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { events } from "@/app/events";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = Number(params?.id);

  const event = useMemo(
    () => events.find((e) => e.id === eventId),
    [eventId]
  );

  const recommendations = useMemo(() => {
    if (!event) return [];
    return events
      .filter((e) => e.id !== event.id && (e.category === event.category || e.location.split(",")[1] === event.location.split(",")[1]))
      .slice(0, 3);
  }, [event]);

  if (!event) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <p className="text-gray-700">Kegiatan tidak ditemukan.</p>
          <Button onClick={() => router.push("/events")}>Kembali ke daftar</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{event.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{event.category}</span>
              <span>•</span>
              <span>{event.skillLevel}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.back()}>Kembali</Button>
            <Button>Ajukan Permintaan Gabung</Button>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardContent>
                <section className="space-y-4">
                  <h2 className="text-lg font-semibold">Tentang Mabar</h2>
                  <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                    <li>Open mabar for all level</li>
                    <li>Beginners are very welcome</li>
                  </ul>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2"><span className="text-gray-500">Tanggal</span><span className="font-medium">{event.date}</span></div>
                    <div className="flex items-center gap-2"><span className="text-gray-500">Waktu</span><span className="font-medium">{event.time}</span></div>
                    <div className="flex items-center gap-2 sm:col-span-2"><span className="text-gray-500">Lokasi</span><span className="font-medium">{event.location}</span></div>
                  </div>
                </section>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <h2 className="text-lg font-semibold mb-3">Lokasi</h2>
                <div className="h-56 w-full rounded-md overflow-hidden">
                  <iframe
                    title="google-maps"
                    src={`https://www.google.com/maps?q=${event.lat},${event.lng}&z=15&output=embed`}
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${event.lat},${event.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex"
                  >
                    <Button variant="outline" size="sm">Buka di Google Maps</Button>
                  </a>
                  <span className="text-sm text-gray-600">{event.location}</span>
                </div>
              </CardContent>
            </Card>

            {recommendations.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">Rekomendasi Main Bareng</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendations.map((r) => (
                    <Card key={r.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-sm">{r.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">{r.date} • {r.time}</p>
                            <p className="text-xs text-gray-600">{r.location}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => router.push(`/events/${r.id}`)}>Detail</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Harga</span>
                  <span className="text-lg font-bold text-gray-900">Rp45.000</span>
                </div>
                <Button className="w-full">Ajukan Permintaan Gabung</Button>
                <div className="text-xs text-gray-600">Event ini hanya menerima metode pembayaran tunai.</div>
                <div className="text-sm">
                  <div className="text-gray-700 font-medium">Waktu & Tanggal</div>
                  <div className="text-gray-600">{event.date} • {event.time}</div>
                </div>
                <div className="text-sm">
                  <div className="text-gray-700 font-medium">Lapangan</div>
                  <div className="text-gray-600">{event.location}</div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-sm font-medium text-gray-900">{event.club.name}</div>
                  <div className="text-xs text-gray-600">Penyelenggara</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}


