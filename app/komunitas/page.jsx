"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { sportCategories } from "../communities";
import { Search, Shield, ChevronDown, ChevronRight,  MapPin, Users, Calendar, Phone, Mail, Globe, Instagram, Facebook, X } from "lucide-react";
import { MdStar } from "react-icons/md";
import { 
  fetchCommunities, 
  setFilters, 
  selectCommunities,
  selectCommunitiesStatus,
  selectCommunitiesError,
  selectCommunitiesFilters,
  selectIsCommunitiesLoading
} from "@/lib/slices/communitiesSlice";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadmintonIcon, BasketballIcon, PadelIcon, TennisIcon, SoccerIcon } from "@/lib/icon";


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

  // Get category icon dengan kontrol warna yang lebih baik
  const getCategoryIcon = (category, fill = '#4a5565') => {
    const categoryMap = {
      'Padel': <PadelIcon fill={fill} width={24} height={24}  />,
      'Tennis': <TennisIcon fill={fill} width={24} height={24}  />,
      'Badminton': <BadmintonIcon fill={fill} width={24} height={24}  />,
      'Futsal': <SoccerIcon fill={fill} width={24} height={24}  />,
      'Mini Soccer': <SoccerIcon fill={fill} width={24} height={24}  />,
      'Basketball': <BasketballIcon fill={fill} width={24} height={24}  />,
    };
    return categoryMap[category] || '🏆';
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="relative bg-[url('/cover-komunitas.webp')] bg-cover bg-center text-white py-12">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">Komunitas</h1>
          <p className="text-xl text-center mb-8 opacity-90">
            Lebih dari  {isLoading ? '...' : communities.length.toLocaleString()} komunitas siap bikin kamu makin Active! 
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Cari komunitas berdasarkan nama, kota, atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-10 py-6 rounded-l-lg placeholder-gray-500  bg-white text-gray-500"
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
            </div>
          </div>

          {/* Create Community Button */}
          <div className="text-center">
            <Link 
              href="/komunitas/create"
              className="bg-radial-[at_50%_75%] from-green-200 via-secondary to-green-400 to-90% px-6 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto space-x-2 w-fit text-secondary-foreground hover:scale-105 transition-all duration-300"
            >
              <Shield className="w-5 h-5 opacity-75" />
              <span className="opacity-75">Buat dan Kelola Komunitas</span>
            </Link>
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
                className="text-primary font-medium flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Hapus Pencarian</span>
              </button>
            )}
          </div>

          {/* Enhanced Filter Buttons */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {['All', 'Padel', 'Tennis', 'Badminton', 'Futsal', 'Mini Soccer', 'Basketball'].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getCategoryIcon(category, selectedCategory === category ? '#fff' : '#4a5565')}
                <span>{category}</span>
              </button>
            ))}
          </div>

          {/* Communities Grid */}
          {isLoading || isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500">
                {isSearching ? 'Mencari komunitas...' : 'Memuat komunitas...'}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => dispatch(fetchCommunities())}
                className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/70 transition-colors"
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
                  className="text-primary hover:text-primary/70 font-medium"
                >
                  Coba kata kunci lain atau hapus filter
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCommunities.map((community) => (
                <div key={community.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Header dengan rating dan ikon sport */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-4 pr-8">
                  {community.avatar ? (
                      <Image src={community.avatar} alt={community.name} 
                      width={60} height={60} className="rounded-full w-15 h-15 object-cover aspect-square" />
                    ) : (
                      <div className="w-15 h-15 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {community.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </div>
                    )}
                     <h3 
                        className="font-bold text-gray-900 text-lg mb-1 cursor-pointer hover:text-blue-800 transition-colors max-w-[150px] leading-6"
                        onClick={() => router.push(`/komunitas/${community.id}`)}
                      >
                        {community.name}
                      </h3>
                      </div>
                    <div className="flex items-center space-x-1">
                      <MdStar className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{community.rating || 0}</span>
                      <span className="text-sm text-gray-500">({community.reviews || 0})</span>
                    </div>
                  </div>

                  {/* Avatar dan info komunitas */}
                  <div className="mb-4">
                  <div className="flex items-center gap-1 my-4">
                      {getCategoryIcon(community.category)}<span className="text-md text-gray-500 font-semibold">{community.category}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{community.members ? community.members.toLocaleString() : '0'} Anggota</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-1" />
                        {community.city || 'Lokasi tidak tersedia'}
                      </div>
                    </div>
                  </div>


                  {/* Activity tags */}
                  {community.activityTags && community.activityTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {community.activityTags.slice(0, 3).map((activity, index) => (
                        <span key={index} className="px-2 py-1 bg-green-500/10 border-green-500 border-[1.5] text-xs rounded-full">
                          {activity}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Button */}
                  <Button className="w-full bg-secondary text-green-800 text-sm font-semibold py-5  hover:bg-secondary/70 transition-color">
                    Gabung Komunitas
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
