# Deployment Checklist

Complete this checklist to successfully deploy the portfolio platform to Vercel.

## Pre-Deployment Setup

### Local Environment
- [ ] Node.js 18+ installed
- [ ] Python 3.11+ installed
- [ ] Git configured with GitHub account
- [ ] Project cloned and dependencies installed
- [ ] Verified local development works with `vercel dev`

### Code Quality
- [ ] All code committed to git
- [ ] No console errors in browser dev tools
- [ ] Admin dashboard tested locally
- [ ] Contact form tested locally
- [ ] File upload tested locally
- [ ] All API endpoints respond correctly

### GitHub Repository
- [ ] Repository created on GitHub
- [ ] Code pushed to GitHub (main branch)
- [ ] Repository is public or access granted to Vercel
- [ ] Branch protection enabled (if desired)

## Vercel Project Setup

### Create Vercel Project
- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Select framework: "Other" (multi-service)
- [ ] Project name: `muwafak-portfolio` (or similar)
- [ ] Root directory: `./` (default)
- [ ] Click "Create"

### Verify vercel.json
- [ ] Open `vercel.json` in your project
- [ ] Confirm structure:
  ```json
  {
    "experimentalServices": {
      "frontend": {
        "entrypoint": "frontend",
        "routePrefix": "/"
      },
      "backend": {
        "entrypoint": "backend/main.py",
        "routePrefix": "/api"
      }
    }
  }
  ```
- [ ] Save and push to GitHub if modified

## Database Integration

### Add Neon PostgreSQL
- [ ] Go to Vercel project Settings
- [ ] Click "Storage" → "Create Database"
- [ ] Select "PostgreSQL"
- [ ] Click "Continue with Neon"
- [ ] Create Neon account (if needed) or sign in
- [ ] Create new PostgreSQL database
- [ ] Verify connection works
- [ ] Confirm `DATABASE_URL` environment variable is automatically set

### Create Database Tables
- [ ] Verify `DATABASE_URL` is set in Environment Variables
- [ ] Database tables should be created automatically on first backend run
- [ ] You can verify tables by connecting to Neon:
  ```bash
  psql $DATABASE_URL -c "\dt"
  ```
- [ ] All 11 tables should be listed

### Test Database Connection
- [ ] Visit `https://your-project.vercel.app/api/health`
- [ ] Should return: `{"status":"healthy","service":"portfolio-api"}`
- [ ] If fails, check DATABASE_URL in env vars

## File Storage Integration

### Add Vercel Blob Storage
- [ ] Go to Vercel project Settings
- [ ] Click "Storage" → "Create Store"
- [ ] Select "Blob"
- [ ] Name it something like `portfolio-files`
- [ ] Click "Create"
- [ ] Confirm `BLOB_READ_WRITE_TOKEN` environment variable is automatically set

### Test Blob Connection
- [ ] Login to admin dashboard
- [ ] Navigate to Profile Manager
- [ ] Try uploading a profile image
- [ ] If successful, Blob is configured correctly

## Environment Variables

### Add Required Variables
- [ ] Go to Settings → Environment Variables
- [ ] Add `JWT_SECRET_KEY`:
  - [ ] Generate a strong random string (32+ characters)
  - [ ] Recommended: Use `openssl rand -hex 32`
  - [ ] Key: `JWT_SECRET_KEY`
  - [ ] Value: Your generated secret
  - [ ] Development environment: checked
  - [ ] Preview environment: checked
  - [ ] Production environment: checked
  - [ ] Click "Save"

### Verify All Variables
- [ ] Check Environment Variables section shows:
  - [ ] `DATABASE_URL` (from Neon)
  - [ ] `BLOB_READ_WRITE_TOKEN` (from Blob)
  - [ ] `JWT_SECRET_KEY` (manually added)
- [ ] No missing variables

## Deployment

### Initial Deployment
- [ ] Push code to main branch:
  ```bash
  git push origin main
  ```
- [ ] Go to Vercel project Deployments tab
- [ ] Wait for deployment to complete (5-15 minutes)
- [ ] Check deployment logs for errors:
  - [ ] No Python import errors
  - [ ] No Node.js build errors
  - [ ] Both services started successfully

### Fix Deployment Issues
If deployment fails:
- [ ] Click on failed deployment to see logs
- [ ] Search for error messages
- [ ] Common issues:
  - [ ] Missing `vercel.json` - ensure it's in root
  - [ ] Missing `pyproject.toml` - ensure it's in backend/
  - [ ] Environment variables - verify all 3 are set
  - [ ] Python syntax errors - check code for typos

## Post-Deployment Testing

### Test Frontend
- [ ] Visit https://your-project.vercel.app
- [ ] Verify home page loads
- [ ] Check all sections render (About, Skills, Projects, etc.)
- [ ] Verify responsive design works on mobile
- [ ] Click navigation links
- [ ] Verify smooth scroll animations

### Test Public Features
- [ ] View portfolio pages
- [ ] Submit contact form:
  - [ ] Fill in all fields
  - [ ] Click submit
  - [ ] See success message
- [ ] Verify no console errors

### Test Admin Dashboard
- [ ] Navigate to https://your-project.vercel.app/admin
- [ ] Click "Register" to create admin account
  - [ ] Username: `admin`
  - [ ] Email: Your email
  - [ ] Password: Strong password
- [ ] Login with credentials
- [ ] Verify dashboard loads

### Test Admin Features
- [ ] **Profile Manager**:
  - [ ] Edit profile info
  - [ ] Upload profile image
  - [ ] Save changes
- [ ] **Skills Manager**:
  - [ ] Add new skill category
  - [ ] Add skills to category
  - [ ] Delete skill
- [ ] **Projects Manager**:
  - [ ] Add new project
  - [ ] Upload project image
  - [ ] Save project
- [ ] **Contact Manager**:
  - [ ] View contact messages (submit one if none exist)
  - [ ] Mark message as read/unread
  - [ ] Add reply
- [ ] **Other Managers**:
  - [ ] Test Education, Experience, TechStack managers

### Test API Endpoints
- [ ] Visit https://your-project.vercel.app/api/docs
- [ ] Verify Swagger UI loads
- [ ] Click on `/portfolio` endpoint
- [ ] Click "Try it out"
- [ ] Click "Execute"
- [ ] Verify you get portfolio data response

### Test File Upload
- [ ] In Profile Manager, upload image
- [ ] Verify it displays after saving
- [ ] Image URL should be public (from Vercel Blob)

### Test Message Handling
- [ ] Submit contact form from home page
- [ ] Login to admin dashboard
- [ ] Go to Contact Manager
- [ ] Verify message appears
- [ ] Add reply to message
- [ ] Mark as read/unread

## Production Verification

### Performance
- [ ] Frontend loads in < 3 seconds
- [ ] API responses complete in < 1 second
- [ ] Image uploads succeed
- [ ] No console errors

### Security
- [ ] Admin login requires credentials
- [ ] Protected routes return 401 without token
- [ ] File uploads require authentication
- [ ] Contact form works publicly (no auth)
- [ ] JWT token in localStorage

### Data Integrity
- [ ] All admin edits persist
- [ ] File URLs remain accessible
- [ ] Contact messages save correctly
- [ ] No data loss after page refresh

### Error Handling
- [ ] Network errors show user-friendly messages
- [ ] Invalid login shows error
- [ ] File upload errors are handled gracefully
- [ ] 404 page works for invalid routes

## Domain Setup (Optional)

### Add Custom Domain
- [ ] Go to Vercel project Settings
- [ ] Click "Domains"
- [ ] Add your domain (e.g., `muwafak.com`)
- [ ] Follow DNS configuration instructions
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify HTTPS certificate is issued
- [ ] Test site works on custom domain

### SSL/TLS Certificate
- [ ] Automatic with Vercel
- [ ] Verify https:// works
- [ ] No mixed content warnings
- [ ] Lock icon shows in browser

## Monitoring & Maintenance

### Set Up Alerts (Optional)
- [ ] Go to Vercel project Settings
- [ ] Configure notifications for:
  - [ ] Failed deployments
  - [ ] Critical errors
  - [ ] Performance issues

### Regular Checks
- [ ] Check deployment status weekly
- [ ] Monitor error logs in Vercel
- [ ] Backup database data periodically
- [ ] Test admin dashboard monthly
- [ ] Update dependencies quarterly

### Database Maintenance
- [ ] Monitor database size
- [ ] Delete old contact messages periodically
- [ ] Backup important data
- [ ] Monitor connection limits

## Rollback Plan

If deployment has critical issues:

### Quick Rollback
1. [ ] Go to Vercel Deployments
2. [ ] Find previous working deployment
3. [ ] Click "Redeploy"
4. [ ] Wait for rollback deployment
5. [ ] Verify site works again

### Code Rollback
```bash
git revert <commit-hash>
git push origin main
# Vercel auto-deploys the reverted code
```

## Documentation Updates

- [ ] Update README with deployment URL
- [ ] Add admin credentials to secure location
- [ ] Document any custom configuration
- [ ] Share deployment URL with team
- [ ] Update project documentation with live link

## Success Criteria ✅

Your deployment is successful when:

- ✅ Frontend loads and displays portfolio
- ✅ All portfolio pages work (About, Skills, Projects, etc.)
- ✅ Contact form submits successfully
- ✅ Admin login works with created credentials
- ✅ Admin dashboard loads all managers
- ✅ Can edit and save profile information
- ✅ Can upload images (appears on public page)
- ✅ Can view submitted contact messages
- ✅ Can reply to contact messages
- ✅ API documentation available at `/api/docs`
- ✅ No console errors in browser
- ✅ No errors in Vercel deployment logs
- ✅ Site works on both desktop and mobile
- ✅ HTTPS certificate is valid (secure connection)

## Quick Reference

### Important URLs
- **Project URL**: https://your-project.vercel.app
- **Custom Domain**: https://your-domain.com (if configured)
- **Admin Dashboard**: https://your-project.vercel.app/admin
- **API Docs**: https://your-project.vercel.app/api/docs
- **API Health**: https://your-project.vercel.app/api/health

### Important Files
- `vercel.json` - Multi-service configuration
- `backend/pyproject.toml` - Python dependencies
- `frontend/package.json` - Node dependencies
- `.env.example` - Environment variable template

### Important Credentials
- **JWT_SECRET_KEY**: Keep secret, don't share
- **DATABASE_URL**: Sensitive, never expose
- **BLOB_TOKEN**: Keep secret, don't share
- **Admin Password**: Secure with strong password

## Support & Help

### Troubleshooting
1. Check [QUICKSTART.md](./QUICKSTART.md) troubleshooting section
2. Review [BACKEND.md](./BACKEND.md) backend issues
3. Check Vercel deployment logs
4. Review environment variables are set correctly

### Documentation
- [DOCUMENTATION.md](./DOCUMENTATION.md) - Complete docs index
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API_REFERENCE.md](./API_REFERENCE.md) - API endpoints

### Resources
- [Vercel Docs](https://vercel.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Vercel Blob Docs](https://vercel.com/docs/vercel-blob)

---

## Deployment Timeline

| Step | Estimated Time | Status |
|------|----------------|--------|
| Vercel Project Setup | 5 min | ☐ |
| Neon Database Setup | 10 min | ☐ |
| Vercel Blob Setup | 5 min | ☐ |
| Environment Variables | 5 min | ☐ |
| Initial Deployment | 10 min | ☐ |
| Testing | 15 min | ☐ |
| **Total Time** | **50 minutes** | |

## Sign-Off

When complete, you can sign off on this deployment:

```
Deployment Date: _______________
Deployed By: _______________
Project URL: _______________
All Tests Passed: _______________
Go-Live Approved: _______________
```

---

**Deployment Checklist Created**: 2024
**Last Updated**: 2024
**Status**: Ready to Deploy ✅
