import { Star } from 'lucide-react';

export default function RatingSection() {
  const ratingBreakdown = [
    { label: 'Ketepatan Waktu', rating: 4.5 },
    { label: 'Pembagian Waktu', rating: 4.5 },
    { label: 'Komunikasi', rating: 4.5 },
    { label: 'Sportifitas', rating: 4.5 }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-dark-custom mb-4">Rating</h2>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Star className="w-8 h-8 text-yellow-400 fill-current" />
          <span className="text-3xl font-bold text-dark-custom">4.9/5</span>
        </div>
        <div className="text-gray-600">
          <p className="text-sm">272.0 rating · 253 reviews</p>
        </div>
      </div>
      
      {/* Rating Breakdown */}
      <div className="space-y-3">
        {ratingBreakdown.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-700 w-32">{item.label}</span>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(item.rating / 5) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-dark-custom w-8">{item.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
