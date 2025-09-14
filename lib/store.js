import { configureStore } from '@reduxjs/toolkit';
import communitiesReducer from './slices/communitiesSlice';
import eventsReducer from './slices/eventsSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    communities: communitiesReducer,
    events: eventsReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['communities.cacheTimestamp', 'events.cacheTimestamp'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});
