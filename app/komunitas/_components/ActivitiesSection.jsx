"use client";
import { Clock, MapPin } from 'lucide-react';

// Constants for better maintainability
const MOCK_ACTIVITIES = {
  upcoming: {
    title: 'Aktivitas Terdekat',
    activity: {
      id: 1,
      name: 'Tepok Bulu Jakarta Barat With Mommynton Bc',
      date: 'Min, 07 Sep 2025 · 16:00',
      location: 'Jakarta Barat',
      participants: 5
    }
  },
  recent: {
    title: 'Aktivitas Terakhir',
    activity: {
      id: 2,
      name: 'Tepok Bulu Jakarta Barat With Mommynton Bc',
      date: 'Min, 07 Sep 2025 · 16:00',
      location: 'Jakarta Barat',
      participants: 5
    }
  }
};

// Reusable ActivityCard component
function ActivityCard({ activity, onDetailClick }) {
  return (
    <div className="bg-gray-custom rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{activity.date}</span>
        </div>
      </div>
      <h3 className="font-semibold text-dark-custom my-4">{activity.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600/80">
          <MapPin className="w-4 h-4" />
          <span>{activity.location} · {activity.participants} Bergabung</span>
        </div>
        <button 
          onClick={() => onDetailClick?.(activity.id)}
          className="text-primary-custom text-sm font-medium hover:underline"
        >
          Detail
        </button>
      </div>
    </div>
  );
}

// Reusable ActivitySection component
function ActivitySection({ title, activity, onDetailClick }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-dark-custom mb-4">{title}</h2>
      <ActivityCard activity={activity} onDetailClick={onDetailClick} />
    </div>
  );
}

// Main component with clean structure
export default function ActivitiesSection({ 
  upcomingActivity = MOCK_ACTIVITIES.upcoming.activity,
  recentActivity = MOCK_ACTIVITIES.recent.activity,
  onActivityDetailClick 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ActivitySection
        title={MOCK_ACTIVITIES.upcoming.title}
        activity={upcomingActivity}
        onDetailClick={onActivityDetailClick}
      />
      <ActivitySection
        title={MOCK_ACTIVITIES.recent.title}
        activity={recentActivity}
        onDetailClick={onActivityDetailClick}
      />
    </div>
  );
}
