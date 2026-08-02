# Portfolio Backend API

A Node.js/Express backend API for managing portfolio data with MongoDB Atlas and Cloudinary file storage.

## Features

- RESTful API for portfolio data management
- JWT authentication for admin access
- MongoDB Atlas integration
- **Cloudinary integration for file uploads** (images, PDFs, documents)
- CORS enabled for frontend integration
- Environment-based configuration
- Automatic image optimization and CDN delivery

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dua4vifmt
CLOUDINARY_API_KEY=346515697169613
CLOUDINARY_API_SECRET=BgySUE0G_0EGp0xOXLDtSnM_pg0
```

3. Test Cloudinary connection:
```bash
node test-cloudinary.js
```

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Portfolio Routes
- `GET /api/portfolio` - Get portfolio data
- `PUT /api/portfolio` - Update entire portfolio (requires auth)
- `PUT /api/portfolio/section/:section` - Update specific section (requires auth)

### Authentication Routes
- `POST /api/auth/register` - Register new admin user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires auth)

### Upload Routes (Cloudinary)
- `POST /api/upload` - Upload file to Cloudinary (requires auth)
- `DELETE /api/upload/:type/:filename` - Delete file from Cloudinary (requires auth)

#### Upload Example
```javascript
const formData = new FormData();
formData.append('file', fileObject);
formData.append('type', 'image'); // or 'profile', 'project', 'document'

fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

#### Upload Response
```json
{
  "success": true,
  "message": "File uploaded successfully to Cloudinary",
  "data": {
    "url": "https://res.cloudinary.com/dua4vifmt/image/upload/v123/portfolio/images/abc.jpg",
    "filename": "portfolio/images/abc",
    "cloudinary": true
  }
}
```

## Cloudinary Integration

All file uploads are stored on Cloudinary with automatic optimization:

### Features
- ✅ Automatic image compression
- ✅ Format conversion (WebP, AVIF)
- ✅ CDN delivery worldwide
- ✅ Responsive images
- ✅ Max size: 2000x2000px (maintains aspect ratio)

### Supported Files
- **Images:** JPG, JPEG, PNG, GIF, WebP, SVG (max 10MB)
- **Documents:** PDF, DOC, DOCX, ODT, RTF, TXT (max 10MB)

### File Organization
```
portfolio/
├── images/      # General images
├── profile/     # Profile pictures
├── projects/    # Project screenshots
└── documents/   # PDFs, CVs, resumes
```

### Testing
```bash
# Test Cloudinary connection
node test-cloudinary.js

# Test upload endpoint
node test-upload-endpoint.js
```

### Migration
If you have existing local files, migrate them to Cloudinary:
```bash
node migrate-to-cloudinary.js
```

See `CLOUDINARY_SETUP.md` for detailed documentation.

## Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer your_jwt_token
```

## Database Schema

The portfolio data includes:
- Profile information
- About section
- Skills and tech stack
- Education history
- Work experience
- Projects
- Contact information

## Documentation

- **Cloudinary Setup:** `CLOUDINARY_SETUP.md`
- **Quick Start:** `../CLOUDINARY_QUICK_START.md`
- **Migration Guide:** `../CLOUDINARY_MIGRATION_COMPLETE.md`