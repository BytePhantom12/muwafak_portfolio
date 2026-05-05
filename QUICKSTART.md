# Quick Start Guide

## Project Structure

This is a full-stack portfolio application with:
- **Frontend**: React + Vite (with admin dashboard)
- **Backend**: FastAPI with PostgreSQL
- **Deployment**: Vercel (with experimentalServices for multi-language support)

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd muwafak_portfolio
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Environment Variables**
   
   Create `.env.local` in the root directory:
   ```
   DATABASE_URL=postgresql://...  # From Neon
   JWT_SECRET_KEY=your-secret-key
   BLOB_READ_WRITE_TOKEN=...      # From Vercel Blob
   ```

4. **Run Development Server**
   ```bash
   vercel dev
   ```

   This starts:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3000/api` (internal routing)

   Or run services separately:
   ```bash
   # Terminal 1 - Frontend
   cd frontend && npm run dev
   
   # Terminal 2 - Backend
   cd backend && uvicorn main:app --reload --port 8000
   ```
   Update frontend's `VITE_API_URL` to `http://localhost:8000/api`

## Project Pages

### Public Pages
- **Home** (`/`) - Hero section with portfolio overview
- **About** - About section with bio
- **Skills** - Technical skills with categories
- **Projects** - Portfolio projects showcase
- **Contact** - Contact form (saves to database)
- **404** - Not found page

### Admin Pages
- **Admin Login** (`/admin/login`) - JWT-based authentication
- **Admin Dashboard** (`/admin`) - Manage portfolio content
  - Profile Manager - Update name, title, bio, image
  - About Manager - Edit about section
  - Skills Manager - Add/edit skills by category
  - Projects Manager - Add/edit projects
  - Education Manager - Add/edit education
  - Experience Manager - Add/edit work experience
  - Tech Stack Manager - Add/edit technologies
  - Contact Manager - View/reply to contact messages

## Key Features

### Authentication
- Admin login with username/password
- JWT token stored in localStorage
- 7-day token expiration
- Protected routes require valid token

### File Management
- Upload profile images, project images, resume, tech icons
- Files stored in Vercel Blob (public URLs)
- Delete files from backend

### Data Management
- Real-time portfolio updates
- Contact message storage with reply functionality
- Read/unread message tracking
- Bulk operations (delete multiple messages)

### Styling
- Tailwind CSS for responsive design
- Dark mode support
- Smooth animations with Framer Motion
- Custom CSS utilities (glassmorphism, neon effects)

## Database

PostgreSQL with 11 tables. Schema created automatically when you:
1. Add Neon integration to Vercel
2. Run the backend (tables are pre-created via Neon tools)

Key tables:
- `users` - Admin accounts
- `profiles` - Portfolio profile info
- `projects` - Portfolio projects
- `contact_messages` - Contact form submissions
- `skills`, `education`, `experience` - Career info
- `tech_stack` - Technology skills with icons
- `uploads` - File metadata

## API Integration

Frontend communicates with backend via REST API at `/api`:

```javascript
// Frontend calls
const response = await fetch('/api/portfolio')      // Get portfolio
const response = await fetch('/api/auth/login', {   // Login
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})
```

Backend receives requests at `/api/*` prefix (Vercel routing).

## Deployment to Vercel

### Step 1: Connect GitHub Repository
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Create Vercel Project
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Configure project settings

### Step 3: Add Integrations

1. **Database (Neon PostgreSQL)**
   - Settings → Integrations
   - Search "Neon"
   - Create new PostgreSQL database
   - Vercel auto-sets `DATABASE_URL`

2. **File Storage (Vercel Blob)**
   - Settings → Storage
   - Create Blob storage
   - Vercel auto-sets `BLOB_READ_WRITE_TOKEN`

3. **Environment Variables**
   - Settings → Environment Variables
   - Add `JWT_SECRET_KEY=<generate-strong-secret>`
   - Should match your local `.env.local`

### Step 4: Deploy
```bash
git push origin main
```

Vercel automatically:
- Installs dependencies
- Runs database setup
- Deploys both frontend and backend
- Sets up `/api` routing to FastAPI

## Troubleshooting

### Frontend won't connect to backend
- Check `VITE_API_URL` in frontend code (should be `/api` for production)
- Verify vercel.json has correct `routePrefix`
- Check browser console for CORS errors

### Admin login fails
- Verify `JWT_SECRET_KEY` environment variable is set
- Check PostgreSQL connection works: `psql $DATABASE_URL -c "SELECT 1"`
- Ensure user exists in database (create via register endpoint first)

### File uploads fail
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check Vercel Blob storage is created and connected
- Verify file size is within Blob limits

### Database errors
- Check DATABASE_URL is correct
- Verify Neon project is accessible
- Check that tables were created successfully

## Development Tips

### Adding a New Admin Feature
1. Create backend endpoint in `backend/routes/`
2. Add Pydantic schema in `backend/schemas.py`
3. Add React component in `frontend/src/admin/sections/`
4. Update admin dashboard navigation
5. Add API call in `frontend/src/services/api.js`

### Styling Components
- Use Tailwind classes for consistent styling
- Check `frontend/tailwind.config.js` for custom theme
- Custom CSS utilities in `frontend/src/index.css`

### Testing Endpoints
- Use FastAPI docs at `/api/docs` (Swagger UI)
- Or use cURL/Postman (see BACKEND.md for examples)

## Useful Commands

```bash
# Frontend development
cd frontend && npm run dev

# Backend development (standalone)
cd backend && uvicorn main:app --reload

# Both with Vercel
vercel dev

# Build frontend
cd frontend && npm run build

# Build backend (deployment only, auto-handled by Vercel)

# Deploy to Vercel
git push origin main

# Test database connection
psql $DATABASE_URL -c "SELECT version();"
```

## Support & Resources

- **Backend Docs**: See `BACKEND.md` for detailed API documentation
- **Frontend Code**: Check `frontend/src/` for component structure
- **FastAPI Docs**: `/api/docs` for interactive API testing
- **Tailwind Docs**: https://tailwindcss.com
- **Vercel Services**: https://vercel.com/docs/monorepos/vercel-multi-service-deployment

## Next Steps

1. Customize portfolio content via admin dashboard
2. Update styling in Tailwind config
3. Add custom domain in Vercel
4. Set up custom analytics
5. Optimize images for production
