import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../types';

// Async Thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ userId, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user profile');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCommunities = createAsyncThunk(
  'user/fetchUserCommunities',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}/communities`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user communities');
      }

      const data = await response.json();
      return data.communities || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserEvents = createAsyncThunk(
  'user/fetchUserEvents',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userId}/events`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user events');
      }

      const data = await response.json();
      return data.events || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  currentUser: null,
  userCommunities: [],
  userEvents: [],
  status: ApiResponse.IDLE,
  error: null,
  isAuthenticated: false,
};

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.userCommunities = [];
      state.userEvents = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // fetchUserProfile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch user profile';
      });

    // updateUserProfile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to update user profile';
      });

    // fetchUserCommunities
    builder
      .addCase(fetchUserCommunities.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchUserCommunities.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.userCommunities = action.payload;
        state.error = null;
      })
      .addCase(fetchUserCommunities.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch user communities';
      });

    // fetchUserEvents
    builder
      .addCase(fetchUserEvents.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.userEvents = action.payload;
        state.error = null;
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch user events';
      });
  },
});

// Export actions
export const {
  setCurrentUser,
  clearCurrentUser,
  clearError,
  resetState
} = userSlice.actions;

// Export selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUserCommunities = (state) => state.user.userCommunities;
export const selectUserEvents = (state) => state.user.userEvents;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectIsUserLoading = (state) => state.user.status === ApiResponse.LOADING;
export const selectIsUserError = (state) => state.user.status === ApiResponse.ERROR;

export default userSlice.reducer;
