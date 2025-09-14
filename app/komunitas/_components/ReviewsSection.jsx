import { Star, User } from 'lucide-react';

export default function ReviewsSection() {
  const reviews = [1, 2, 3, 4]; // Mock data

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-dark-custom mb-4">Ulasan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((i) => (
          <div key={i} className="bg-gray-custom rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-dark-custom">sherly wiguna</p>
                  <p className="text-xs text-gray-500">Reviewed: 6 Sep 2025</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">5.0</span>
              </div>
            </div>
            <p className="text-sm text-gray-700">Mantapp</p>
            <div className="mt-2 text-xs text-primary-custom hover:underline cursor-pointer">Detail</div>
          </div>
        ))}
      </div>
    </div>
  );
}
