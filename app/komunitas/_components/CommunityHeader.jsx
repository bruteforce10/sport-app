"use client"
import { useState } from 'react';
import AvatarMemberSection from '@/components/molecules/AvatarMemberSection';
import ShareStoryModal from '@/components/molecules/ShareStoryModal';
import { MapPin, Share2 } from 'lucide-react';
import Image from 'next/image';
import { MdStar } from 'react-icons/md';

export default function CommunityHeader({ community }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-start space-x-6">
        {/* Community Avatar */}

        {
          community.avatar ? (
            <Image src={community.avatar} alt={community.name} 
            width={96} height={96} className="rounded-full object-cover aspect-square" />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-bl from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-3xl flex-shrink-0">
              {community.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
            </div>
          )
        }
        
        
        {/* Community Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-dark-custom mb-4">{community.name}</h1>
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <span className="font-medium">{community.category}</span>
            <span className="mx-2">•</span>
            <span>{community.privacy !== "open" ? "Public" : "Not Public"}</span>
            <span className="mx-2">•</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span>{community.city}</span>
          </div>
          
          {/* Rating and Members */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-2">
            <MdStar className="w-8 h-8 text-yellow-500 fill-current" />
              <span className="text-2xl font-bold text-dark-custom">{community.rating}</span>
            </div>
           <AvatarMemberSection members={community.memberships} />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="bg-primary-custom text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Gabung Komunitas
            </button>
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="bg-secondary-custom text-dark-custom p-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ShareStoryModal 
      isOpen={isShareModalOpen}
      onClose={() => setIsShareModalOpen(false)}
      community={community}
    />
    </>
  );
}
