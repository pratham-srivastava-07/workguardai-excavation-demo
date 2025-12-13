# Renowise Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/renowise"
JWT_SECRET="your-secret-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-secret-key-change-in-production"
PORT=3001
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev
```

4. Seed the database:
```bash
npm run seed
```

This will create:
- 5 Users (2 Homeowners, 2 Companies, 1 City)
- 2 Company Profiles
- 1 City Profile
- 6 Posts (3 Materials, 2 Services, 1 Space)
- 2 Offers
- 2 Projects
- Audit Logs

Test credentials:
- Email: `homeowner1@example.com` / Password: `password123`
- Email: `company1@example.com` / Password: `password123`
- Email: `city1@example.com` / Password: `password123`

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/v1/posts/search` - Search posts (public)
- `GET /api/v1/posts/:id` - Get post by ID (public)
- `GET /api/v1/posts` - Get user's posts (protected)
- `POST /api/v1/posts` - Create post (protected)
- `PUT /api/v1/posts/:id` - Update post (protected)
- `DELETE /api/v1/posts/:id` - Delete post (protected)
- `PATCH /api/v1/posts/:id/status` - Update post status (protected)

### Offers
- `POST /api/v1/posts/:postId/offers` - Create offer (protected)
- `GET /api/v1/posts/:postId/offers` - Get post offers (protected, post owner only)
- `PATCH /api/v1/posts/offers/:id/status` - Update offer status (protected, post owner only)

