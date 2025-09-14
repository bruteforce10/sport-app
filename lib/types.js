// Community Types
export const CommunityPrivacy = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  RESTRICTED: 'restricted'
};

export const CommunityRole = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  MODERATOR: 'moderator'
};

export const EventStatus = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const EventType = {
  TOURNAMENT: 'tournament',
  TRAINING: 'training',
  SOCIAL: 'social',
  COMPETITION: 'competition'
};

// API Response Types
export const ApiResponse = {
  SUCCESS: 'success',
  ERROR: 'error',
  LOADING: 'loading',
  IDLE: 'idle'
};

// Cache Configuration
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
