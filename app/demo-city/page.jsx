"use client";

import { useState } from "react";
import CityAutocomplete from "../components/CityAutocomplete";

export default function CityAutocompleteDemo() {
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Demo City Autocomplete
          </h1>
          <p className="text-xl text-gray-600">
            Fitur autocomplete untuk kota-kota di Indonesia
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Coba Fitur Autocomplete Kota
            </h2>
            <p className="text-gray-600 mb-6">
              Mulai ketik nama kota (minimal 2 karakter) untuk melihat daftar rekomendasi kota di Indonesia.
              Anda dapat menggunakan keyboard (Arrow Up/Down, Enter, Escape) atau mouse untuk navigasi.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Kota
              </label>
              <CityAutocomplete
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Ketik nama kota (contoh: Bandung, Jakarta, Surabaya)"
              />
            </div>

            {selectedCity && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Kota Terpilih
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Anda telah memilih: <strong>{selectedCity}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Fitur yang Tersedia
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Pencarian real-time dengan minimal 2 karakter</li>
                      <li>Highlight kata kunci pencarian</li>
                      <li>Navigasi dengan keyboard (Arrow keys, Enter, Escape)</li>
                      <li>Informasi provinsi untuk setiap kota</li>
                      <li>Tombol clear untuk menghapus input</li>
                      <li>Responsive design dan smooth animations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Tips Penggunaan
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Gunakan Arrow Up/Down untuk navigasi</li>
                      <li>Tekan Enter untuk memilih kota yang disorot</li>
                      <li>Tekan Escape untuk menutup dropdown</li>
                      <li>Klik di luar input untuk menutup dropdown</li>
                      <li>Gunakan tombol X untuk menghapus input</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
