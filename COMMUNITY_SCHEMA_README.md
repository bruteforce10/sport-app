# Community Schema & API Documentation

## 📋 Database Schema

### Model Community
```prisma
model Community {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId
  category    String       // Cabang olahraga
  name        String       // Nama komunitas
  city        String       // Kota
  description String       // Deskripsi komunitas
  socialMedia SocialMedia?
  privacy     Privacy      @default(open)
  members     Int          @default(1) // Jumlah anggota (initial 1)
  rating      Float        @default(0) // Rating komunitas (initial 0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

### Model SocialMedia
```prisma
model SocialMedia {
  id          String @id @default(auto()) @map("_id") @db.ObjectId
  communityId String @unique @db.ObjectId
  instagram   String?
  facebook    String?
  tiktok      String?
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
}
```

### Enum Privacy
```prisma
enum Privacy {
  open    // Komunitas terbuka
  closed  // Komunitas tertutup
}
```

## 🚀 API Endpoints

### 1. Create Community
**POST** `/api/communities`

**Request Body:**
```json
{
  "category": "Sepak Bola",
  "name": "Komunitas Sepak Bola Bandung",
  "city": "Bandung",
  "description": "Deskripsi komunitas...",
  "socialMedia": {
    "instagram": "username",
    "facebook": "page_name",
    "tiktok": "username"
  },
  "privacy": "open"
}
```

**Response:**
```json
{
  "message": "Community created successfully",
  "community": {
    "id": "...",
    "category": "Sepak Bola",
    "name": "Komunitas Sepak Bola Bandung",
    "city": "Bandung",
    "description": "Deskripsi komunitas...",
    "privacy": "open",
    "members": 1,
    "rating": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "socialMedia": {
      "id": "...",
      "instagram": "username",
      "facebook": "page_name",
      "tiktok": "username"
    }
  }
}
```

### 2. Get All Communities
**GET** `/api/communities`

**Query Parameters:**
- `category` - Filter by sport category
- `city` - Filter by city
- `privacy` - Filter by privacy (open/closed)
- `search` - Search in name, description, city, or category

**Examples:**
```
GET /api/communities?category=Sepak%20Bola
GET /api/communities?city=Bandung
GET /api/communities?privacy=open
GET /api/communities?search=bandung
```

### 3. Get Community by ID
**GET** `/api/communities/[id]`

**Response:**
```json
{
  "community": {
    "id": "...",
    "category": "Sepak Bola",
    "name": "Komunitas Sepak Bola Bandung",
    "city": "Bandung",
    "description": "Deskripsi komunitas...",
    "privacy": "open",
    "members": 1,
    "rating": 0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "socialMedia": {
      "id": "...",
      "instagram": "username",
      "facebook": "page_name",
      "tiktok": "username"
    }
  }
}
```

### 4. Update Community
**PUT** `/api/communities/[id]`

**Request Body:** Same as create community

**Response:**
```json
{
  "message": "Community updated successfully",
  "community": { ... }
}
```

### 5. Delete Community
**DELETE** `/api/communities/[id]`

**Response:**
```json
{
  "message": "Community deleted successfully"
}
```

### 6. Update Rating
**PUT** `/api/communities/[id]/rating`

**Request Body:**
```json
{
  "rating": 4.5
}
```

**Response:**
```json
{
  "message": "Rating updated successfully",
  "community": { ... }
}
```

### 7. Update Member Count
**PUT** `/api/communities/[id]/members`

**Request Body:**
```json
{
  "action": "join"  // or "leave"
}
```

**Response:**
```json
{
  "message": "Member joined successfully",
  "community": { ... }
}
```

## 🛠️ Service Layer

### CommunityService Class

**Methods:**
- `createCommunity(data)` - Create new community
- `getAllCommunities()` - Get all communities
- `getCommunityById(id)` - Get community by ID
- `getCommunitiesByCategory(category)` - Filter by category
- `getCommunitiesByCity(city)` - Filter by city
- `getCommunitiesByPrivacy(privacy)` - Filter by privacy
- `searchCommunities(query)` - Search communities
- `updateCommunity(id, data)` - Update community
- `deleteCommunity(id)` - Delete community
- `updateRating(id, rating)` - Update rating
- `updateMemberCount(id, increment)` - Update member count
- `getTopRatedCommunities(limit)` - Get top rated communities

## 🗄️ Database Operations

### Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

### Sample Data
The seed file includes 5 sample communities:
1. **Komunitas Sepak Bola Bandung** - Open community
2. **Basket Jakarta Community** - Open community
3. **Komunitas Badminton Surabaya** - Closed community
4. **Tennis Club Denpasar** - Closed community
5. **Swimming Community Medan** - Open community

## 🔐 Validation Rules

### Required Fields
- `category` - Sport category
- `name` - Community name (3-100 characters)
- `city` - City (2+ characters)
- `description` - Description (30-500 characters)
- `privacy` - Privacy setting (open/closed)

### Optional Fields
- `socialMedia.instagram` - Instagram username
- `socialMedia.facebook` - Facebook page name
- `socialMedia.tiktok` - TikTok username

### Default Values
- `members` - 1 (initial member count)
- `rating` - 0 (initial rating)
- `privacy` - "open"
- `createdAt` - Current timestamp
- `updatedAt` - Current timestamp

## 📱 Frontend Integration

### Form Submission
```javascript
async function onSubmit(values) {
  try {
    const response = await fetch('/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create community');
    }

    const result = await response.json();
    console.log('Community created:', result);
    
    // Redirect to communities page
    router.push("/komunitas");
  } catch (error) {
    console.error('Error creating community:', error);
    alert(`Gagal membuat komunitas: ${error.message}`);
  }
}
```

### Fetching Communities
```javascript
// Get all communities
const response = await fetch('/api/communities');
const { communities } = await response.json();

// Get communities by category
const response = await fetch('/api/communities?category=Sepak%20Bola');
const { communities } = await response.json();

// Search communities
const response = await fetch('/api/communities?search=bandung');
const { communities } = await response.json();
```

## 🚨 Error Handling

### Common Errors
- **400 Bad Request** - Missing required fields
- **404 Not Found** - Community not found
- **500 Internal Server Error** - Database or server error

### Error Response Format
```json
{
  "error": "Error message description"
}
```

## 🔄 Data Flow

1. **User fills form** → Form validation with Zod
2. **Form submission** → API call to `/api/communities`
3. **API validation** → Check required fields
4. **Service layer** → Business logic and database operations
5. **Database** → MongoDB with Prisma ODM
6. **Response** → Success/error message to frontend

## 📊 Performance Considerations

- **Indexing** - MongoDB indexes on frequently queried fields
- **Pagination** - Limit results for large datasets
- **Caching** - Consider Redis for frequently accessed data
- **Search** - Full-text search with MongoDB text indexes

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Community membership management
- [ ] Event scheduling and management
- [ ] Photo and media uploads
- [ ] Real-time notifications
- [ ] Community analytics and insights
- [ ] Mobile app API endpoints
- [ ] Webhook integrations
