# Redux Toolkit Implementation Guide

## Overview
Sistem state management menggunakan Redux Toolkit telah diimplementasikan dengan fitur caching, error handling, dan async operations menggunakan AsyncThunk.

## Struktur File

### 1. Store Configuration
- **`lib/store.js`** - Konfigurasi Redux store dengan middleware dan devtools

### 2. Slices
- **`lib/slices/communitiesSlice.js`** - State management untuk komunitas
- **`lib/slices/eventsSlice.js`** - State management untuk events
- **`lib/slices/userSlice.js`** - State management untuk user

### 3. Types & Constants
- **`lib/types.js`** - Definisi tipe data dan konstanta
- **`lib/cacheUtils.js`** - Utility functions untuk manajemen cache

### 4. Components
- **`components/ReduxProvider.jsx`** - Provider untuk Redux store
- **`components/ErrorBoundary.jsx`** - Error boundary untuk handling error
- **`components/LoadingSpinner.jsx`** - Component loading spinner
- **`components/ReduxDebug.jsx`** - Debug panel untuk development

### 5. Custom Hooks
- **`lib/hooks/useAppDispatch.js`** - Type-safe dispatch hook
- **`lib/hooks/useAppSelector.js`** - Type-safe selector hook

## Fitur Utama

### 1. AsyncThunk Operations
Setiap slice memiliki AsyncThunk untuk operasi CRUD:
- `fetchCommunities()` - Fetch data komunitas
- `createCommunity()` - Buat komunitas baru
- `updateCommunity()` - Update komunitas
- `deleteCommunity()` - Hapus komunitas
- `fetchCommunityById()` - Fetch komunitas by ID

### 2. Caching System
- Cache valid selama 5 menit
- Automatic cache invalidation
- Manual cache clearing
- Cache timestamp tracking

### 3. State Management
Setiap slice memiliki state:
- `data` - Data utama
- `status` - Status operasi (idle, loading, success, error)
- `error` - Error message
- `cacheTimestamp` - Timestamp cache terakhir

### 4. Error Handling
- Comprehensive error handling di setiap AsyncThunk
- Error state management
- Error clearing actions
- Error boundary component

## Penggunaan

### 1. Setup Store
```jsx
import { Provider } from 'react-redux';
import { store } from '@/lib/store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### 2. Menggunakan AsyncThunk
```jsx
import { useDispatch, useSelector } from 'react-redux';
import { fetchCommunities, selectCommunities } from '@/lib/slices/communitiesSlice';

function CommunitiesPage() {
  const dispatch = useDispatch();
  const communities = useSelector(selectCommunities);
  
  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);
  
  // ... rest of component
}
```

### 3. State Selectors
```jsx
import { 
  selectCommunities, 
  selectIsCommunitiesLoading,
  selectCommunitiesError 
} from '@/lib/slices/communitiesSlice';

const communities = useSelector(selectCommunities);
const isLoading = useSelector(selectIsCommunitiesLoading);
const error = useSelector(selectCommunitiesError);
```

### 4. Actions
```jsx
import { 
  setFilters, 
  clearFilters, 
  clearCache 
} from '@/lib/slices/communitiesSlice';

// Set filters
dispatch(setFilters({ category: 'Football', city: 'Jakarta' }));

// Clear filters
dispatch(clearFilters());

// Clear cache
dispatch(clearCache());
```

## Cache Management

### 1. Automatic Caching
- Data otomatis di-cache selama 5 menit
- Cache validation di setiap AsyncThunk
- Tidak melakukan API call jika cache masih valid

### 2. Manual Cache Control
```jsx
import { clearCache } from '@/lib/slices/communitiesSlice';

// Force refresh data
dispatch(clearCache());
dispatch(fetchCommunities());
```

### 3. Cache Utilities
```jsx
import { isCacheValid, formatCacheAge } from '@/lib/cacheUtils';

const isValid = isCacheValid(timestamp);
const age = formatCacheAge(timestamp); // "2 minutes ago"
```

## Error Handling

### 1. AsyncThunk Error Handling
```jsx
export const fetchCommunities = createAsyncThunk(
  'communities/fetchCommunities',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/communities');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 2. Error State Management
```jsx
const error = useSelector(selectCommunitiesError);

if (error) {
  return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => dispatch(clearError())}>
        Clear Error
      </button>
    </div>
  );
}
```

## Development Tools

### 1. Redux DevTools
- Redux DevTools Extension support
- Action logging
- State inspection
- Time travel debugging

### 2. Debug Component
- Real-time state monitoring
- Cache status display
- Quick actions (refresh, clear data)
- Development only

## Best Practices

### 1. State Structure
- Normalized data structure
- Immutable updates
- Selective re-rendering

### 2. Performance
- Memoized selectors
- Conditional rendering
- Efficient re-renders

### 3. Error Boundaries
- Component-level error handling
- Graceful fallbacks
- User-friendly error messages

## Migration dari Local State

### Before (Local State)
```jsx
const [communities, setCommunities] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await fetch('/api/communities');
    setCommunities(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### After (Redux)
```jsx
const dispatch = useDispatch();
const communities = useSelector(selectCommunities);
const isLoading = useSelector(selectIsCommunitiesLoading);
const error = useSelector(selectCommunitiesError);

useEffect(() => {
  dispatch(fetchCommunities());
}, [dispatch]);
```

## Testing

### 1. Unit Tests
- Slice reducers
- AsyncThunk actions
- Selectors

### 2. Integration Tests
- Store integration
- Component integration
- API integration

### 3. E2E Tests
- User workflows
- State persistence
- Error scenarios

## Troubleshooting

### 1. Common Issues
- **Hydration errors**: Pastikan ReduxProvider wrap dengan benar
- **Cache issues**: Check cacheTimestamp dan CACHE_DURATION
- **Performance**: Monitor re-renders dan selector usage

### 2. Debug Steps
- Check Redux DevTools
- Use ReduxDebug component
- Monitor console logs
- Verify store configuration

## Future Enhancements

### 1. Persistence
- Redux Persist integration
- Local storage sync
- Offline support

### 2. Advanced Caching
- Background refresh
- Stale-while-revalidate
- Cache warming

### 3. Real-time Updates
- WebSocket integration
- Optimistic updates
- Conflict resolution
