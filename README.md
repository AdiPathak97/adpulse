# adpulse

A real-time campaign analytics dashboard for marketing teams.
Built with React, Node.js, MongoDB, and WebSockets.

## Features

- JWT authentication with httpOnly cookies
- Full campaign CRUD (create, pause, complete, delete)
- Live metric updates via WebSocket (clicks, impressions, conversions)
- Modular service/controller/route architecture
- Dockerised for one-command local setup

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Context API, socket.io-client |
| Backend | Node.js, Express, socket.io |
| Database | MongoDB, Mongoose |
| Auth | JWT, httpOnly cookies |
| DevOps | Docker, docker-compose, GitHub Actions |

## Architecture
```
adpulse/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # JWT auth guard
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routers
│   │   ├── services/     # Business logic layer
│   │   └── socket/       # Socket.io server + metric simulator
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/   # StatsCard, CampaignModal, LiveIndicator
│   │   ├── context/      # AuthContext, CampaignContext
│   │   ├── hooks/        # useWebSocket
│   │   ├── pages/        # Login, Register, Dashboard
│   │   └── services/     # api.js, auth.service.js, campaign.service.js
│   └── ...
├── .github/workflows/    # CI pipeline
└── docker-compose.yml
```

## Quick Start

### Without Docker
```bash
# 1. Backend
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

### With Docker
```bash
cp .env.example .env   # fill in JWT_SECRET
docker-compose up --build
```

Visit `http://localhost`

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |

### Campaigns
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/campaigns` | List all campaigns |
| POST | `/api/campaigns` | Create campaign |
| PUT | `/api/campaigns/:id` | Update campaign |
| DELETE | `/api/campaigns/:id` | Delete campaign |

### WebSocket Events
| Event | Direction | Payload |
|---|---|---|
| `join:campaign` | Client → Server | `campaignId` |
| `leave:campaign` | Client → Server | `campaignId` |
| `metrics:update` | Server → Client | `{ campaignId, metrics, spent, timestamp }` |

## React Native

The following are portable to React Native with no changes:
- `services/api.js` — swap `withCredentials` for `Authorization` header
- `services/auth.service.js` — identical
- `services/campaign.service.js` — identical
- `context/AuthContext.jsx` — identical
- `context/CampaignContext.jsx` — identical
- `hooks/useWebSocket.js` — swap cookie auth for token in socket options

UI layer (pages/components) needs rebuilding with React Native primitives.

## CI/CD

GitHub Actions runs on every push to `main` or `develop`:
- Backend: dependency install + syntax check
- Frontend: dependency install + production build

## Design Decisions

**Why Context API over Redux?**
App state is scoped — campaigns belong to the dashboard, auth belongs to the app shell. Context handles this cleanly without the boilerplate of Redux. Would migrate to Redux Toolkit if the app grew to need cross-cutting state or complex async flows.

**Why JWT in httpOnly cookies over localStorage?**
localStorage is vulnerable to XSS — any injected script can read it. httpOnly cookies are invisible to JavaScript entirely. Combined with `sameSite: strict` this covers both XSS and CSRF vectors.

**Why Socket.io over raw WebSockets?**
Automatic reconnection, room-based pub/sub, and middleware support. The auth middleware on the socket handshake mirrors the HTTP auth middleware — consistent security model across both transports.

**Why a separate service layer?**
Controllers handle HTTP, services handle business logic. Services are callable from HTTP routes, socket handlers, or cron jobs without needing a fake `req` object. This is the foundation of a scalable, testable backend.