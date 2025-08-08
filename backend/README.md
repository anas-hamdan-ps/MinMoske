# Backend (Node.js + Express)
## Setup
1. Install Node.js (v16+)
2. `cd backend`
3. `cp .env.example .env` and edit if needed
4. `npm install`
5. Start MongoDB (locally or via Docker)
6. `npm run seed` to load sample mosques
7. `npm run dev` to start with nodemon or `npm start`

## Endpoints
- `GET /api/mosques?lat=...&lng=...` - nearby mosques
- `GET /api/mosques?q=stockholm` - search by name/city/country
- `GET /api/mosques/:id` - get mosque details & prayer times
