# Muwafak Abubakar — Portfolio

A full-stack developer portfolio with a responsive public website and a protected admin panel for managing portfolio content. The React frontend consumes an Express REST API, MongoDB stores portfolio data, and Cloudinary handles images and documents.

## Features

- Responsive single-page portfolio
- Profile, about, skills, projects, experience, education, and contact sections
- JWT-protected admin panel at `/admin`
- Project and portfolio content management
- Image, project screenshot, and CV uploads through Cloudinary
- Contact-form message management
- MongoDB persistence with Mongoose
- Interactive API documentation with Swagger UI
- Vercel-ready frontend and backend configuration

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend | Node.js, Express, Mongoose, JWT |
| Database | MongoDB Atlas |
| Media | Cloudinary |
| Deployment | Vercel |

## Project structure

```text
muwafak_portfolio/
├── frontend/          # Public portfolio and admin panel
│   ├── public/        # Static assets
│   └── src/
│       ├── admin/     # Admin dashboard and content managers
│       ├── components/# Public-facing UI components
│       ├── context/   # Portfolio data state
│       └── services/  # API client
├── backend/           # Express API
│   ├── config/        # Database and service configuration
│   ├── middleware/    # Authentication middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   └── scripts/       # Seed, repair, and integration scripts
├── shared/            # Shared seed data
└── vercel.json        # Deployment routing
```

## Local development

### Prerequisites

- Node.js 18 or newer
- A MongoDB database
- A Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/BytePhantom12/muwafak_portfolio.git
cd muwafak_portfolio
```

### 2. Configure and run the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, copy the environment template with:

```powershell
Copy-Item .env.example .env
```

Set these values in `backend/.env`:

```dotenv
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=portfolio
JWT_SECRET=your_strong_random_secret
ADMIN_SESSION_DURATION=86400000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Optional variables include `REGISTRATION_SECRET` for creating additional admins and `ALLOWED_ORIGINS` for extra frontend origins.

### 3. Configure and run the frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The default local addresses are:

- Portfolio: `http://localhost:5173`
- Admin panel: `http://localhost:5173/admin`
- Backend API: `http://localhost:5000`
- API documentation: `http://localhost:5000/docs`

## Admin setup

The first admin account can be created through the authentication registration endpoint. After the initial account exists, protect further registration by configuring `REGISTRATION_SECRET`.

Sign in at `/admin` to manage portfolio sections, upload media, and review contact messages. Never commit admin credentials, JWT secrets, database connection strings, or Cloudinary secrets.

## Useful commands

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

### Backend

```bash
npm run dev               # Start with nodemon
npm start                 # Start with Node.js
npm run seed              # Seed portfolio data
npm run test:mongodb      # Test the database connection
npm run test:cloudinary   # Test Cloudinary configuration
npm run test:integration  # Run API integration checks
```

## API overview

| Method and route | Purpose | Authentication |
| --- | --- | --- |
| `GET /api/portfolio` | Retrieve portfolio content | No |
| `PUT /api/portfolio/section/:section` | Update a portfolio section | Admin |
| `POST /api/portfolio/projects` | Create a project | Admin |
| `PUT /api/portfolio/projects/:id` | Update a project | Admin |
| `DELETE /api/portfolio/projects/:id` | Delete a project | Admin |
| `POST /api/auth/login` | Sign in | No |
| `GET /api/auth/me` | Retrieve the active admin | Admin |
| `POST /api/upload` | Upload media | Admin |

See the running Swagger documentation at `/docs` for the complete API reference.

## Deployment

The repository includes Vercel configuration for both applications. Configure the backend environment variables in the deployment platform, set `VITE_API_URL` to the deployed API URL for the frontend, and add the frontend domain to `ALLOWED_ORIGINS` when required.

## License

This project is maintained as Muwafak Abubakar's personal portfolio. Contact the repository owner before reusing its personal content or branding.
