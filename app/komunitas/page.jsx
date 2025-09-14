"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { sportCategories } from "../communities";
import { Search, Shield, ChevronDown, ChevronRight, Star, MapPin, Users, Calendar, Phone, Mail, Globe, Instagram, Facebook, X } from "lucide-react";
import { 
  fetchCommunities, 
  setFilters, 
  selectCommunities,
  selectCommunitiesStatus,
  selectCommunitiesError,
  selectCommunitiesFilters,
  selectIsCommunitiesLoading
} from "@/lib/slices/communitiesSlice";

export default function CommunitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  // Redux state
  const communities = useSelector(selectCommunities);
  const status = useSelector(selectCommunitiesStatus);
  const error = useSelector(selectCommunitiesError);
  const filters = useSelector(selectCommunitiesFilters);
  const isLoading = useSelector(selectIsCommunitiesLoading);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "All");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState(searchParams.get('search') || "");

  // Initialize from URL params
  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchQuery(search);
      setActiveSearchQuery(search);
    }
    if (category) setSelectedCategory(category);
  }, [searchParams]);

  // Fetch communities from API using Redux
  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);

  // Update filters in Redux (only for category changes, not search input)
  useEffect(() => {
    dispatch(setFilters({ search: searchQuery, category: selectedCategory }));
  }, [selectedCategory, dispatch]);

  // Filter communities based on search and category
  // Note: Search filtering now only happens when search button is clicked
  const filteredCommunities = communities.filter(community => {
    const matchesSearch = activeSearchQuery ? (
      community.name.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
      (community.city && community.city.toLowerCase().includes(activeSearchQuery.toLowerCase())) ||
      (community.description && community.description.toLowerCase().includes(activeSearchQuery.toLowerCase()))
    ) : true;
    const matchesCategory = selectedCategory === "All" || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedCommunities = filteredCommunities.slice(0, 10);
  const displayedCategories = showAllCategories ? sportCategories : sportCategories.slice(0, 6);

  // Handle search with button click
  const handleSearch = () => {
    setIsSearching(true);
    
    // Set the active search query only when search is executed
    setActiveSearchQuery(searchQuery.trim());
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (selectedCategory !== 'All') params.append('category', selectedCategory);
    
    const queryString = params.toString();
    const newUrl = queryString ? `/komunitas?${queryString}` : '/komunitas';
    
    router.push(newUrl);
    
    // Fetch communities with search parameters
    dispatch(fetchCommunities({ 
      search: searchQuery.trim(), 
      category: selectedCategory 
    })).finally(() => {
      setIsSearching(false);
    });
  };

  // Handle search on Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    
    // Update URL and fetch communities
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('search', searchQuery.trim());
    if (category !== 'All') params.append('category', category);
    
    const queryString = params.toString();
    const newUrl = queryString ? `/komunitas?${queryString}` : '/komunitas';
    
    router.push(newUrl);
    
    dispatch(fetchCommunities({ search: searchQuery.trim(), category }));
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setActiveSearchQuery("");
    setSelectedCategory("All");
    dispatch(fetchCommunities());
    router.push('/komunitas');
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const categoryMap = {
      'Padel': '🏓',
      'Tennis': '🎾',
      'Badminton': '🏸',
      'Futsal': '⚽',
      'Football': '⚽',
      'Basketball': '🏀',
      'Billiard': '🎱',
      'Swimming': '🏊',
      'Gym': '💪',
      'Running': '🏃',
      'Cycling': '🚴',
      'Volleyball': '🏐'
    };
    return categoryMap[category] || '🏆';
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">Komunitas</h1>
          <p className="text-xl text-center mb-8 opacity-90">
            Yuk gabung di lebih dari {isLoading ? '...' : communities.length.toLocaleString()} komunitas di AYO!
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari komunitas berdasarkan nama, kota, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-10 py-3 rounded-l-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-purple-700 hover:bg-purple-800 disabled:bg-purple-500 text-white px-6 py-3 rounded-r-lg font-semibold flex items-center space-x-2 transition-colors min-w-[140px] justify-center"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Mencari...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Cari Komunitas</span>
                  </>
                )}
              </button>
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

        {/* Enhanced Header Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeSearchQuery ? `Hasil Pencarian: "${activeSearchQuery}"` : 'Komunitas untukmu'}
              </h2>
              <p className="text-gray-600">
                {activeSearchQuery 
                  ? `${filteredCommunities.length} komunitas ditemukan` 
                  : 'Yuk tambah temen baru dengan gabung di komunitas!'
                }
              </p>
            </div>
            
            {/* Clear Search Button */}
            {activeSearchQuery && (
              <button
                onClick={clearSearch}
                className="text-purple-600 hover:text-purple-700 font-medium flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Hapus Pencarian</span>
              </button>
            )}
          </div>

          {/* Enhanced Filter Buttons */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Padel', 'Tennis', 'Badminton', 'Futsal', 'Football', 'Basketball'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
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
          {isLoading || isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-500">
                {isSearching ? 'Mencari komunitas...' : 'Memuat komunitas...'}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => dispatch(fetchCommunities())}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          ) : recommendedCommunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {activeSearchQuery 
                  ? `Tidak ada komunitas yang cocok dengan "${activeSearchQuery}"`
                  : 'Tidak ada komunitas yang ditemukan'
                }
              </p>
              {activeSearchQuery && (
                <button
                  onClick={clearSearch}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Coba kata kunci lain atau hapus filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCommunities.map((community) => (
                <div key={community.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {community.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-gray-900 text-lg mb-1 cursor-pointer hover:text-purple-600 transition-colors"
                        onClick={() => router.push(`/komunitas/${community.id}`)}
                      >
                        {community.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {community.city || 'Lokasi tidak tersedia'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {community.members ? community.members.toLocaleString() : '0'} Anggota
                      </div>
                    </div>
                    <div className="text-2xl">
                      {getCategoryIcon(community.category)}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {community.description || 'Deskripsi tidak tersedia'}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{community.rating || 0}</span>
                      <span className="text-sm text-gray-500">({community.reviews || 0})</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {community.createdAt ? `Dibuat ${new Date(community.createdAt).getFullYear()}` : 'Baru dibuat'}
                    </div>
                  </div>

                  {community.activityTags && community.activityTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {community.activityTags.slice(0, 3).map((activity, index) => (
                        <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                    Gabung
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
