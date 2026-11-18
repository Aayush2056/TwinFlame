# 🔥 TwinFlame — Dating & Profile Discovery Platform

A modern, responsive dating and profile discovery platform inspired by swipe-based dating applications. TwinFlame allows users to discover profiles, like or pass on them, and connect through mutual likes.

Built using the **MERN Stack**, with Redis-powered caching and rate limiting for better performance and API protection.

## ✨ Features

### 🏠 Home
- Modern landing page with a clean interface.
- Direct navigation to Discover and Matches.

### 💫 Discover
- Explore one profile at a time.
- Swipe right to Like and left to Pass.
- Mobile-friendly touch gestures using Framer Motion.
- Desktop support with Like/Pass buttons and keyboard shortcuts.
- Animated LIKE and PASS feedback.
- Previously swiped profiles do not reappear.
- Real-time mutual match detection.
- Match celebration modal.
- Loading states, error handling, and empty state.

### ❤️ Matches
- Displays only mutual matches.
- Matches sorted by newest first.
- Profile details modal.
- One-sided likes remain private.

### ⚡ Backend & Performance
- RESTful API architecture using Express.js.
- MongoDB Atlas for persistent data storage.
- Redis caching with a 120-second TTL.
- Redis-backed API rate limiting.
- Separate rate limits for Feed, Swipe, and Matches APIs.
- Zod validation for incoming API requests.
- Duplicate swipe prevention using compound unique indexes.
- Automatic Redis cache invalidation after swipe operations.
- Local JSON database fallback when MongoDB is unavailable.
- In-memory fallback when Redis is unavailable.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JSX |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Routing | React Router DOM |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Caching | Redis, ioredis |
| Rate Limiting | express-rate-limit, rate-limit-redis |
| Validation | Zod |
| Icons | Lucide React |
| Version Control | Git, GitHub |

## 📁 Project Structure

```text
TwinFlame/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/
│       │   ├── discover/
│       │   └── matches/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── index.js
│   ├── package.json
│   └── src/
│       ├── config/
│       ├── models/
│       ├── controllers/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       ├── validators/
│       ├── utils/
│       ├── seed/
│       └── app.js
│
├── vite.config.js
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/feed` | Fetch paginated discovery profiles |
| POST | `/api/swipe` | Like or pass on a profile |
| GET | `/api/matches` | Fetch mutual matches |
| POST | `/api/demo/reset` | Reset demo discovery data |

### Swipe Request Example

```json
{
  "profileId": "prof-01",
  "action": "like"
}
```

Allowed actions:
- `like`
- `pass`

## ⚡ Redis Implementation

TwinFlame uses Redis for two important purposes:

**1. Caching**
- Feed responses are cached for 120 seconds.
- Match responses are cached.
- Cache is invalidated when swipe operations change discovery or match data.

**2. Rate Limiting**

| API | Maximum Requests | Time Window |
|---|---:|---:|
| Feed | 120 | 1 minute |
| Swipe | 60 | 1 minute |
| Matches | 120 | 1 minute |

When Redis is available, rate-limit counters are stored in Redis. Otherwise, the application falls back to in-memory storage.

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- MongoDB Atlas account (optional if using local JSON fallback)
- Redis (optional; in-memory fallback is available)
- Git

### 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd TwinFlame
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
REDIS_URL=redis://127.0.0.1:6379
CORS_ORIGIN=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

Backend runs at:

`http://localhost:5000`

### 3. Setup Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs at:

`http://localhost:5173`

## 🔄 Application Flow

```text
         User
          |
          v
     React Frontend
          |
          v
      Axios API
          |
          v
     Express Server
          |
          v
    Rate Limiting
          |
          v
    Zod Validation
          |
          v
   Discovery Service
          |
       +--+--+
       |     |
       v     v
     Redis  MongoDB
    Cache   Database
       |     |
       +--+--+
          |
          v
    API Response
          |
          v
    React Frontend
```

## 🛡️ Error Handling & Fallbacks

- Invalid API inputs are rejected using Zod validation.
- Excessive API requests receive HTTP `429 Too Many Requests`.
- MongoDB unavailability triggers persistent local JSON storage.
- Redis unavailability triggers in-memory caching and rate limiting.
- Centralized Express error handling manages API errors.

## 🚀 Future Improvements

- User authentication with JWT.
- Real-time chat between matched users.
- Profile creation and editing.
- Image upload functionality.
- Location-based profile discovery.
- Advanced profile filtering.
- Production deployment and monitoring.

## 👨‍💻 Author

**Aayush Mishra**

MCA Student | MERN Stack Developer

- GitHub: https://github.com/Aayush2056

---

