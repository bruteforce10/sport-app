import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CACHE_DURATION, ApiResponse } from '../types';

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.communityId) params.append('communityId', filters.communityId);
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.date) params.append('date', filters.date);

      const response = await fetch(`/api/events?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (filters, { getState }) => {
      const { events } = getState();
      const now = Date.now();
      
      // Check if cache is still valid (5 minutes)
      if (events.cacheTimestamp && 
          (now - events.cacheTimestamp) < CACHE_DURATION &&
          events.data.length > 0) {
        return false; // Don't fetch if cache is valid
      }
      return true; // Fetch if cache is invalid or empty
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const data = await response.json();
      return data.event;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create event');
      }

      const data = await response.json();
      return data.event;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      const data = await response.json();
      return data.event;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const joinEvent = createAsyncThunk(
  'events/joinEvent',
  async ({ eventId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${eventId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join event');
      }

      const data = await response.json();
      return { eventId, participant: data.participant };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const leaveEvent = createAsyncThunk(
  'events/leaveEvent',
  async ({ eventId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/events/${eventId}/leave`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to leave event');
      }

      return { eventId, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  data: [],
  selectedEvent: null,
  status: ApiResponse.IDLE,
  error: null,
  cacheTimestamp: null,
  filters: {
    communityId: null,
    status: null,
    type: null,
    date: null,
  }
};

// Slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.cacheTimestamp = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        communityId: null,
        status: null,
        type: null,
        date: null,
      };
    },
    resetState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // fetchEvents
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.data = action.payload;
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch events';
      });

    // fetchEventById
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.selectedEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch event';
      });

    // createEvent
    builder
      .addCase(createEvent.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.data.unshift(action.payload);
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to create event';
      });

    // updateEvent
    builder
      .addCase(updateEvent.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        const index = state.data.findIndex(event => event.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.selectedEvent && state.selectedEvent.id === action.payload.id) {
          state.selectedEvent = action.payload;
        }
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to update event';
      });

    // deleteEvent
    builder
      .addCase(deleteEvent.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.data = state.data.filter(event => event.id !== action.payload);
        if (state.selectedEvent && state.selectedEvent.id === action.payload) {
          state.selectedEvent = null;
        }
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to delete event';
      });

    // joinEvent
    builder
      .addCase(joinEvent.fulfilled, (state, action) => {
        const { eventId, participant } = action.payload;
        const event = state.data.find(e => e.id === eventId);
        if (event) {
          if (!event.participants) event.participants = [];
          event.participants.push(participant);
        }
        if (state.selectedEvent && state.selectedEvent.id === eventId) {
          if (!state.selectedEvent.participants) state.selectedEvent.participants = [];
          state.selectedEvent.participants.push(participant);
        }
      });

    // leaveEvent
    builder
      .addCase(leaveEvent.fulfilled, (state, action) => {
        const { eventId, userId } = action.payload;
        const event = state.data.find(e => e.id === eventId);
        if (event && event.participants) {
          event.participants = event.participants.filter(p => p.userId !== userId);
        }
        if (state.selectedEvent && state.selectedEvent.id === eventId && state.selectedEvent.participants) {
          state.selectedEvent.participants = state.selectedEvent.participants.filter(p => p.userId !== userId);
        }
      });
  },
});

// Export actions
export const {
  clearError,
  clearCache,
  setFilters,
  clearFilters,
  resetState
} = eventsSlice.actions;

// Export selectors
export const selectEvents = (state) => state.events.data;
export const selectSelectedEvent = (state) => state.events.selectedEvent;
export const selectEventsStatus = (state) => state.events.status;
export const selectEventsError = (state) => state.events.error;
export const selectEventsFilters = (state) => state.events.filters;
export const selectEventsCacheTimestamp = (state) => state.events.cacheTimestamp;
export const selectIsEventsLoading = (state) => state.events.status === ApiResponse.LOADING;
export const selectIsEventsError = (state) => state.events.status === ApiResponse.ERROR;

export default eventsSlice.reducer;
