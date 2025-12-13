# Renowise Platform - Setup Guide

## Overview

Renowise is a map-first marketplace platform for construction materials, services, and spaces. It connects Homeowners, Companies, and Cities to facilitate the exchange of renovation resources.

## Features Implemented

✅ **Authentication System**
- Sign up with roles: Homeowner, Company, City
- Login with token-based authentication
- Protected routes (map requires authentication)
- Draft preservation for unauthenticated users

✅ **Persistent Map Interface**
- Map remains visible throughout the session
- Collapsible left panel for results/forms
- Top bar with search, menu, and auth buttons
- Dashboard menu for authenticated users

✅ **Post Management**
- Create posts (Materials, Services, Spaces)
- Search posts with geolocation
- View post details
- Edit/Delete posts (with audit logging)
- Image upload (2-6 images required)

✅ **Offer System**
- Make offers on posts
- View offers (post owners)
- Accept/Reject offers

✅ **Color Scheme**
- Black background (#000000)
- White text throughout
- Consistent dark theme

## Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
Create `backend/.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/renowise"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
PORT=3001
```

3. **Run migrations:**
```bash
npx prisma migrate dev
```

4. **Seed the database:**
```bash
npm run seed
```

This creates:
- 5 Users (2 Homeowners, 2 Companies, 1 City)
- Company and City profiles
- 6 Posts (Materials, Services, Spaces)
- 2 Offers
- 2 Projects

**Test Credentials:**
- Homeowner: `homeowner1@example.com` / `password123`
- Company: `company1@example.com` / `password123`
- City: `city1@example.com` / `password123`

5. **Start backend server:**
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Set up environment variables:**
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GEOAPIFY_KEY=your-geoapify-key
```

3. **Start development server:**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Usage Flow

1. **Sign Up / Login**
   - Visit `/signup` or `/login`
   - Choose role: Homeowner, Company, or City
   - After login, redirected to `/map`

2. **Map Interface**
   - Map is always visible
   - Search bar in top bar
   - Results appear in left panel
   - Click result to see details

3. **Create Post**
   - Click the "+" button (bottom right)
   - Fill in post details
   - Upload 2-6 images
   - Post appears on map immediately

4. **Make Offer**
   - View post details
   - Click "Make an Offer"
   - Enter offer amount
   - Post owner can accept/reject

5. **View My Posts**
   - Click "My Posts" in dashboard menu
   - See all your posts
   - Edit or delete posts

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/login` - Login

### Posts
- `GET /api/v1/posts/search` - Search posts (public)
- `GET /api/v1/posts/:id` - Get post by ID (public)
- `GET /api/v1/posts` - Get user's posts (protected)
- `POST /api/v1/posts` - Create post (protected)
- `PUT /api/v1/posts/:id` - Update post (protected)
- `DELETE /api/v1/posts/:id` - Delete post (protected)

### Offers
- `POST /api/v1/posts/:postId/offers` - Create offer (protected)
- `GET /api/v1/posts/:postId/offers` - Get offers (protected)
- `PATCH /api/v1/posts/offers/:id/status` - Update offer status (protected)

## Architecture

- **Backend**: Express.js + TypeScript + Prisma + PostgreSQL
- **Frontend**: Next.js 15 + React + TypeScript + Tailwind CSS
- **Map**: MapLibre GL
- **Authentication**: JWT tokens

## Notes

- All routes except search require authentication
- Map route is protected - redirects to login if not authenticated
- Draft posts are saved to localStorage for unauthenticated users
- Audit logs track all post changes
- Geolocation search uses radius-based filtering

