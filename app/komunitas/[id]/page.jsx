import Link from 'next/link';
import {
  HeroSection,
  CommunityHeader,
  DescriptionSection,
  SocialMediaSection,
  ActivitiesSection,
  RatingSection,
  ReviewsSection
} from '../_components';

// Server-side data fetching function
async function getCommunityData(id) {
  try {
    // In production, replace with your actual API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/communities/${id}`, {
      cache: 'no-store' // Disable caching for fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch community');
    }
    
    const data = await response.json();
    return data.community;
  } catch (error) {
    console.error('Error fetching community:', error);
    return null;
  }
}

export default async function CommunityDetailPage({ params }) {
  const community = await getCommunityData(params.id);

  // Error state - community not found
  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Komunitas tidak ditemukan</p>
          <Link
            href="/komunitas"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Kembali ke Daftar Komunitas
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-custom">
      <HeroSection />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <CommunityHeader community={community} />
            <DescriptionSection community={community} />
            <SocialMediaSection />
            <ActivitiesSection />
            <RatingSection />
            <ReviewsSection />
          </div>

          {/* Right Column - Banner Ad */}
          <div className="lg:col-span-1">
            <div className="bg-gray-300 rounded-lg h-96 flex items-center justify-center text-gray-500 font-medium">
              Banner 3x3 iklan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
