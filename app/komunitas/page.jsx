"use client";
import { useState } from "react";
import { communities, sportCategories } from "../communities";
import { Search, Shield, ChevronDown, ChevronRight, Star, MapPin, Users, Calendar, Phone, Mail, Globe, Instagram, Facebook } from "lucide-react";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAllCategories, setShowAllCategories] = useState(false);

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });


  const recommendedCommunities = filteredCommunities.slice(0, 10);

  const displayedCategories = showAllCategories ? sportCategories : sportCategories.slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">Komunitas</h1>
          <p className="text-xl text-center mb-8 opacity-90">
            Yuk gabung di lebih dari 22.500 komunitas di AYO!
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari Komunitas Billiard"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>

          {/* Create Community Button */}
          <div className="text-center">
            <a 
              href="/komunitas/create"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto space-x-2 hover:bg-gray-50 transition-colors inline-block"
            >
              <Shield className="w-5 h-5" />
              <span>Buat dan Kelola Komunitas</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Sport Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Komunitas di AYO!</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {displayedCategories.map((category, index) => (
              <div key={index} className="text-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900 mb-1">{category.name}</div>
                <div className="text-xs text-gray-600">{category.count.toLocaleString()}+ Komun..</div>
              </div>
            ))}
          </div>
          {!showAllCategories && (
            <button
              onClick={() => setShowAllCategories(true)}
              className="flex items-center justify-center mx-auto text-purple-600 font-medium hover:text-purple-700 transition-colors"
            >
              Selengkapnya
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
          )}
        </section>


        {/* Recommended Communities Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Komunitas untukmu</h2>
            <p className="text-gray-600">Yuk tambah temen baru dengan gabung di komunitas!</p>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Padel', 'Tennis', 'Badminton', 'Futsal', 'Football', 'Basketball'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Communities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCommunities.map((community) => (
              <div key={community.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {community.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{community.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {community.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {community.members.toLocaleString()} Anggota
                    </div>
                  </div>
                  <div className="text-2xl">
                    {community.category === 'Padel' && '🏓'}
                    {community.category === 'Tennis' && '🎾'}
                    {community.category === 'Badminton' && '🏸'}
                    {community.category === 'Futsal' && '⚽'}
                    {community.category === 'Football' && '⚽'}
                    {community.category === 'Basketball' && '🏀'}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{community.rating}</span>
                    <span className="text-sm text-gray-500">({community.reviews})</span>
                  </div>
                  <div className="text-sm text-gray-500">Didirikan {community.founded}</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {community.activities.slice(0, 3).map((activity, index) => (
                    <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {activity}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Gabung
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
