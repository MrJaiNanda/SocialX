# SocialX

https://mrjainanda.github.io/SocialX/ 
ABOVE IS THE LINK FOR THE WEBSITE IF YOU ARE READING THE README

A simple, easy-to-read social media app: sign up, post short updates, like and
comment on posts, and view profiles.

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT tokens + hashed passwords (bcrypt)

## Project structure

```
socialx/
  server/     Express API (auth, posts, users)
  client/     React app (Vite + Tailwind)
```

## 1. Set up the database

You need a MongoDB database. The easiest options:

- **Local:** install MongoDB Community Edition and run it on the default port
  (`mongodb://127.0.0.1:27017`).
- **Cloud (free):** create a free cluster at https://www.mongodb.com/atlas and
  copy the connection string it gives you.

## 2. Run the backend

```bash
cd server
cp .env.example .env    # then edit .env with your MongoDB URI + a secret
npm install
npm run dev              # starts on http://localhost:5000
```

`.env` fields:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string, used to sign login tokens
- `PORT` — defaults to 5000
- `CLIENT_URL` — the frontend's URL, for CORS (defaults to http://localhost:5173)

## 3. Run the frontend

In a separate terminal:

```bash
cd client
cp .env.example .env    # only needed if your API isn't on localhost:5000
npm install
npm run dev              # starts on http://localhost:5173
```

Open http://localhost:5173 in your browser, sign up for an account, and start posting.

## How the code is organized

**Server (`server/src`)**
- `models/` — Mongoose schemas: `User` and `Post` (with embedded comments)
- `controllers/` — the actual logic for each route (register, login, create post, like, comment...)
- `routes/` — wires URLs like `/api/posts` to the right controller function
- `middleware/auth.js` — checks the login token on protected routes
- `index.js` — starts the Express server and connects to MongoDB

**Client (`client/src`)**
- `context/AuthContext.jsx` — holds the logged-in user in memory, shared across the whole app
- `api/axios.js` — one shared HTTP client that automatically attaches your login token
- `components/` — reusable pieces: `Navbar`, `PostForm`, `PostCard`, `Avatar`, `ProtectedRoute`
- `pages/` — one file per screen: `Feed`, `Login`, `Register`, `Profile`
- `App.jsx` — defines the app's routes (URLs)

## Features included

- Sign up / log in with a hashed password and a JWT session
- Post short text updates to a public feed
- Like and unlike posts
- Comment on posts
- Delete your own posts
- Visit any user's profile page and edit your own bio
- Clean, high-contrast UI (dark ink text on white cards, a single blue accent
  for actions, a red accent reserved for likes/errors) with visible keyboard
  focus states
