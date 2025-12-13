# Authentication Fixes

## Issues Fixed

1. **AuthGuard was making unnecessary API calls** - Now only checks if token exists in localStorage
2. **Tokens weren't being saved** - Fixed `auth-form.tsx` to properly save tokens after login/signup
3. **Redirects weren't working** - Changed to use `window.location.href` for full page reload
4. **Role selection missing COMPANY and CITY** - Updated signup form to include all three roles
5. **API URL hardcoded** - Now uses environment variable with fallback

## Changes Made

### 1. `frontend/lib/auth-guard.tsx`
- Simplified token validation (no API call on every check)
- Better loading states
- Proper redirect handling with Next.js router

### 2. `frontend/components/auth-form.tsx`
- Now saves tokens to localStorage after login/signup
- Redirects to `/map` instead of old dashboard routes
- Added COMPANY and CITY role options
- Uses `window.location.href` for proper page reload

### 3. `frontend/utils/helper.ts`
- Uses environment variable for API URL
- Better error handling

### 4. `frontend/components/auth/Login.tsx` & `Signup.tsx`
- Already had token saving, but improved redirect timing

## How to Test

1. **Start the backend:**
```bash
cd backend
npm run dev
```

2. **Start the frontend:**
```bash
cd frontend
npm run dev
```

3. **Test Login Flow:**
   - Go to `http://localhost:3000/login`
   - Use test credentials: `homeowner1@example.com` / `password123`
   - Should redirect to `/map` after login
   - Should NOT redirect back to login

4. **Test Signup Flow:**
   - Go to `http://localhost:3000/signup`
   - Fill in form and select role (Homeowner, Company, or City)
   - Should redirect to `/map` after signup
   - Should be able to access map without redirect

5. **Test Protected Route:**
   - Try accessing `/map` without logging in
   - Should redirect to `/login?redirect=/map`
   - After login, should redirect back to `/map`

## Troubleshooting

If you're still being redirected to login:

1. **Check localStorage:**
   - Open browser DevTools → Application → Local Storage
   - Verify `accessToken` and `user` exist
   - If missing, login again

2. **Check token format:**
   - Token should be a JWT string
   - User should be a JSON string

3. **Clear localStorage and try again:**
```javascript
localStorage.clear()
```

4. **Check backend is running:**
   - Backend should be on `http://localhost:3001`
   - Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`

5. **Check browser console:**
   - Look for any errors
   - Check network tab for failed requests

## Environment Variables

Make sure you have `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GEOAPIFY_KEY=your-key-here
```

