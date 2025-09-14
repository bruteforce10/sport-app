import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CACHE_DURATION, ApiResponse } from '../types';

// Async Thunks
export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.city) params.append('city', filters.city);

      const response = await fetch(`/api/communities?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch communities');
      }

      const data = await response.json();
      return data.communities || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (filters, { getState }) => {
      const { communities } = getState();
      const now = Date.now();
      
      // Check if cache is still valid (5 minutes)
      if (communities.cacheTimestamp && 
          (now - communities.cacheTimestamp) < CACHE_DURATION &&
          communities.data.length > 0) {
        return false; // Don't fetch if cache is valid
      }
      return true; // Fetch if cache is invalid or empty
    }
  }
);

export const fetchCommunityById = createAsyncThunk(
  'communities/fetchCommunityById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/communities/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch community');
      }

      const data = await response.json();
      return data.community;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCommunity = createAsyncThunk(
  'communities/createCommunity',
  async (communityData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create community');
      }

      const data = await response.json();
      return data.community;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCommunity = createAsyncThunk(
  'communities/updateCommunity',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/communities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update community');
      }

      const data = await response.json();
      return data.community;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCommunity = createAsyncThunk(
  'communities/deleteCommunity',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/communities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete community');
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState = {
  data: [],
  selectedCommunity: null,
  status: ApiResponse.IDLE,
  error: null,
  cacheTimestamp: null,
  filters: {
    search: '',
    category: 'All',
    city: '',
  }
};

// Slice
const communitiesSlice = createSlice({
  name: 'communities',
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
        search: '',
        category: 'All',
        city: '',
      };
    },
    resetState: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    // fetchCommunities
    builder
      .addCase(fetchCommunities.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchCommunities.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.data = action.payload;
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(fetchCommunities.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch communities';
      });

    // fetchCommunityById
    builder
      .addCase(fetchCommunityById.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(fetchCommunityById.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.selectedCommunity = action.payload;
        state.error = null;
      })
      .addCase(fetchCommunityById.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to fetch community';
      });

    // createCommunity
    builder
      .addCase(createCommunity.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(createCommunity.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.data.unshift(action.payload);
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(createCommunity.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to create community';
      });

    // updateCommunity
    builder
      .addCase(updateCommunity.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(updateCommunity.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        const index = state.data.findIndex(community => community.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        if (state.selectedCommunity && state.selectedCommunity.id === action.payload.id) {
          state.selectedCommunity = action.payload;
        }
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(updateCommunity.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to update community';
      });

    // deleteCommunity
    builder
      .addCase(deleteCommunity.pending, (state) => {
        state.status = ApiResponse.LOADING;
        state.error = null;
      })
      .addCase(deleteCommunity.fulfilled, (state, action) => {
        state.status = ApiResponse.SUCCESS;
        state.data = state.data.filter(community => community.id !== action.payload);
        if (state.selectedCommunity && state.selectedCommunity.id === action.payload) {
          state.selectedCommunity = null;
        }
        state.cacheTimestamp = Date.now();
        state.error = null;
      })
      .addCase(deleteCommunity.rejected, (state, action) => {
        state.status = ApiResponse.ERROR;
        state.error = action.payload || 'Failed to delete community';
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
} = communitiesSlice.actions;

// Export selectors
export const selectCommunities = (state) => state.communities.data;
export const selectSelectedCommunity = (state) => state.communities.selectedCommunity;
export const selectCommunitiesStatus = (state) => state.communities.status;
export const selectCommunitiesError = (state) => state.communities.error;
export const selectCommunitiesFilters = (state) => state.communities.filters;
export const selectCommunitiesCacheTimestamp = (state) => state.communities.cacheTimestamp;
export const selectIsCommunitiesLoading = (state) => state.communities.status === ApiResponse.LOADING;
export const selectIsCommunitiesError = (state) => state.communities.status === ApiResponse.ERROR;

export default communitiesSlice.reducer;
