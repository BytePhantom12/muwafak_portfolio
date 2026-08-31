# Portfolio

A full-stack personal portfolio and content management system built to showcase work in **Data Analysis** and **Backend Development**, with Full-Stack Development as an additional capability. A React frontend renders the public site and an admin panel; an Express API backed by MongoDB is the sole source of truth for all portfolio content.

## Features

- Dynamic, MongoDB-driven portfolio content (no static/sample data)
- JWT-protected admin CMS at `/admin`
- Project management with category filtering (Data Analytics / Backend / Full Stack)
- Skills management grouped by category
- Experience and education management
- Certifications management
- Contact form with message persistence and an admin inbox
- Cloudinary-backed media uploads (images, project screenshots, CV/resume)
- CV/resume download endpoint
- Responsive, mobile-first interface
- Reduced-motion-aware animations (Framer Motion, respects `prefers-reduced-motion`)
- Interactive API documentation via Swagger UI

## Portfolio Sections

The public site (`/`) renders, in order: **Hero → About → Experience & Education → Skills → Projects → Certifications → Contact**.

Skills are grouped into:

- Data Analysis
- Web Development
- Databases
- Tools & Deployment

Projects are categorized into:

- Data Analytics
- Backend
- Full Stack

## Tech Stack

### Frontend
React 18, Vite, JavaScript, Tailwind CSS, Framer Motion, React Router, react-icons, lucide-react

### Backend
Node.js, Express, Mongoose, JWT (jsonwebtoken), bcryptjs, Multer, Swagger (swagger-jsdoc / swagger-ui-express)

### Database
MongoDB (via Mongoose)

### Media / Storage
Cloudinary

### Deployment
Vercel (separate frontend and backend deployments, each with its own `vercel.json`)

## Project Architecture

```text
frontend/
  src/
    admin/
      sections/    # Profile, About, Skills, Education, Experience, Projects, Certifications, Contact managers
      AdminApp.jsx
      Dashboard.jsx
      Login.jsx
    components/    # Hero, About, Skills, Projects, Journey, Certifications, Contact, Footer, Navbar, ...
    context/        # PortfolioContext (data fetching/state)
    services/       # API client
    utils/          # Skill/project category and icon utilities
    App.jsx

backend/
  config/          # Database and Cloudinary configuration
  middleware/      # Auth and rate-limiting middleware
  models/          # Portfolio, User, ContactMessage (Mongoose schemas)
  routes/          # portfolio, auth, contact, upload
  scripts/         # Maintenance/diagnostic scripts (Cloudinary test, integration test, repair utilities)
  server.js
```

## Data Architecture

MongoDB is the **only** source of truth for portfolio content — there is no seed file or sample-data fallback.

```text
MongoDB → Express API → PortfolioContext → React components   (public site)
/admin  → Express API → MongoDB                                 (content editing)
```

- Public content is fetched via `GET /api/portfolio`.
- Admin changes are written directly to MongoDB through the API.
- Missing fields are handled safely — `usePortfolioData`/`PortfolioContext` fall back to empty strings/arrays rather than breaking rendering.
- If no Portfolio document exists yet, the backend creates a single **empty** document rather than seeding fake/sample content; real content is then entered through `/admin`.

## Admin Dashboard

`/admin` (JWT-authenticated) manages:

- Profile and About content
- Skills
- Education
- Experience
- Projects
- Certifications
- Contact messages (inbox)

Sign-in is required for every write operation. The first admin account is created via `POST /api/auth/register`; set `REGISTRATION_SECRET` afterward to restrict further registrations.

## API

| Group | Base path | Notes |
| --- | --- | --- |
| Portfolio | `/api/portfolio` | Public `GET`; admin `PUT`/section updates and project CRUD; CV download route |
| Auth | `/api/auth` | Register, login, current user, logout (JWT) |
| Contact | `/api/contact` | Public message submission; admin inbox read/reply/delete |
| Upload | `/api/upload` | Admin-only Cloudinary upload/delete |

Full interactive API reference: **Swagger UI at `/docs`** on the running backend.

## Local Development

### Prerequisites

- Node.js 18+
- A MongoDB database
- A Cloudinary account

### Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

`backend/.env` (values are placeholders):

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/portfolio
MONGODB_DB_NAME=portfolio
JWT_SECRET=your_jwt_secret
ADMIN_SESSION_DURATION=86400000
REGISTRATION_SECRET=optional_secret_for_creating_additional_admins
ALLOWED_ORIGINS=https://your-frontend-domain.example
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:5000
```

Local addresses:

- Portfolio: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`
- Backend API: `http://localhost:5000`
- API docs: `http://localhost:5000/docs`

## Running Locally

### Frontend (`frontend/`)

```bash
npm run dev      # Start the Vite dev server
npm run preview  # Preview a production build
```

### Backend (`backend/`)

```bash
npm run dev               # Start with nodemon
npm start                 # Start with Node.js
npm run test:mongodb      # Test the database connection
npm run test:cloudinary   # Test Cloudinary configuration
npm run test:integration  # Run API integration checks (requires an empty test database)
```

## Build / Validation

```bash
cd frontend
npm run lint
npm run build
```

## Deployment

- **Frontend:** deployed to Vercel as a static SPA build (`frontend/vercel.json` rewrites all routes to `index.html`).
- **Backend:** deployed to Vercel as a serverless Node function (`backend/vercel.json` routes all requests to `server.js`).
- **Database:** MongoDB (connection configured via `MONGODB_URI`).
- **Media:** Cloudinary, for all uploaded images and CV/resume files.

Set the frontend's `VITE_API_URL` to the deployed backend URL, and add the deployed frontend origin to the backend's `ALLOWED_ORIGINS`.

## Current Focus

This portfolio emphasizes Data Analysis and Backend Development, with Full-Stack Development as a supporting capability.
