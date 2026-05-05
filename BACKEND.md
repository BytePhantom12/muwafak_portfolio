# FastAPI Backend for Portfolio

## Overview

This is a FastAPI backend for Muwafak Abubakar's portfolio website. It provides REST APIs for:
- Authentication (JWT-based admin login/register)
- Portfolio data management (profile, about, skills, projects, education, experience)
- Contact message handling
- File uploads to Vercel Blob storage

## Project Structure

```
backend/
├── main.py                 # FastAPI app setup with CORS & routers
├── database.py            # Database connection and query execution
├── auth.py                # JWT authentication & password hashing
├── schemas.py             # Pydantic models for request/response validation
├── routes/
│   ├── auth.py           # Authentication endpoints
│   ├── portfolio.py       # Portfolio CRUD endpoints
│   ├── contact.py         # Contact messages endpoints
│   └── upload.py          # File upload endpoints
└── pyproject.toml         # Python dependencies
```

## Database Schema

Uses PostgreSQL (via Neon) with 11 tables:
- **users**: Admin accounts with JWT authentication
- **profiles**: User profile info (name, title, bio, images)
- **about_sections**: About section with highlights
- **contact_info**: Contact details (phone, social links)
- **skills**: Skills grouped by category
- **projects**: Portfolio projects with technologies
- **education**: Educational background
- **experience**: Work experience
- **tech_stack**: Technology stack with icons
- **contact_messages**: Incoming contact form messages
- **uploads**: File upload metadata from Vercel Blob

## Environment Variables

Required for running the backend:

```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
JWT_SECRET_KEY=your-secret-key-for-signing-tokens
BLOB_READ_WRITE_TOKEN=vercel-blob-token
```

In Vercel, these are automatically set when you:
1. Connect a Neon PostgreSQL database
2. Add Vercel Blob storage
3. Set JWT_SECRET_KEY in project variables

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/login` - Login with username/password → returns JWT token
- `POST /auth/register` - Register new admin account → returns JWT token
- `GET /auth/me` - Get current authenticated user

### Portfolio (`/portfolio`)
- `GET /portfolio` - Get all portfolio data (public)
- `PUT /portfolio` - Update entire portfolio (admin only)
- `PUT /portfolio/section/{section}` - Update specific section (admin only)

**Sections**: profile, about, contact, skills, projects, education, experience, techStack

### Contact Messages (`/contact`)
- `POST /contact` - Submit contact form (public)
- `GET /contact` - Get all messages (admin only)
- `GET /contact/{id}` - Get single message (admin only)
- `PATCH /contact/{id}/read` - Mark as read/unread (admin only)
- `PATCH /contact/{id}/reply` - Add reply to message (admin only)
- `DELETE /contact/{id}` - Delete message (admin only)
- `DELETE /contact` - Bulk delete messages (admin only)

### Uploads (`/upload`)
- `POST /upload` - Upload file (multipart form-data) → returns URL
- `DELETE /upload` - Delete file (admin only)

## Dependencies

Core packages:
- **fastapi**: Web framework
- **uvicorn**: ASGI server
- **psycopg**: PostgreSQL driver (async)
- **pydantic**: Data validation
- **python-jose**: JWT handling
- **passlib**: Password hashing with bcrypt
- **python-multipart**: Form data parsing
- **httpx**: HTTP client (for Vercel Blob)

Install with: `pip install -r requirements.txt`

## Running Locally

### Development with Vercel Services
```bash
vercel dev
```
This starts both frontend (Vite) and backend (FastAPI) on `http://localhost:3000`

Frontend calls: `http://localhost:3000/api/*`
Backend runs internally and processes requests

### Standalone Backend (for debugging)
```bash
cd backend
uvicorn main:app --reload --port 8000
```

Update frontend's `VITE_API_URL` to `http://localhost:8000/api` when testing standalone.

## Authentication Flow

1. User submits login/register form
2. Backend validates credentials and creates JWT token
3. Frontend stores token in localStorage as `admin_token`
4. Frontend sends token in `Authorization: Bearer {token}` header for protected routes
5. Backend validates token and checks user permissions

Token expires after 7 days (configurable in `auth.py`).

## File Upload Flow

1. Frontend uploads file via multipart FormData
2. Backend receives file and uploads to Vercel Blob
3. Blob returns public URL
4. Backend stores filename & URL in database
5. Frontend displays image using returned URL

## Deployment

When deploying to Vercel:

1. **Connect Repository**: Push code to GitHub
2. **Set Up Integrations**:
   - Add Neon PostgreSQL database
   - Add Vercel Blob storage
   - Set JWT_SECRET_KEY variable
3. **Configure Services**: `vercel.json` defines both services
4. **Deploy**: Push to main branch or manually deploy from Vercel dashboard

Vercel automatically:
- Installs dependencies from `pyproject.toml`
- Runs FastAPI backend at `/api` prefix
- Serves Vite frontend at `/`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` environment variable is set correctly
- Check Neon project is accessible from Vercel's IP ranges
- Test query: `psql $DATABASE_URL -c "SELECT 1"`

### JWT Token Errors
- Ensure `JWT_SECRET_KEY` is set and consistent
- Token includes expiration time (7 days)
- Clear localStorage and re-login if token issues persist

### File Upload Fails
- Verify `BLOB_READ_WRITE_TOKEN` is set correctly
- Check file size doesn't exceed Blob limits
- Ensure upload endpoint receives multipart/form-data

### CORS Issues
- Backend allows all origins in development (`allow_origins=["*"]`)
- For production, restrict to specific domain in `main.py`

## Testing Endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Get portfolio
curl http://localhost:8000/api/portfolio

# Upload file
curl -X POST http://localhost:8000/api/upload \
  -F "file=@image.jpg" \
  -F "type=profile" \
  -H "Authorization: Bearer {token}"
```

### Using Postman
1. Import FastAPI docs at `/docs` (Swagger UI)
2. Use "Authorize" button to add Bearer token
3. Try out endpoints directly

## API Documentation

FastAPI automatically generates interactive API docs:
- **Swagger UI**: `/docs` - Full endpoint testing interface
- **ReDoc**: `/redoc` - Beautiful alternative documentation

Visit `http://localhost:8000/docs` in development to explore all endpoints with request/response examples.
