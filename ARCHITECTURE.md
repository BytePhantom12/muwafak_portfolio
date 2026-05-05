# Architecture Overview

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              React + Vite Frontend (Port 3000)                 │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Public Pages                                          │   │  │
│  │  │ - Home (Hero)                                         │   │  │
│  │  │ - About                                               │   │  │
│  │  │ - Skills                                              │   │  │
│  │  │ - Projects                                            │   │  │
│  │  │ - Contact (form)                                      │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Admin Dashboard (Auth Protected)                     │   │  │
│  │  │ - Login                                              │   │  │
│  │  │ - Profile Manager                                   │   │  │
│  │  │ - Skills Manager                                    │   │  │
│  │  │ - Projects Manager                                  │   │  │
│  │  │ - Education Manager                                 │   │  │
│  │  │ - Experience Manager                                │   │  │
│  │  │ - Tech Stack Manager                                │   │  │
│  │  │ - Contact Messages (view, reply, delete)           │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ API Service Layer (api.js)                           │   │  │
│  │  │ - Base URL: /api                                     │   │  │
│  │  │ - Token Management (localStorage)                   │   │  │
│  │  │ - Request/Response Handling                         │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
                              ▲
                              │
                    HTTP(S) Requests/Responses
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      VERCEL DEPLOYMENT                               │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              Vercel Services (Multi-Service)                   │  │
│  │                                                                │  │
│  │  Route / ──────────────→ Frontend (Vite Build)               │  │
│  │  Route /api ────────────→ Backend (FastAPI)                  │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              ▲                                        │
│                              │                                        │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │              FastAPI Backend (Port 8000 internal)              │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Route Modules                                         │   │  │
│  │  │ - /auth → Login, Register, Get Current User          │   │  │
│  │  │ - /portfolio → CRUD for all portfolio sections       │   │  │
│  │  │ - /contact → Messages CRUD, replies, bulk ops       │   │  │
│  │  │ - /upload → File upload/delete to Blob              │   │  │
│  │  │ - /health → API status check                        │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Core Modules                                          │   │  │
│  │  │ - auth.py → JWT creation, password hashing          │   │  │
│  │  │ - database.py → SQL query execution                 │   │  │
│  │  │ - schemas.py → Pydantic validation models           │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  │  ┌───────────────────────────────────────────────────────┐   │  │
│  │  │ Security                                              │   │  │
│  │  │ - HTTP Bearer Token Validation                       │   │  │
│  │  │ - CORS Middleware (allow all in dev, restrict prod) │   │  │
│  │  │ - Password Hashing (bcrypt)                          │   │  │
│  │  │ - Protected Routes (@depends get_current_user)      │   │  │
│  │  └───────────────────────────────────────────────────────┘   │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                              ▲                                        │
│                              │                                        │
│      ┌───────────────────────┼────────────────────────┐             │
│      │                       │                        │             │
│      ▼                       ▼                        ▼             │
│  ┌────────────┐        ┌──────────────┐      ┌──────────────┐     │
│  │ Neon DB    │        │ Vercel Blob  │      │   .env vars  │     │
│  │ PostgreSQL │        │   Storage    │      │              │     │
│  ├────────────┤        ├──────────────┤      ├──────────────┤     │
│  │ 11 Tables  │        │ Public URLs  │      │ JWT_SECRET   │     │
│  │ - users    │        │ for files    │      │ DATABASE_URL │     │
│  │ - profiles │        │              │      │ BLOB_TOKEN   │     │
│  │ - projects │        │ Images       │      │              │     │
│  │ - messages │        │ PDFs         │      │              │     │
│  │ - skills   │        │ Icons        │      │              │     │
│  │ - etc.     │        │              │      │              │     │
│  └────────────┘        └──────────────┘      └──────────────┘     │
│                                                                     │
└──────────────────────────────────────────────────────────────────────┘
```

## Request Flow

### Public Portfolio Request

```
User Browser
    │
    ├─→ GET /
    │   └─→ Frontend loads
    │
    └─→ Fetch /api/portfolio
        ├─→ Vercel routes to FastAPI
        │
        ├─→ Backend processes:
        │   ├─→ Query users table
        │   ├─→ Query profiles table
        │   ├─→ Query skills table
        │   ├─→ Query projects table
        │   ├─→ Query education table
        │   ├─→ Query experience table
        │   └─→ Query tech_stack table
        │
        ├─→ Format response
        │
        └─→ Return JSON with portfolio data
            └─→ Frontend renders portfolio
```

### Admin Authentication Flow

```
Admin User
    │
    ├─→ Navigates to /admin/login
    │
    ├─→ Submits login form
    │   └─→ POST /api/auth/login
    │
    ├─→ Backend:
    │   ├─→ Query users table
    │   ├─→ Compare password with bcrypt hash
    │   ├─→ Create JWT token with user ID
    │   └─→ Return token + user info
    │
    ├─→ Frontend stores token in localStorage
    │
    └─→ Frontend redirects to /admin
        ├─→ User can now make authenticated requests
        │   └─→ Authorization: Bearer {token}
        │
        └─→ Backend validates token for protected routes
            ├─→ Decode JWT
            ├─→ Extract user ID
            ├─→ Verify user exists in DB
            └─→ Process request if valid
```

### File Upload Flow

```
Admin User
    │
    ├─→ Selects image in Profile Manager
    │
    ├─→ Frontend creates FormData
    │   └─→ POST /api/upload
    │       ├─→ file: <binary>
    │       ├─→ type: "profile"
    │       └─→ Authorization: Bearer {token}
    │
    ├─→ Backend:
    │   ├─→ Validate token (protected route)
    │   ├─→ Upload file to Vercel Blob
    │   ├─→ Get public URL from Blob
    │   ├─→ Store metadata in uploads table
    │   └─→ Return URL + filename
    │
    ├─→ Frontend stores URL
    │
    ├─→ Admin updates profile
    │   └─→ PUT /api/portfolio/section/profile
    │       └─→ { profile_image_url: "https://..." }
    │
    └─→ Backend updates profiles table
        └─→ Image now displays on public portfolio
```

### Contact Message Flow

```
Visitor
    │
    ├─→ Fills contact form on website
    │   └─→ Name, Email, Subject, Message
    │
    ├─→ Clicks Submit
    │   └─→ POST /api/contact (no auth needed)
    │
    ├─→ Backend:
    │   ├─→ Validate email format
    │   ├─→ Insert into contact_messages table
    │   └─→ Return confirmation
    │
    └─→ Frontend shows success message
        └─→ Message saved in database

---

Admin User
    │
    ├─→ Navigates to /admin/contact
    │
    ├─→ Frontend fetches messages
    │   └─→ GET /api/contact (with token)
    │
    ├─→ Backend:
    │   ├─→ Validate token
    │   ├─→ Query contact_messages table
    │   └─→ Return all messages
    │
    ├─→ Frontend displays inbox
    │
    ├─→ Admin clicks on message
    │
    ├─→ Admin types reply
    │
    ├─→ Admin sends reply
    │   └─→ PATCH /api/contact/{id}/reply
    │       └─→ { reply: "Thanks for reaching out..." }
    │
    └─→ Backend updates message in DB
        └─→ Message marked with reply
```

## Database Schema Relationships

```
users (1)
    │
    ├─→ (1 to 1) profiles
    │             │
    │             ├─→ name, title, bio
    │             ├─→ profile_image_url
    │             ├─→ resume_url
    │             └─→ email, location, languages
    │
    ├─→ (1 to 1) about_sections
    │             ├─→ description
    │             └─→ highlights (JSONB array)
    │
    ├─→ (1 to 1) contact_info
    │             ├─→ phone
    │             └─→ social_links (JSONB object)
    │
    ├─→ (1 to many) skills
    │             ├─→ category
    │             ├─→ items (JSONB array)
    │             └─→ sort_order
    │
    ├─→ (1 to many) projects
    │             ├─→ title, description
    │             ├─→ image_url
    │             ├─→ technologies (JSONB array)
    │             ├─→ live_url, github_url
    │             ├─→ featured, sort_order
    │             └─→ timestamps
    │
    ├─→ (1 to many) education
    │             ├─→ institution, degree, field
    │             ├─→ description, sort_order
    │             └─→ timestamps
    │
    ├─→ (1 to many) experience
    │             ├─→ company, position
    │             ├─→ start_date, end_date
    │             ├─→ is_current
    │             ├─→ description
    │             ├─→ technologies (JSONB array)
    │             ├─→ sort_order
    │             └─→ timestamps
    │
    ├─→ (1 to many) tech_stack
    │             ├─→ name, icon, category
    │             ├─→ sort_order
    │             └─→ timestamps
    │
    └─→ (1 to many) uploads
                  ├─→ filename, original_filename
                  ├─→ file_type, blob_url
                  ├─→ file_size
                  └─→ created_at

contact_messages (independent)
    ├─→ name, email, subject, message
    ├─→ is_read (boolean)
    ├─→ reply (optional text)
    └─→ timestamps
```

## Deployment Architecture

```
GitHub Repository
    │
    └─→ Push to main branch
        │
        ├─→ Vercel receives webhook
        │
        └─→ Vercel Deploy Process:
            ├─→ Clone repository
            │
            ├─→ Install Frontend Dependencies
            │   ├─→ Read frontend/package.json
            │   ├─→ npm install
            │   └─→ npm run build
            │
            ├─→ Install Backend Dependencies
            │   ├─→ Read backend/pyproject.toml
            │   ├─→ pip install from pyproject.toml
            │   └─→ Ready for uvicorn
            │
            ├─→ Set Environment Variables
            │   ├─→ DATABASE_URL (from Neon)
            │   ├─→ BLOB_READ_WRITE_TOKEN (from Blob)
            │   └─→ JWT_SECRET_KEY (user provided)
            │
            ├─→ Start Services (vercel.json)
            │   ├─→ Frontend service: Vite on port 3000
            │   └─→ Backend service: uvicorn on port 8000
            │
            ├─→ Route Traffic
            │   ├─→ GET / → Frontend
            │   └─→ GET /api/* → Backend
            │
            └─→ Deployment Complete
                └─→ Available at https://your-domain.vercel.app
```

## Data Flow Diagram

```
User Input
    │
    ├─→ Frontend Component
    │   ├─→ React State
    │   └─→ Form Validation
    │
    └─→ API Service (api.js)
        ├─→ Prepare Request
        │   ├─→ Build URL with /api prefix
        │   ├─→ Add headers (Content-Type, Auth token)
        │   ├─→ Serialize body (JSON/FormData)
        │   └─→ Make HTTP request
        │
        └─→ Vercel Services Routing
            ├─→ Route to FastAPI (/api prefix)
            │
            └─→ FastAPI Request Handling
                ├─→ Parse request
                ├─→ Validate with Pydantic schemas
                ├─→ Check authentication (if needed)
                ├─→ Execute business logic
                │   └─→ Database queries
                ├─→ Format response
                └─→ Return JSON
                    │
                    └─→ Frontend receives response
                        ├─→ Store in React state
                        ├─→ Update UI
                        └─→ Show to user
```

## Security Layers

```
┌─────────────────────────────────────────────┐
│         Request from Browser                 │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 1: HTTPS/TLS (automatic with Vercel)│
│           Encrypts data in transit          │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 2: CORS Middleware                   │
│           Validates request origin          │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 3: Bearer Token Validation           │
│           Checks JWT authenticity           │
│           (for protected routes)            │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 4: Pydantic Validation               │
│           Validates request data types      │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 5: Authorization Check               │
│           Verifies user has permission      │
│           (for admin routes)                │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 6: Database Access                   │
│           Parameterized queries             │
│           (prevent SQL injection)           │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  Layer 7: Password Security                 │
│           Bcrypt hashing                    │
│           (stored in database)              │
│                                              │
└─────────────────────────────────────────────┘
```

## Technology Integration Points

```
Frontend                Backend              Database            Storage
─────────────────────────────────────────────────────────────────────────

React ─HTTP─→ FastAPI
              CORS
              Routing
              
              JWT Auth ─┐
              Pydantic  │
              Validation│
                        │
                     psycopg ─SQL─→ PostgreSQL (Neon)
                     Connection    Query Execution
                     Manager       Transaction Management
                                   JSONB Storage
                     
                     httpx ───────→ Vercel Blob
                     Upload        File Storage
                     Service       Public URLs
```

## Performance Considerations

```
Optimization Strategies:

1. Frontend
   - Vite builds optimized bundle
   - CSS/JS minification
   - Image lazy loading
   - React component memoization

2. Backend
   - Connection pooling (psycopg)
   - Query optimization
   - Response caching (consider Redis)
   - Async I/O where possible

3. Database
   - Indexes on frequently queried columns
   - JSONB for flexible data
   - Connection limits in Vercel

4. Storage
   - Vercel Blob CDN for file delivery
   - Public URLs bypass auth layer
   - Image compression/resizing

5. Deployment
   - Vercel edge caching
   - Database connection pooling
   - Service auto-scaling
```

This architecture provides a scalable, secure, and maintainable platform for your portfolio website.
