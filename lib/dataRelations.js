import { events } from '../app/events.js';
import { communities } from '../app/communities.js';

// Fungsi untuk mendapatkan komunitas berdasarkan event ID
export const getCommunityByEvent = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event || !event.communityId) return null;
  
  return communities.find(c => c.id === event.communityId);
};

// Fungsi untuk mendapatkan events berdasarkan komunitas ID
export const getEventsByCommunity = (communityId) => {
  return events.filter(e => e.communityId === communityId);
};

// Fungsi untuk mendapatkan events yang tidak memiliki komunitas
export const getEventsWithoutCommunity = () => {
  return events.filter(e => !e.communityId);
};

// Fungsi untuk mendapatkan komunitas berdasarkan kategori olahraga
export const getCommunitiesByCategory = (category) => {
  return communities.filter(c => c.category === category);
};

// Fungsi untuk mendapatkan events berdasarkan kategori olahraga
export const getEventsByCategory = (category) => {
  return events.filter(e => e.category === category);
};

// Fungsi untuk mendapatkan komunitas berdasarkan lokasi
export const getCommunitiesByLocation = (location) => {
  return communities.filter(c => 
    c.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Fungsi untuk mendapatkan events berdasarkan lokasi
export const getEventsByLocation = (location) => {
  return events.filter(e => 
    e.location.toLowerCase().includes(location.toLowerCase())
  );
};

// Fungsi untuk mendapatkan komunitas dengan rating tinggi
export const getTopRatedCommunities = (limit = 5) => {
  return communities
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

// Fungsi untuk mendapatkan komunitas dengan member terbanyak
export const getMostPopularCommunities = (limit = 5) => {
  return communities
    .sort((a, b) => b.members - a.members)
    .slice(0, limit);
};

// Fungsi untuk mendapatkan komunitas berdasarkan tahun berdiri
export const getCommunitiesByFoundedYear = (year) => {
  return communities.filter(c => c.founded === year.toString());
};

// Fungsi untuk mendapatkan komunitas yang memiliki fasilitas tertentu
export const getCommunitiesByFacility = (facility) => {
  return communities.filter(c => 
    c.facilities.some(f => 
      f.toLowerCase().includes(facility.toLowerCase())
    )
  );
};

// Fungsi untuk mendapatkan komunitas yang memiliki aktivitas tertentu
export const getCommunitiesByActivity = (activity) => {
  return communities.filter(c => 
    c.activities.some(a => 
      a.toLowerCase().includes(activity.toLowerCase())
    )
  );
};

// Fungsi untuk mendapatkan data lengkap komunitas dengan events
export const getCommunityWithEvents = (communityId) => {
  const community = communities.find(c => c.id === communityId);
  if (!community) return null;
  
  const communityEvents = getEventsByCommunity(communityId);
  
  return {
    ...community,
    events: communityEvents,
    totalEvents: communityEvents.length,
    upcomingEvents: communityEvents.filter(e => {
      // Filter events yang akan datang (bisa ditambahkan logic date parsing)
      return true; // Untuk sementara return semua
    })
  };
};

// Fungsi untuk mendapatkan data lengkap event dengan komunitas
export const getEventWithCommunity = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event) return null;
  
  const community = event.communityId ? getCommunityByEvent(eventId) : null;
  
  return {
    ...event,
    community: community,
    hasCommunity: !!community
  };
};

// Fungsi untuk mendapatkan statistik relasi data
export const getDataStatistics = () => {
  const totalEvents = events.length;
  const totalCommunities = communities.length;
  const eventsWithCommunity = events.filter(e => e.communityId).length;
  const eventsWithoutCommunity = totalEvents - eventsWithCommunity;
  
  const categoryStats = {};
  communities.forEach(community => {
    if (!categoryStats[community.category]) {
      categoryStats[community.category] = {
        communities: 0,
        events: 0,
        totalMembers: 0
      };
    }
    categoryStats[community.category].communities++;
    categoryStats[community.category].totalMembers += community.members;
  });
  
  events.forEach(event => {
    if (categoryStats[event.category]) {
      categoryStats[event.category].events++;
    }
  });
  
  return {
    totalEvents,
    totalCommunities,
    eventsWithCommunity,
    eventsWithoutCommunity,
    categoryStats,
    coveragePercentage: Math.round((eventsWithCommunity / totalEvents) * 100)
  };
};
