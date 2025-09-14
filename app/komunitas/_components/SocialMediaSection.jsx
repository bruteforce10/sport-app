import { Instagram, Facebook } from 'lucide-react';

export default function SocialMediaSection() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-dark-custom mb-4">Social Media</h2>
      <div className="flex space-x-4">
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Instagram className="w-5 h-5 text-pink-500" />
          <span className="text-sm">@tepokbulu</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-sm">@tepokbulu</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Facebook className="w-5 h-5 text-blue-600" />
          <span className="text-sm">@tepokbulu</span>
        </button>
      </div>
    </div>
  );
}
