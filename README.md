# LIFESHIELD - Preparedness Made Simple

LIFESHIELD is a high-end, enterprise-grade emergency preparedness e-commerce platform. It features a hyper-modern "Antigravity UI" frontend powered by Next.js and Framer Motion, and a robust Node.js/Express backend built on Clean Architecture principles.

## Features & Architecture

### Frontend (Antigravity UI)
- **Framework:** Next.js 14/15 App Router
- **Styling:** Tailwind CSS with custom Deep Void Grays, Neon Emerald/Violet Orbs, and Glassmorphism.
- **Motion:** Framer Motion utilizing spring physics for high-fidelity interactive elements (`MagneticButton`, `FloatingCard`).
- **State:** Redux Toolkit + Axios for API handling (mocked setup).

### Backend (Clean Architecture)
- **Framework:** Node.js, Express, TypeScript
- **Database:** MongoDB via Mongoose ODM
- **Security:** Helmet, express-rate-limit, express-mongo-sanitize, dompurify + jsdom, CORS.
- **Auth:** JWT Access (15m) + Refresh Tokens (7d), bcrypt hashing.
- **Structure:** Clean separation of Routes, Controllers, Services, and Models.

## Step-by-Step Setup (Recommended)

### 1) Prerequisites
- Node.js v18+
- npm
- MongoDB Community Server (or Docker Desktop)

### 2) Configure backend environment
1. Go to `backend/`.
2. Copy `.env.example` to `.env`.
3. Set your values (especially `JWT_SECRET` and `JWT_REFRESH_SECRET`).

Example:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/lifeshield
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=replace_with_strong_refresh_secret
JWT_REFRESH_EXPIRE=7d
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 3) Start MongoDB

Local MongoDB service:
- Windows Services: start `MongoDB`
- or run `mongod` if installed manually



### 4) Start backend
```bash
cd backend
npm install
npm run dev
```

Verify backend:
- Open `http://localhost:5000/api/health`

### 5) Start frontend
```bash
cd frontend
npm install
npm run dev
```

Verify frontend:
- Open `http://localhost:3000`
- Login page is at `http://localhost:3000/login`


## API Documentation
The API adheres strictly to REST conventions.

- `POST /api/v1/auth/register` - Create user
- `POST /api/v1/auth/login` - Authenticate & retrieve tokens
- `GET /api/v1/auth/me` - Get profile (Protected)
- `GET /api/v1/products` - Fetch paginated & text-indexed products
- `POST /api/v1/products` - Create product (Admin)
- `POST /api/v1/orders` - Submit new order (Protected)
- `GET /api/v1/orders/myorders` - Get current user orders (Protected)

## How MongoDB, Backend, and Frontend are linked

1. **MongoDB** stores collections (`users`, `products`, `orders`).
2. **Backend (Express + Mongoose)** connects using `MONGO_URI` and exposes REST APIs under `/api/v1`.
3. **Frontend (Next.js)** calls backend using `NEXT_PUBLIC_API_URL` (default: `http://localhost:5000/api/v1`).
4. **Login flow**:
   - Frontend `POST /auth/login`
   - Backend validates user from MongoDB and returns JWT tokens
   - Frontend stores tokens in `localStorage`
   - Axios interceptor adds `Authorization: Bearer <token>` on future API calls

## Security Implementation
- **Helmet Headers:** Secures standard HTTP attributes.
- **CORS Restricted Origin:** Enforces correct front-end origination.
- **Rate Limiting:** Protects API endpoints against DDoS/brute force.
- **DOMPurify:** Replaces deprecated xss-clean to sanitize HTML tag injection.
- **Mongo-Sanitize:** Strips keys starting with `$` to prevent NoSQL injection.

## Performance Enhancements
- Text-search indexing applied to MongoDB `Product` collections to prevent full-table scans.
- Next.js Server Components and Image caching used rigorously for optimal static delivery.
