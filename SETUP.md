# Agastyaan Real Estate - Full Dynamic Setup

## 1) Project Structure

```text
Agastyaan real state/
  frontend (existing static pages in root + /pages + /components)
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      app.js
      server.js
    uploads/
    .env
```

## 2) Backend Setup (Node + Express + MongoDB)

1. Install MongoDB locally and start MongoDB service.
2. Open terminal in `backend/`
3. Install dependencies:
   - `npm install`
4. Create `.env` (already added):
   - `PORT=4000`
   - `MONGO_URI=mongodb://127.0.0.1:27017/agastyaan_real_estate`
   - `JWT_SECRET=agastyaan_super_secret_key`
5. Start backend:
   - `npm run dev`

## 3) Default Admin Login

- Email: `admin@agastyaan.com`
- Password: `admin123`

Admin is auto-seeded when DB is empty.

## 4) Database Schema (MongoDB)

### User
- name, email, passwordHash, role (`admin/sub-admin/user`), avatar, bio, active

### Property
- title, price, location, type (`rent/sale`), images[], description, amenities[], status, createdBy

### Review
- customerName, rating (1-5), comment, status (`pending/approved/rejected/spam`)

## 5) API Routes

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Users
- `GET /api/users/me`
- `PUT /api/users/profile`
- `POST /api/users/change-password`
- `POST /api/users/avatar`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/users/analytics/summary`

### Properties
- `GET /api/properties`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`

### Reviews
- `GET /api/reviews`
- `POST /api/reviews`
- `PUT /api/reviews/:id/status`
- `PUT /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Analytics
- `GET /api/analytics`

## 6) Frontend Dynamic Flows

- Navbar: `Dealers/Builders` replaced with `Post Property`
- `pages/post-property.html`: posts to backend with image upload
- `index.html`: dynamic property cards + live search + approved reviews
- `pages/ForTenent.html`: dynamic tenant filters (budget/location/type)
- `pages/ForBuyers.html`: dynamic sale listings + filters
- `pages/property-details.html`: property detail page
- `admin/admin.html`: dynamic admin management for properties/reviews/users/analytics

## 7) Important Notes

- Keep backend running on `http://localhost:4000`.
- Frontend can run using any static server.
- Property/review data is fully DB-driven; no static dummy data.
