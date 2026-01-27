# Deployment Guide for api.gidudu.org and new.gidudu.org

## Overview
This guide walks you through deploying your CMS backend to api.gidudu.org and frontend to new.gidudu.org for testing before switching the main gidudu.org domain.

---

## Part 1: Deploy Backend to api.gidudu.org

### Step 1: Prepare Backend Files for Upload

Create a zip file with the server directory contents:
1. Navigate to `c:\Users\DELL\gidudu\server`
2. Select all files and folders inside the server directory:
   - `server.js`
   - `package.json`
   - `admin/` folder
   - `data/` folder
   - `uploads/` folder
   - `README.md`
   - `SECURITY_SETUP.md`
3. Right-click → Send to → Compressed (zipped) folder
4. Name it `backend.zip`

### Step 2: Upload to DirectAdmin

1. Log into your DirectAdmin panel
2. Navigate to **File Manager**
3. Go to `domains/api.gidudu.org/public_html` (or wherever api.gidudu.org points)
4. Upload `backend.zip`
5. Extract the zip file in the File Manager
6. Your structure should be:
   ```
   public_html/
   ├── server.js
   ├── package.json
   ├── admin/
   ├── data/
   ├── uploads/
   ├── README.md
   └── SECURITY_SETUP.md
   ```

### Step 3: Setup Node.js Application

1. In DirectAdmin, go to **Node.js Selector**
2. Click **Create Application**
3. Configure:
   - **Node.js version**: 22.x or latest available
   - **Application mode**: Production
   - **Application root**: `domains/api.gidudu.org/public_html`
   - **Application URL**: `api.gidudu.org`
   - **Application startup file**: `server.js`
   - **Port**: Auto (DirectAdmin will assign)
4. Click **Create**

### Step 4: Install Dependencies

1. Still in Node.js Selector, find your application
2. Click **Run NPM Install** or access the terminal
3. Or via SSH/Terminal:
   ```bash
   cd domains/api.gidudu.org/public_html
   npm install
   ```

### Step 5: Set Environment Variables

1. In Node.js Selector, click **Environment Variables** for your app
2. Add these variables:
   - `JWT_SECRET`: `your-secure-random-string-here-minimum-32-characters`
   - `PORT`: `3000` (or the port DirectAdmin assigned)
   - `NODE_ENV`: `production`

**Important**: Generate a strong JWT_SECRET. You can use this command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Create Initial Admin User

1. SSH into your server or use DirectAdmin's terminal
2. Navigate to your app directory
3. Run (with your chosen password):
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourStrongPassword123!', 10).then(hash => console.log(hash));"
   ```
4. Copy the hash output
5. Edit `data/users.json`:
   ```json
   [
     {
       "id": "admin-001",
       "username": "admin",
       "password": "PASTE_THE_HASH_HERE",
       "role": "admin"
     }
   ]
   ```

### Step 7: Set Correct Permissions

Via SSH or File Manager:
```bash
chmod 755 server.js
chmod -R 755 admin/
chmod -R 777 uploads/
chmod -R 666 data/*.json
```

### Step 8: Start the Application

1. In Node.js Selector, click **Start** for your application
2. Check the status - it should show "Running"
3. Test by visiting: `https://api.gidudu.org/api/health` (should return API status)

### Step 9: Test Admin Login

1. Visit: `https://api.gidudu.org/admin/`
2. Login with:
   - Username: `admin`
   - Password: (whatever you set in Step 6)
3. Verify you can access the dashboard

---

## Part 2: Deploy Frontend to new.gidudu.org

### Step 1: Prepare Frontend Files

1. Navigate to `c:\Users\DELL\gidudu`
2. Select these files/folders:
   - All `.html` files (index.html, about.html, hospital.html, etc.)
   - `css/` folder
   - `js/` folder
   - `images/` folder
   - `robots.txt`
   - `sitemap.xml`
   - `render.yaml` (optional)
   - All `.md` files (optional, for documentation)
3. **DO NOT include** the `server/` directory
4. Create a zip: `frontend.zip`

### Step 2: Upload to DirectAdmin

1. In DirectAdmin File Manager
2. Navigate to `domains/new.gidudu.org/public_html`
3. Upload `frontend.zip`
4. Extract it
5. Your structure should be:
   ```
   public_html/
   ├── index.html
   ├── about.html
   ├── hospital.html
   ├── (all other .html files)
   ├── css/
   ├── js/
   ├── images/
   ├── robots.txt
   └── sitemap.xml
   ```

### Step 3: Update robots.txt and sitemap.xml

1. Edit `robots.txt` in File Manager:
   ```
   User-agent: *
   Disallow: /admin/
   Allow: /
   
   Sitemap: https://new.gidudu.org/sitemap.xml
   ```

2. Edit `sitemap.xml` - replace GitHub Pages URLs with new.gidudu.org:
   ```xml
   <loc>https://new.gidudu.org/</loc>
   <loc>https://new.gidudu.org/about.html</loc>
   <loc>https://new.gidudu.org/hospital.html</loc>
   <!-- etc. -->
   ```

### Step 4: Test the Frontend

Visit: `https://new.gidudu.org`
- Homepage should load
- Navigation should work
- Test hospital.html, sponsor.html, etc.
- Hero slideshow should load (from api.gidudu.org)

---

## Part 3: Testing Integration

### Test Checklist

1. **Hero Slideshow**: Visit homepage at new.gidudu.org - slides should load from backend
2. **Admin Panel**: 
   - Visit `https://api.gidudu.org/admin/`
   - Login successfully
   - Try uploading a test image
   - Update hero slideshow
   - Check if changes reflect on new.gidudu.org
3. **Programs Section**: Verify programs load from backend
4. **Children Section**: Verify children data loads
5. **Navigation**: Test all menu links work
6. **Responsive Design**: Test on mobile/tablet views
7. **Forms**: Test any contact forms or interactive elements

### Common Issues

**Issue**: "Failed to fetch from API"
- Solution: Check CORS settings in server.js includes new.gidudu.org
- Verify Node.js app is running in DirectAdmin

**Issue**: Images not loading
- Solution: Check file permissions (755 for folders, 644 for files)
- Verify image paths in HTML match uploaded structure

**Issue**: Admin login fails
- Solution: Check JWT_SECRET is set in environment variables
- Verify users.json has correct bcrypt hash

**Issue**: Upload folder errors
- Solution: Ensure uploads/ has 777 permissions
- Check disk space on server

---

## Part 4: Going Live on gidudu.org (Future)

Once testing is complete on new.gidudu.org:

1. **Backup Current Site**: Download current gidudu.org files
2. **Copy Files**: Copy everything from new.gidudu.org to gidudu.org/public_html
3. **Update URLs**: 
   - Edit `js/cms-loader.js` - no change needed (already points to api.gidudu.org)
   - Edit `sitemap.xml` - change new.gidudu.org to gidudu.org
   - Edit `robots.txt` - change domain to gidudu.org
4. **Add to CORS**: In server.js, ensure https://gidudu.org is in CORS origins (already added)
5. **Update DNS** (if needed): Ensure gidudu.org points to correct IP
6. **Test**: Visit gidudu.org and verify everything works

---

## Monitoring and Maintenance

### Check Application Status
- DirectAdmin → Node.js Selector → View status
- Should show "Running" with uptime

### View Logs
- DirectAdmin → Node.js Selector → Select app → View Logs
- Check for errors or issues

### Restart Application
If needed: DirectAdmin → Node.js Selector → Restart button

### Update Code
1. Make changes locally
2. Upload changed files via File Manager
3. Restart Node.js application in DirectAdmin

### Backup Data
Regularly backup:
- `data/*.json` files (hero.json, programs.json, children.json, users.json)
- `uploads/` folder (user-uploaded images)

---

## Security Checklist

- [ ] Strong JWT_SECRET set (32+ characters)
- [ ] Admin password is strong (8+ chars, mixed case, numbers, symbols)
- [ ] HTTPS enabled for api.gidudu.org and new.gidudu.org
- [ ] uploads/ folder has upload limits configured
- [ ] Regular backups scheduled
- [ ] Rate limiting enabled (already in server.js)
- [ ] CORS properly configured for your domains only

---

## Quick Reference

### Backend URLs
- Admin Panel: `https://api.gidudu.org/admin/`
- API Base: `https://api.gidudu.org/api/`
- Health Check: `https://api.gidudu.org/api/health`

### Frontend URLs
- Testing Site: `https://new.gidudu.org`
- Production: `https://gidudu.org` (future)

### Default Admin Credentials
- Username: `admin`
- Password: (set during Step 6 of backend deployment)

---

## Need Help?

If you encounter issues:
1. Check DirectAdmin error logs
2. Verify file permissions
3. Ensure Node.js app is running
4. Check environment variables are set
5. Test API endpoints directly in browser

**Remember**: new.gidudu.org is your testing environment. Don't touch gidudu.org until you're confident everything works!
