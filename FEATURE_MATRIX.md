# Renowise Feature Matrix

## Role Capabilities Comparison

| Feature | Homeowner | Company | City |
|---------|-----------|---------|------|
| **Create Material Posts** | ✅ | ✅ | ✅ |
| **Create Service Posts** | ✅ (Request) | ✅ (Offer) | ❌ |
| **Create Space Posts** | ✅ | ❌ | ✅ |
| **Make Offers** | ❌ | ✅ | ❌ |
| **Receive Offers** | ✅ | ✅ | ✅ |
| **Create Projects** | ✅ | ❌ | ❌ |
| **View Orders** | ❌ | ✅ | ✅ |
| **Modify Offers** | ❌ | ✅ | ❌ |
| **Accept/Reject Offers** | ✅ | ✅ | ✅ |
| **View Dashboard** | ✅ | ✅ | ✅ |
| **Access Other Role Dashboards** | ❌ | ❌ | ❌ |

---

## Post Type Capabilities

| Post Type | Homeowner | Company | City |
|-----------|-----------|---------|------|
| **MATERIAL** | ✅ Create, Receive Offers | ✅ Create, Make Offers | ✅ Create, Receive Offers |
| **SERVICE** | ✅ Request Services | ✅ Offer Services | ❌ |
| **SPACE** | ✅ Offer/Request Spaces | ❌ | ✅ Offer Municipal Spaces |

---

## Offer System Details

### Offer Types by Role

| Role | Offer Format | Can Make Offers | Can Receive Offers | Can Modify Offers |
|------|-------------|-----------------|-------------------|-------------------|
| **Homeowner** | Text-based only | ❌ | ✅ | ❌ |
| **Company** | Structured (pricing, timelines) | ✅ | ✅ | ✅ |
| **City** | Structured (pricing, timelines) | ❌ | ✅ | ❌ |

### Offer Status Flow

```
PENDING → ACCEPTED (becomes Order) ✅
       → REJECTED ❌
       → MODIFIED (by offerer) 🔄
```

---

## Dashboard Metrics

### Homeowner Dashboard
- ✅ Total Posts Created
- ✅ Active Projects
- ✅ Pending Offers
- ✅ Completed Projects
- ✅ Recent Projects
- ✅ Recent Posts

### Company Dashboard
- ✅ Services/Materials Posted
- ✅ Active Jobs
- ✅ Pending Offers
- ✅ Orders in Progress
- ✅ Workload Indicators
- ✅ Recent Offers

### City Dashboard
- ✅ City Posts (Materials, Spaces)
- ✅ Reuse/Diversion Metrics
- ✅ Active Pickups/Allocations
- ✅ Engagement Overview
- ✅ Hazardous Materials Count
- ✅ Recent Activity

---

## Navigation Features

| Feature | All Roles |
|---------|-----------|
| **Map View** | ✅ Always visible, persistent |
| **Left Panel** | ✅ Collapsible, overlays map |
| **Search** | ✅ By keywords, location, type |
| **Filters** | ✅ Type, price, condition, radius |
| **Pin Click** | ✅ Opens post details |
| **Map Click** | ✅ Collapses left panel |
| **List Click** | ✅ Centers map on location |
| **Responsive Design** | ✅ Desktop, Tablet, Mobile |

---

## Post Creation Requirements

| Requirement | Material | Service | Space |
|-------------|----------|---------|-------|
| **Title** | ✅ Required | ✅ Required | ✅ Required |
| **Subtype** | ✅ Required | ✅ Required | ✅ Required |
| **Description** | ⚪ Optional | ⚪ Optional | ⚪ Optional |
| **Location** | ✅ Required | ✅ Required | ✅ Required |
| **Images** | ✅ 2-6 required | ✅ 2-6 required | ✅ 2-6 required |
| **Price** | ⚪ Optional | ⚪ Optional | ⚪ Optional |
| **Quantity** | ⚪ Optional | ❌ | ❌ |
| **Hourly Rate** | ❌ | ⚪ Optional | ⚪ Optional |
| **Daily Rate** | ❌ | ⚪ Optional | ⚪ Optional |
| **Rental Duration** | ❌ | ❌ | ⚪ Optional |

---

## Restrictions & Limitations

### Self-Offer Restriction
- **Enforcement**: Frontend (button hidden) + Backend (API validation)
- **Applies to**: All roles
- **Message**: "You cannot make an offer on your own post"

### Role-Based Access
- **Dashboard Access**: Each role can only access their own dashboard
- **Redirect**: Attempting to access another role's dashboard redirects to your dashboard
- **Enforcement**: Frontend (RoleProtectedRoute) + Backend (requireRole middleware)

### Offer Modification
- **Who Can Modify**: Only offer creator (Company)
- **When**: Only PENDING offers
- **What**: Amount and message
- **Cannot Modify**: ACCEPTED or REJECTED offers

---

## Order System

### Order Sources
1. **Accepted Offers** → Automatically become orders
2. **Assigned Pickups** → City/Company assigned pickups
3. **Service Bookings** → Booked services

### Order Visibility
- **Homeowner**: ❌ Cannot view orders
- **Company**: ✅ Can view orders (accepted offers on their posts)
- **City**: ✅ Can view orders (accepted offers on city posts)

### Order Details
- Post information
- Quantity and pricing
- Images
- Customer/offerer information
- Location (with map centering)
- Status tracking

---

## Map Features

| Feature | Availability |
|---------|--------------|
| **Interactive Map** | ✅ All roles |
| **Pin Clustering** | ✅ Performance optimization |
| **Geolocation** | ✅ Distance calculation |
| **Pan & Zoom** | ✅ Full control |
| **Pin Highlighting** | ✅ On selection |
| **Auto-Centering** | ✅ On item click |
| **Persistent State** | ✅ Across navigation |
| **Responsive** | ✅ All screen sizes |

---

## Coming Soon Features

| Feature | Status |
|---------|--------|
| **Messages** | 🚧 Coming Soon (UI ready) |
| **Wallet / Payments** | 🚧 Coming Soon (UI ready) |
| **Settings** | 🚧 Coming Soon |
| **Notifications** | 🚧 Planned |
| **Reviews & Ratings** | 🚧 Planned |

---

## Data Flow

| Component | Data Source |
|-----------|-------------|
| **Dashboard Metrics** | ✅ Backend API (server-side computed) |
| **Post Lists** | ✅ Backend API |
| **Offers** | ✅ Backend API |
| **Orders** | ✅ Backend API |
| **Projects** | ✅ Backend API |
| **Map Pins** | ✅ Backend API |
| **User Info** | ✅ Backend API |

**No Hardcoded Data**: All UI states, counts, lists driven by APIs

---

## Image Handling

| Aspect | Details |
|--------|---------|
| **Format** | Base64 data URLs |
| **Storage** | JSON array in database |
| **Min Required** | 2 images |
| **Max Allowed** | 6 images |
| **Max Size** | 5MB per image |
| **Compression** | Client-side compression for preview |
| **Rendering** | Handles both array and JSON string formats |
| **Error Handling** | Fallback placeholder on load error |

---

## API Endpoints Summary

### Posts
- `GET /api/v1/posts` - Get user's posts
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts/search` - Search posts
- `GET /api/v1/posts/:id` - Get post by ID

### Offers
- `POST /api/v1/posts/:postId/offers` - Create offer
- `GET /api/v1/posts/:postId/offers` - Get post offers
- `PATCH /api/v1/posts/offers/:id/status` - Update offer status
- `PUT /api/v1/posts/offers/:id` - Modify offer

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics

### Projects & Offers
- `GET /api/v1/projects-offers` - Get projects and offers

### Orders
- `GET /api/v1/orders` - Get orders (Company/City)

---

## Security & Permissions

| Feature | Frontend | Backend |
|---------|----------|---------|
| **Authentication** | ✅ ProtectedRoute | ✅ authMiddleware |
| **Role Authorization** | ✅ RoleProtectedRoute | ✅ requireRole middleware |
| **Self-Offer Prevention** | ✅ Button hidden | ✅ API validation |
| **Offer Modification** | ✅ UI restrictions | ✅ Ownership check |
| **Post Ownership** | ✅ UI indicators | ✅ API validation |

---

*This matrix provides a quick reference for all platform capabilities and restrictions.*

