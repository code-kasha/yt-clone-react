# ✅ Frontend Checklist — YouTube Clone

Track every task before submission. Check off each item as it is completed.

---

## 📁 Project Setup

- [✅] Project bootstrapped with **Vite** (NOT Create React App)
- [✅] React 18 installed
- [✅] Tailwind CSS installed and configured (`tailwind.config.js`, `index.css` with directives)
- [✅] React Router v6 installed
- [✅] Axios installed
- [✅] React Icons installed
- [✅] `.env` file created with `VITE_API_URL`
- [✅] `.env.example` committed with placeholder value
- [✅] `.gitignore` includes `node_modules/`, `.env`, `dist/`
- [✅] Folder structure created: `pages/`, `components/`, `context/`, `api/`, `utils/`

---

## 🏠 Home Page

- [✅] Header component rendered at top
- [✅] Logo present in Header
- [✅] Hamburger menu button toggles Sidebar open/closed
- [✅] Sidebar component renders navigation links
- [✅] Sidebar can be toggled (hidden/visible) from hamburger icon
- [✅] Filter bar renders at least **6 category buttons**
- [✅] `All` filter is selected by default and shows all videos
- [✅] Clicking a filter button shows only videos of that category
- [✅] Video grid renders in a responsive layout
- [✅] Each video card shows: Thumbnail, Title, Channel Name, View count
- [✅] Clicking a video card navigates to `/video/:id`
- [✅] Newly uploaded videos appear on the Home page dynamically

---

## 🔐 Authentication

### Register Page (`/register`)

- [ ] Form with Username, Email, and Password fields
- [ ] Inline validation errors shown for:
  - [ ] Empty fields
  - [ ] Invalid email format
  - [ ] Password shorter than 6 characters
  - [ ] Username shorter than 3 characters
- [ ] Successful registration redirects to `/login`
- [ ] Error from API (e.g., email already taken) shown to user

### Login Page (`/login`)

- [ ] Form with Email and Password fields
- [ ] Inline validation errors shown
- [ ] On success: JWT stored in `localStorage`, user state updated
- [ ] On success: redirect to Home page
- [ ] Error from API shown to user (wrong credentials, etc.)

### Header Auth State

- [ ] **Before login**: "Sign In" button visible in Header
- [ ] "Sign In" button navigates to `/login`
- [ ] **After login**: Username or avatar shown in Header (Sign In button hidden)
- [ ] Logout option available (clears token, resets state, returns to Home)

### Auth Context

- [ ] `AuthContext.jsx` created
- [ ] `user`, `login()`, `logout()`, `isAuthenticated` provided
- [ ] JWT decoded on app load if token already in `localStorage`

---

## 🔍 Search & Filter

- [ ] Search bar present in Header
- [ ] Typing in search bar filters the video grid by **title** (case-insensitive)
- [ ] Search clears when input is emptied
- [ ] At least 6 category filter buttons on Home page
- [ ] Clicking a category filters videos by that category
- [ ] `All` button resets filter and shows all videos
- [ ] Search and category filter can work together

---

## 🎬 Video Player Page (`/video/:id`)

- [ ] Page loads correct video based on URL param
- [ ] Video player renders (HTML5 `<video>` or iframe)
- [ ] Video title displayed
- [ ] Video description displayed
- [ ] Channel name displayed (linked to `/channel/:id`)
- [ ] View count increments on page load
- [ ] **Like button** — shows count, toggles liked state (requires login)
- [ ] **Dislike button** — shows count, toggles disliked state (requires login)
- [ ] Like and Dislike are mutually exclusive (liking removes dislike)

### Comment Section

- [ ] All comments displayed with: username, text, timestamp
- [ ] Comments load from API on page mount
- [ ] **Add comment** — textarea + submit button (requires login)
- [ ] New comment appears immediately after submission (optimistic or re-fetch)
- [ ] **Edit comment** — edit button visible only on own comments
  - [ ] Inline edit form or modal
  - [ ] Save updates comment in DB and UI
- [ ] **Delete comment** — delete button visible only on own comments
  - [ ] Confirmation before deletion
  - [ ] Comment removed from UI after deletion

---

## 📺 Channel Page (`/channel/:id`)

- [ ] Channel banner image displayed
- [ ] Channel name displayed
- [ ] Channel description displayed
- [ ] Subscriber count displayed
- [ ] Grid of videos belonging to this channel
- [ ] Clicking a video navigates to Video Player page

### Owner-only actions (visible only when logged-in user owns the channel)

- [ ] "Upload Video" / "Create Video" button visible
  - [ ] Form with: Title, Description, Video URL, Thumbnail URL, Category
  - [ ] New video saved to DB and appears in grid
- [ ] **Edit** button on each video card
  - [ ] Opens pre-filled edit form
  - [ ] Changes saved to DB and reflected in UI
- [ ] **Delete** button on each video card
  - [ ] Confirmation dialog
  - [ ] Video removed from DB and grid

### Create Channel

- [ ] "Create Channel" option visible only when user is signed in
- [ ] Channel creation form: Channel Name, Description, Banner URL
- [ ] After creation, user is directed to their new channel page

---

## 🧩 Components

- [ ] `Header.jsx` — logo, search bar, hamburger, auth state
- [ ] `Sidebar.jsx` — nav links, toggle behaviour
- [ ] `FilterBar.jsx` — 6+ category buttons
- [ ] `VideoCard.jsx` — thumbnail, title, channel, views
- [ ] `VideoGrid.jsx` — responsive grid layout
- [ ] `CommentSection.jsx` — list + add comment
- [ ] `CommentCard.jsx` — single comment with edit/delete

---

## 🌐 API Integration

- [ ] `axiosInstance.js` created with `baseURL` from env
- [ ] JWT automatically attached to requests via Axios interceptor
- [ ] All API calls use `axiosInstance` (not raw `fetch`)
- [ ] Loading states shown during API calls
- [ ] Error states handled and displayed to user

---

## 📱 Responsive Design

- [ ] Mobile layout (< 640px): 1-column grid, sidebar hidden by default
- [ ] Tablet layout (640–1024px): 2-column grid, sidebar collapsible
- [ ] Desktop layout (> 1024px): 4-column grid, sidebar visible
- [ ] Header is responsive (search bar collapses on small screens)
- [ ] Video Player page readable on mobile
- [ ] Channel Page readable on mobile
- [ ] Comment section usable on mobile
- [ ] No horizontal overflow on any page

---

## 🧪 Testing & Quality

- [ ] All pages load without console errors
- [ ] Auth flow tested end-to-end (register → login → use features → logout)
- [ ] Search tested with multiple queries
- [ ] All 6+ filters tested
- [ ] Like/Dislike toggle works correctly
- [ ] Comment CRUD tested (add, edit, delete)
- [ ] Video CRUD on Channel page tested
- [ ] Responsive layout tested on mobile, tablet, and desktop

---

## 📝 Code Quality

- [ ] ES Module syntax (`import`/`export`) used throughout
- [ ] No direct DOM manipulation (no `document.getElementById`)
- [ ] No inline styles (use Tailwind classes)
- [ ] Components are single-responsibility
- [ ] Props are passed cleanly (no prop drilling beyond 2 levels — use Context if needed)
- [ ] Consistent file naming (`PascalCase` for components, `camelCase` for utils)

---

## 📦 Git & Submission

- [ ] Repository has at least **15 frontend commits**
- [ ] Commits are atomic and descriptive (e.g., `feat: add video player page`)
- [ ] `node_modules/` is in `.gitignore` and NOT pushed
- [ ] `.env` is NOT pushed to GitHub
- [ ] Production build tested with `npm run build`
- [ ] Frontend README is complete and accurate
