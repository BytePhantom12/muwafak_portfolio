# API Reference

Complete reference for all FastAPI backend endpoints.

## Base URL

- **Local Development**: `http://localhost:8000/api`
- **Vercel**: `https://your-domain.vercel.app/api`
- **In Frontend (Vercel)**: `/api` (auto-routed by Vercel services)

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

Get a token by logging in or registering.

## Response Format

All responses are JSON. Errors follow this format:

```json
{
  "detail": "Error message description"
}
```

HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

---

## Authentication Endpoints

### Login
```
POST /auth/login
Content-Type: application/json

Request:
{
  "username": "string",
  "password": "string"
}

Response (200):
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "created_at": "2024-01-01T00:00:00Z"
  }
}

Errors:
401 - Invalid username or password
```

### Register
```
POST /auth/register
Content-Type: application/json

Request:
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}

Response (201):
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "created_at": "2024-01-01T00:00:00Z"
  }
}

Errors:
400 - Username or email already registered
400 - Invalid email format
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response (200):
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "created_at": "2024-01-01T00:00:00Z"
}

Errors:
401 - Invalid or expired token
```

---

## Portfolio Endpoints

### Get Portfolio (Public)
```
GET /portfolio

Response (200):
{
  "profile": {
    "name": "string",
    "title": "string",
    "bio": "string",
    "resume": "url",
    "profileImage": "url",
    "location": "string",
    "languages": "string",
    "email": "string"
  },
  "about": {
    "description": "string",
    "highlights": ["string"]
  },
  "contact": {
    "email": "string",
    "phone": "string",
    "social": {
      "github": "url",
      "linkedin": "url",
      ...
    }
  },
  "skills": [
    {
      "_id": "uuid",
      "category": "string",
      "items": ["string"]
    }
  ],
  "projects": [
    {
      "_id": "uuid",
      "title": "string",
      "description": "string",
      "image": "url",
      "technologies": ["string"],
      "liveUrl": "url",
      "githubUrl": "url",
      "featured": boolean
    }
  ],
  "education": [
    {
      "_id": "uuid",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "description": "string"
    }
  ],
  "experience": [
    {
      "_id": "uuid",
      "company": "string",
      "position": "string",
      "startDate": "date",
      "endDate": "date",
      "isCurrent": boolean,
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "techStack": [
    {
      "_id": "uuid",
      "name": "string",
      "icon": "string",
      "category": "string"
    }
  ]
}
```

### Update Entire Portfolio (Admin)
```
PUT /portfolio
Authorization: Bearer {token}
Content-Type: application/json

Request: (same structure as GET response)

Response (200): (updated portfolio)

Errors:
401 - Unauthorized
400 - Invalid data
```

### Update Portfolio Section (Admin)
```
PUT /portfolio/section/{section}
Authorization: Bearer {token}
Content-Type: application/json

Sections: profile, about, contact, skills, projects, education, experience, techStack

Request (varies by section):
- profile: { name, title, bio, resume_url, profile_image_url, location, languages, email }
- about: { description, highlights: ["string"] }
- contact: { email, phone, social: {} }
- skills: { category, items: ["string"] }
- projects: { title, description, image, technologies, liveUrl, githubUrl, featured }
- education: { institution, degree, field, description }
- experience: { company, position, startDate, endDate, isCurrent, description, technologies }
- techStack: { name, icon, category }

Response (200): { success: true }

Errors:
401 - Unauthorized
404 - Section not found
```

### Create Skill (Admin)
```
POST /portfolio/skills
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "category": "Languages",
  "items": ["Python", "JavaScript", "TypeScript"]
}

Response (201):
{
  "_id": "uuid",
  "category": "Languages",
  "items": ["Python", "JavaScript", "TypeScript"]
}
```

### Update Skill (Admin)
```
PUT /portfolio/skills/{skill_id}
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "category": "Languages",
  "items": ["Python", "JavaScript", "Go"]
}

Response (200): (updated skill)

Errors:
404 - Skill not found
```

### Delete Skill (Admin)
```
DELETE /portfolio/skills/{skill_id}
Authorization: Bearer {token}

Response (200): { success: true }

Errors:
404 - Skill not found
```

### Create Project (Admin)
```
POST /portfolio/projects
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "title": "Project Name",
  "description": "Project description",
  "image": "url",
  "technologies": ["React", "Node.js"],
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/user/repo",
  "featured": true
}

Response (201): (project object)
```

### Update Project (Admin)
```
PUT /portfolio/projects/{project_id}
Authorization: Bearer {token}
Content-Type: application/json

Request: (same as POST)

Response (200): (updated project)

Errors:
404 - Project not found
```

### Delete Project (Admin)
```
DELETE /portfolio/projects/{project_id}
Authorization: Bearer {token}

Response (200): { success: true }

Errors:
404 - Project not found
```

Similar endpoints exist for:
- Education: `GET`, `POST`, `PUT`, `DELETE /portfolio/education/{id}`
- Experience: `GET`, `POST`, `PUT`, `DELETE /portfolio/experience/{id}`
- Tech Stack: `GET`, `POST`, `PUT`, `DELETE /portfolio/tech-stack/{id}`

---

## Contact Messages Endpoints

### Submit Contact Message (Public)
```
POST /contact
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a project..."
}

Response (201):
{
  "_id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "...",
  "isRead": false,
  "reply": null,
  "createdAt": "2024-01-01T00:00:00Z"
}

Errors:
400 - Missing required fields
422 - Invalid email format
```

### Get All Messages (Admin)
```
GET /contact
Authorization: Bearer {token}

Response (200):
[
  {
    "_id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "...",
    "isRead": false,
    "reply": null,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  ...
]

Errors:
401 - Unauthorized
```

### Get Single Message (Admin)
```
GET /contact/{message_id}
Authorization: Bearer {token}

Response (200): (message object)

Errors:
401 - Unauthorized
404 - Message not found
```

### Mark Message as Read/Unread (Admin)
```
PATCH /contact/{message_id}/read
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "is_read": true
}

Response (200): { success: true }

Errors:
401 - Unauthorized
404 - Message not found
```

### Add Reply to Message (Admin)
```
PATCH /contact/{message_id}/reply
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "reply": "Thanks for your message. I'll get back to you soon."
}

Response (200): { success: true }

Errors:
401 - Unauthorized
404 - Message not found
```

### Delete Message (Admin)
```
DELETE /contact/{message_id}
Authorization: Bearer {token}

Response (200): { success: true }

Errors:
401 - Unauthorized
404 - Message not found
```

### Bulk Delete Messages (Admin)
```
DELETE /contact
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "ids": ["uuid1", "uuid2", "uuid3"]
}

Response (200): { success: true, deleted: 3 }

Errors:
401 - Unauthorized
400 - No IDs provided
```

---

## Upload Endpoints

### Upload File (Admin)
```
POST /upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- file: <binary file>
- type: string (profile, project, resume, icon)

Response (200):
{
  "filename": "image-1234.jpg",
  "url": "https://...",
  "size": 102400,
  "type": "image/jpeg"
}

Errors:
401 - Unauthorized
400 - No file provided
413 - File too large
500 - Upload failed
```

### Delete File (Admin)
```
DELETE /upload
Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "url": "https://..."
}

Response (200): { success: true }

Errors:
401 - Unauthorized
400 - No URL provided
500 - Delete failed
```

---

## Health Check

### Check API Status
```
GET /health

Response (200):
{
  "status": "healthy",
  "service": "portfolio-api"
}
```

---

## Example cURL Requests

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### Get Portfolio
```bash
curl http://localhost:8000/api/portfolio
```

### Create Project (with token)
```bash
curl -X POST http://localhost:8000/api/portfolio/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ..." \
  -d '{
    "title":"My Project",
    "description":"Project description",
    "technologies":["React","Node.js"],
    "featured":true
  }'
```

### Submit Contact Message
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name":"John Doe",
    "email":"john@example.com",
    "subject":"Inquiry",
    "message":"I want to hire you!"
  }'
```

### Upload File
```bash
curl -X POST http://localhost:8000/api/upload \
  -H "Authorization: Bearer eyJ..." \
  -F "file=@profile.jpg" \
  -F "type=profile"
```

---

## Data Types

### Dates
- Format: ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)
- Example: `2024-01-15T14:30:00Z`

### UUIDs
- Format: Standard UUID v4
- Example: `550e8400-e29b-41d4-a716-446655440000`

### URLs
- Must start with `http://` or `https://`
- Vercel Blob URLs are public and can be used directly

### File Types
- `profile` - Profile image
- `project` - Project thumbnail/image
- `resume` - Resume PDF
- `icon` - Technology stack icon

---

## Rate Limiting

Currently no rate limiting. In production, consider implementing:
- 100 requests/minute for public endpoints
- 1000 requests/minute for authenticated endpoints
- File uploads: 10 files/minute per user

---

## Pagination

Not yet implemented. All list endpoints return full results. Consider pagination for:
- Contact messages (GET /contact)
- Skills, projects, etc.

---

## Filtering & Sorting

Not yet implemented. Consider adding:
- Filter messages by read/unread status
- Filter projects by featured status
- Sort by date, alphabetical, etc.
