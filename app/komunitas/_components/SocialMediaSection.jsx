"use client";
import { Button } from "@/components/ui/button";
import { FaTiktok, FaInstagramSquare, FaFacebookF } from "react-icons/fa";

const SOCIAL_PLATFORMS = {
  instagram: {
    icon: FaInstagramSquare,
    iconClass: "w-7 h-7 text-pink-500",
    urlTemplate: (username) => `https://www.instagram.com/${username}`,
    displayTemplate: (username) => `@${username}`
  },
  tiktok: {
    icon: FaTiktok,
    iconClass: "w-5 h-5 text-black",
    urlTemplate: (username) => `https://www.tiktok.com/@${username}`,
    displayTemplate: (username) => `@${username}`
  },
  facebook: {
    icon: FaFacebookF,
    iconClass: "w-5 h-5 text-blue-600",
    urlTemplate: (username) => `https://www.facebook.com/${username}`,
    displayTemplate: (username) => username
  }
};

const SocialButton = ({ platform, username, config }) => {
  const { icon: Icon, iconClass, urlTemplate, displayTemplate } = config;
  
  const handleClick = () => {
    if (!username) return;
    window.open(urlTemplate(username), '_blank');
  };

  return (
    <Button 
      onClick={handleClick}
      className="bg-blue-800"
    >
      <Icon className={"text-secondary"} />
      <span className="text-sm">{displayTemplate(username)}</span>
    </Button>
  );
};

export default function SocialMediaSection({ community }) {
  const { facebook, instagram, tiktok } = community.socialMedia || {};

  const socialData = [
    { platform: 'instagram', username: instagram },
    { platform: 'tiktok', username: tiktok },
    { platform: 'facebook', username: facebook }
  ].filter(({ username }) => username && username.trim());

  if (socialData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-custom mb-4">Social Media</h2>
      <div className="flex space-x-4">
        {socialData.map(({ platform, username }) => (
          <SocialButton
            key={platform}
            platform={platform}
            username={username}
            config={SOCIAL_PLATFORMS[platform]}
          />
        ))}
      </div>
    </div>
  );
}
