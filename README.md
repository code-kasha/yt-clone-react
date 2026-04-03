# 🎨 YouTube Clone — Frontend

> React · Vite · Tailwind CSS · Axios · React Router

---

## Overview

This is the **frontend application** for the YouTube Clone project. It consumes the backend REST API and provides a fully responsive YouTube-like interface with video browsing, authentication, a video player, channel management, search, and category filtering.

---

## Tech Stack

| Layer            | Technology        |
| ---------------- | ----------------- |
| Framework        | React 18          |
| Build Tool       | Vite              |
| Styling          | Tailwind CSS      |
| Routing          | React Router v6   |
| HTTP Client      | Axios             |
| State Management | React Context API |
| Icons            | React Icons       |

---

## Folder Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/
│   │   └── axiosInstance.js       # Axios base config + interceptors
│   ├── components/
│   │   ├── Header/
│   │   │   ├── Header.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── Sidebar/
│   │   │   └── Sidebar.jsx
│   │   ├── VideoCard/
│   │   │   └── VideoCard.jsx
│   │   ├── VideoGrid/
│   │   │   └── VideoGrid.jsx
│   │   ├── FilterBar/
│   │   │   └── FilterBar.jsx
│   │   └── Comments/
│   │       ├── CommentSection.jsx
│   │       └── CommentCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── VideoPlayer.jsx
│   │   └── Channel.jsx
│   ├── utils/
│   │   └── formatCount.js         # Helper: format view/like counts
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                  # Tailwind directives
├── .env.example
├── index.html
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Backend server running on `http://localhost:5000`
- npm

### Installation

```bash
# 1. Navigate into the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Set VITE_API_URL to your backend URL

# 4. Start the development server
npm run dev
```

The app will open at `http://localhost:5173`.

---

## Environment Variables

Create a `.env` file in the `frontend/` root:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Pages & Features

### 🏠 Home Page (`/`)

- YouTube-style **Header** with logo, search bar, and sign-in button
- **Hamburger menu** toggles the sidebar
- **Sidebar** with navigation links (Home, Subscriptions, etc.)
- **Filter bar** with at least 6 category buttons (All, Music, Gaming, Education, Sports, Tech, etc.)
- **Video grid** — responsive card layout showing:
  - Thumbnail
  - Title
  - Channel name
  - View count
- Clicking a video navigates to `/video/:id`

---

### 🔐 Authentication (`/login`, `/register`)

- **Register page** — form with Username, Email, Password fields
  - Input validation with inline error messages
  - On success → redirect to `/login`
- **Login page** — Email + Password form
  - On success → JWT stored in `localStorage`, user name shown in Header
  - Sign-in button in Header changes to user avatar/name after login
- **Logout** — clears token, resets auth state

---

### 🔍 Search & Filter

- Search bar in Header filters videos by **title** in real time (or on submit)
- Category filter buttons filter videos by **category**
- Uploaded videos appear dynamically under the correct category

---

### 🎬 Video Player Page (`/video/:id`)

- Embedded **video player** (HTML5 `<video>` tag or iframe)
- **Title** and **description**
- **Channel name** linked to channel page
- **Like / Dislike buttons** with live counts and toggle behaviour
- **Comment section:**
  - View all comments (username + text + timestamp)
  - Add a comment (requires login)
  - Edit own comment inline
  - Delete own comment

---

### 📺 Channel Page (`/channel/:id`)

- Channel banner and name
- Channel description and subscriber count
- Grid of videos belonging to that channel
- If the logged-in user **owns** the channel:
  - Button to **create / upload** a new video
  - **Edit** button on each video card → opens edit form
  - **Delete** button on each video card → removes with confirmation
- Unauthenticated users see a read-only view
- "Create Channel" button visible only when signed in (if user has no channel)

---

## Routing Overview

```
/                   → Home (video feed)
/login              → Login page
/register           → Register page
/video/:id          → Video Player page
/channel/:id        → Channel page
```

---

## Axios Configuration

All API calls go through `src/api/axiosInstance.js`:

```js
import axios from "axios"

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
})

// Attach JWT to every request automatically
axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem("token")
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})

export default axiosInstance
```

---

## Auth Context

`AuthContext.jsx` provides global auth state:

```jsx
const { user, login, logout, isAuthenticated } = useAuth()
```

- `user` — decoded user object from JWT
- `login(token)` — stores token, updates state
- `logout()` — clears token, resets state
- `isAuthenticated` — boolean

---

## Filter Categories

At least 6 filter buttons must be present:

`All` · `Music` · `Gaming` · `Education` · `Sports` · `Tech` · `News` · `Entertainment`

---

## Responsive Design

| Breakpoint            | Layout                                    |
| --------------------- | ----------------------------------------- |
| Mobile (`< 640px`)    | 1-column grid, sidebar hidden             |
| Tablet (`640–1024px`) | 2-column grid, sidebar collapsible        |
| Desktop (`> 1024px`)  | 4-column grid, sidebar visible by default |

---

## Scripts

```bash
npm run dev        # Start development server (Vite)
npm run build      # Production build
npm run preview    # Preview production build locally
```

---

## Notes for Evaluators

- **CRA is NOT used.** The project is bootstrapped with **Vite**.
- JWT is stored in `localStorage` and automatically attached to all protected API requests via Axios interceptors.
- The sidebar toggles via the hamburger icon in the Header — state managed in `App.jsx` or via Context.
- All forms include client-side validation with visible error messages.
- Uploaded videos are immediately reflected in the Home page feed and appear under their category filter.
