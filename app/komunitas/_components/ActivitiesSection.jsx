import { Clock, MapPin } from 'lucide-react';

export default function ActivitiesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upcoming Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-dark-custom mb-4">Aktivitas Terdekat</h2>
        <div className="bg-gray-custom rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Min, 07 Sep 2025 · 16:00</span>
            </div>
          </div>
          <h3 className="font-medium text-dark-custom mb-2">Tepok Bulu Jakarta Barat With Mommynton Bc</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Jakarta Barat · 5 Bergabung</span>
            </div>
            <button className="text-primary-custom text-sm font-medium hover:underline">Detail</button>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-dark-custom mb-4">Aktivitas Terakhir</h2>
        <div className="bg-gray-custom rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Min, 07 Sep 2025 · 16:00</span>
            </div>
          </div>
          <h3 className="font-medium text-dark-custom mb-2">Tepok Bulu Jakarta Barat With Mommynton Bc</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Jakarta Barat · 5 Bergabung</span>
            </div>
            <button className="text-primary-custom text-sm font-medium hover:underline">Detail</button>
          </div>
        </div>
      </div>
    </div>
  );
}
