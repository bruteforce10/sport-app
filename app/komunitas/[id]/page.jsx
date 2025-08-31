'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Users, 
  Star, 
  Calendar, 
  MessageCircle, 
  Share2, 
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  Twitter
} from 'lucide-react';

export default function CommunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        // Simulasi fetch data komunitas berdasarkan ID
        // Dalam implementasi nyata, gunakan API call ke backend
        const mockCommunity = {
          id: params.id,
          name: "Komunitas Sepeda Jakarta",
          description: "Komunitas pecinta sepeda yang aktif di Jakarta dan sekitarnya. Kami rutin mengadakan touring, charity ride, dan berbagai event sepeda lainnya. Bergabunglah dengan kami untuk menikmati kebersamaan dalam dunia sepeda!",
          city: "Jakarta",
          members: 1250,
          rating: 4.8,
          reviews: 89,
          category: "Olahraga",
          createdAt: "2020-03-15",
          activityTags: ["Touring", "Charity Ride", "Maintenance", "Racing"],
          contact: {
            phone: "+62 812-3456-7890",
            email: "info@sepedajakarta.com",
            website: "www.sepedajakarta.com",
            socialMedia: {
              instagram: "@sepedajakarta",
              facebook: "Sepeda Jakarta Community",
              twitter: "@sepedajakarta"
            }
          },
          upcomingEvents: [
            {
              id: 1,
              title: "Touring Puncak",
              date: "2024-01-20",
              participants: 45,
              maxParticipants: 50
            },
            {
              id: 2,
              title: "Charity Ride untuk Anak Yatim",
              date: "2024-01-27",
              participants: 78,
              maxParticipants: 100
            }
          ],
          recentActivities: [
            {
              id: 1,
              type: "event",
              title: "Touring Ancol",
              date: "2024-01-13",
              participants: 32
            },
            {
              id: 2,
              type: "meeting",
              title: "Rapat Koordinasi Bulanan",
              date: "2024-01-10",
              participants: 15
            }
          ]
        };
        
        setCommunity(mockCommunity);
      } catch (err) {
        setError('Gagal memuat data komunitas');
        console.error('Error fetching community:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchCommunity();
    }
  }, [params.id]);

  const getCategoryIcon = (category) => {
    const icons = {
      'Olahraga': '🏃‍♂️',
      'Seni': '🎨',
      'Teknologi': '💻',
      'Musik': '🎵',
      'Bisnis': '💼',
      'Pendidikan': '📚',
      'Lainnya': '🌟'
    };
    return icons[category] || '🌟';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data komunitas...</p>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Komunitas tidak ditemukan'}</p>
          <button
            onClick={() => router.back()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
              <p className="text-gray-600">{community.city}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Community Info Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {community.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{community.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {community.city}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Users className="w-4 h-4 mr-2" />
                    {community.members.toLocaleString()} Anggota
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Dibuat {new Date(community.createdAt).getFullYear()}
                  </div>
                </div>
                <div className="text-4xl">
                  {getCategoryIcon(community.category)}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900">{community.rating}</span>
                  <span className="text-gray-500">({community.reviews} ulasan)</span>
                </div>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Gabung Komunitas
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed mb-6">
                {community.description}
              </p>

              {community.activityTags && community.activityTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {community.activityTags.map((activity, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">
                      {activity}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Event Mendatang</h3>
              <div className="space-y-4">
                {community.upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {event.participants}/{event.maxParticipants} Peserta
                        </p>
                        <button className="text-purple-600 text-sm font-medium hover:text-purple-700">
                          Daftar Event
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
              <div className="space-y-4">
                {community.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      {activity.type === 'event' ? (
                        <Calendar className="w-5 h-5 text-purple-600" />
                      ) : (
                        <MessageCircle className="w-5 h-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString('id-ID')} • {activity.participants} peserta
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Kontak</h3>
              <div className="space-y-3">
                {community.contact.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{community.contact.phone}</span>
                  </div>
                )}
                {community.contact.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{community.contact.email}</span>
                  </div>
                )}
                {community.contact.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{community.contact.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Media Sosial</h3>
              <div className="space-y-3">
                {community.contact.socialMedia.instagram && (
                  <div className="flex items-center space-x-3">
                    <Instagram className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{community.contact.socialMedia.instagram}</span>
                  </div>
                )}
                {community.contact.socialMedia.facebook && (
                  <div className="flex items-center space-x-3">
                    <Facebook className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{community.contact.socialMedia.facebook}</span>
                  </div>
                )}
                {community.contact.socialMedia.twitter && (
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{community.contact.socialMedia.twitter}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  Gabung Komunitas
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                  Kirim Pesan
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
