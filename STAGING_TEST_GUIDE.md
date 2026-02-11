# Staging Environment Testing Guide

## Overview
This guide provides a comprehensive testing checklist for validating all functionality in a staging environment before deploying to production (new.gidudu.org and api.gidudu.org).

---

## 1. Environment Setup

### Option A: Local Staging Environment (Recommended for Initial Testing)

**Frontend (Local):**
- URL: `http://localhost:5500` or `http://127.0.0.1:5500`
- Files: All HTML, CSS, JS, images from `C:\Users\DELL\gidudu`
- Use Live Server extension in VS Code

**Backend (Local):**
- URL: `http://localhost:3000`
- Location: `C:\Users\DELL\gidudu\server`
- Environment file: `.env` (with staging/production credentials)

**Start Local Staging:**
```powershell
# Terminal 1: Start Backend
cd C:\Users\DELL\gidudu\server
node server.js

# Terminal 2: Start Frontend
# In VS Code, right-click index.html → Open with Live Server
```

### Option B: Remote Staging Subdomains (If Available)

**If you have staging subdomains:**
- Frontend: `staging.gidudu.org` or `test.gidudu.org`
- Backend: `api-staging.gidudu.org` or `api-test.gidudu.org`

**Update API URLs in frontend for staging:**
```javascript
// In js/script.js, js/child-loader.js, etc.
const API_URL = 'https://api-staging.gidudu.org'; // Change to staging API
```

---

## 2. Pre-Deployment Validation Checklist

### ✅ Code Quality Checks

- [ ] No console errors in browser developer tools (F12)
- [ ] All files committed to Git (`git status` shows clean)
- [ ] All dependencies installed (`npm install` in server/)
- [ ] Environment variables properly configured (.env file)
- [ ] No sensitive data in committed files (passwords, API keys)

### ✅ File Integrity Checks

```powershell
# Verify all required files exist
cd C:\Users\DELL\gidudu

# Frontend files
Test-Path index.html
Test-Path ambassadors.html
Test-Path sponsor.html
Test-Path child.html
Test-Path css/style.css
Test-Path js/script.js
Test-Path js/ambassador-loader.js
Test-Path js/child-loader.js
Test-Path images/ambassadors/

# Backend files
cd server
Test-Path server.js
Test-Path package.json
Test-Path .env
Test-Path data/ambassadors.json
Test-Path admin/index.html
```

---

## 3. Functional Testing Checklist

### 🎨 Frontend Testing

#### A. Navigation & Layout
**Test Page:** All pages (`index.html`, `ambassadors.html`, etc.)

- [ ] **Logo displays** in navigation bar
  - File: `images/igfm-logo.png`
  - Height: 40px
  - Clickable and links to home page
  
- [ ] **Navigation menu** works on all pages
  - All links functional
  - Active page highlighted
  - Mobile menu works (responsive)
  
- [ ] **Footer** displays on all pages
  - Social media links work
  - Contact information correct
  
- [ ] **Page loads** without errors (check browser console)

**How to Test:**
1. Open `http://localhost:5500/index.html`
2. Press F12 → Console tab (should show no red errors)
3. Click through all navigation links
4. Resize browser to mobile size (responsive check)

---

#### B. Ambassador Page
**Test Page:** `ambassadors.html`

**Visual Checks:**
- [ ] **Ambassador cards** display in grid layout (3 columns on desktop)
- [ ] **Profile images** are circular and properly sized
- [ ] **Names are BLACK** (not white)
- [ ] **Locations are BLACK** (not white)
- [ ] **Location text is FULLY VISIBLE** (not cut off by circular image)
- [ ] **Images overlap** header correctly (60px negative margin)
- [ ] **Header spacing** looks balanced (1.5rem top padding)
- [ ] **Testimonies** display below images
- [ ] **Background gradients** show behind name/location

**Data Validation:**
- [ ] 5 ambassadors display:
  1. Phyllis Stewart (Ennis, TX)
  2. Jim and Nancy (Colorado)
  3. Ann and Steve McKinley (Ohio)
  4. Benjamin and Sheila Burum (Houston, TX)
  5. Trina Ryan (Ohio)
  
- [ ] Each ambassador has:
  - Profile image (400x400px)
  - Name
  - Location
  - Authentic testimony text
  - Background gradient color

**How to Test:**
```powershell
# Open ambassador page
start http://localhost:5500/ambassadors.html

# Check data file
cat server/data/ambassadors.json | ConvertFrom-Json | Format-List
```

**Expected Results:**
- Ambassador names and locations in BLACK text with white shadow
- Locations NOT cut off by circular images
- Header spacing balanced (not too much top space)
- Images have -60px margin overlap
- All 5 ambassadors load correctly

---

#### C. Sponsor & Child Pages
**Test Page:** `sponsor.html` and `child.html`

**Sponsor Page Tests:**
- [ ] Child cards display in grid layout
- [ ] **Child images display FULL FACE** (not cut off at top)
- [ ] Images use `object-position: center top` for proper framing
- [ ] "Sponsor Now" buttons functional
- [ ] Filter/search works (if implemented)
- [ ] Pagination works (if implemented)

**Child Detail Page Tests:**
- [ ] Navigate to `http://localhost:5500/child.html?id=abbas-bollo`
- [ ] Child details load correctly:
  - Name displays
  - Age displays
  - Location displays
  - Story/description displays
  - Profile image displays (full face visible)
- [ ] "Sponsor This Child" button works
- [ ] Back button returns to sponsor page
- [ ] No JavaScript errors in console

**How to Test:**
```powershell
# Test child profile loading
start http://localhost:5500/child.html?id=abbas-bollo

# Open console (F12) and check for errors
# Verify API call succeeds
```

**Expected Results:**
- Child profile loads without errors
- All child data displays correctly
- Images show full faces (not cut off)
- No "Uncaught SyntaxError" in console

---

#### D. Ministry Pages
**Test Pages:** All ministry HTML files

**Pages to Verify:**
1. `berakhah-childcare.html`
2. `berakhah-choir.html`
3. `church-construction.html`
4. `church-planting.html`
5. `church-prison.html`
6. `hospital.html`
7. `safe-water.html`
8. `school-outreaches.html`
9. `mens-ministries.html`
10. `womens-ministries.html`
11. `youth-ministries.html`

**Checks for EACH Ministry Page:**
- [ ] Page loads without errors
- [ ] **Unique header image** displays (NOT generic berakhah-choir.jpg)
- [ ] Image path correct: `images/[ministry-name].jpg`
- [ ] Content displays correctly
- [ ] Navigation works
- [ ] Footer displays

**Quick Test Script:**
```powershell
# Test all ministry pages
$pages = @(
    "berakhah-childcare.html",
    "berakhah-choir.html", 
    "church-construction.html",
    "church-planting.html",
    "church-prison.html",
    "hospital.html",
    "safe-water.html",
    "school-outreaches.html",
    "mens-ministries.html",
    "womens-ministries.html",
    "youth-ministries.html"
)

foreach ($page in $pages) {
    Write-Host "Testing: $page" -ForegroundColor Cyan
    start "http://localhost:5500/$page"
    Start-Sleep -Seconds 2
}
```

---

#### E. Contact Form
**Test Page:** `index.html` or dedicated contact page

**Form Checks:**
- [ ] Form displays correctly
- [ ] All fields present:
  - Name (required)
  - Email (required, validated)
  - Subject
  - Message (required)
- [ ] Submit button works
- [ ] API URL detection works:
  - Localhost: Uses `http://localhost:3000`
  - Production: Uses `https://api.gidudu.org`

**How to Test:**
1. Open page with contact form
2. Fill out all fields
3. Click Submit
4. Check browser Network tab (F12 → Network)
5. Verify POST request goes to correct API endpoint
6. Check response status (should be 200 OK or similar)

---

### 🖥️ Backend Testing

#### A. Server Startup
**Test:** Server starts without errors

```powershell
cd C:\Users\DELL\gidudu\server
node server.js
```

**Expected Output:**
```
🚀 Server is running on port 3000
📧 Email configured: noreply@gidudu.org via mail.gidudu.org:465
✅ Email transporter created successfully
```

**Checks:**
- [ ] Server starts on port 3000
- [ ] No error messages in console
- [ ] Email configuration logged
- [ ] No "ETIMEDOUT" or "ENOTFOUND" errors (warning is acceptable)

---

#### B. API Endpoints Testing

**1. Test Children API**
```powershell
# Get all children
Invoke-WebRequest -Uri "http://localhost:3000/api/children" -Method GET | Select-Object StatusCode, Content

# Get specific child
Invoke-WebRequest -Uri "http://localhost:3000/api/children/abbas-bollo" -Method GET | Select-Object StatusCode, Content
```

**Expected:**
- Status: 200 OK
- Response: JSON array of children data

**Checks:**
- [ ] `/api/children` returns array of children
- [ ] `/api/children/:id` returns specific child details
- [ ] Response format is valid JSON
- [ ] All required fields present (id, name, age, location, etc.)

---

**2. Test Ambassador API**
```powershell
# Get all ambassadors
Invoke-WebRequest -Uri "http://localhost:3000/api/ambassadors" -Method GET | Select-Object StatusCode, Content
```

**Expected:**
- Status: 200 OK
- Response: JSON array with 5 ambassadors

**Checks:**
- [ ] Returns 5 ambassador objects
- [ ] Each has: id, name, location, image, testimony, bgGradient
- [ ] Image paths correct: `images/ambassadors/[name].jpg`

---

**3. Test Contact Form API**
```powershell
# Test email endpoint
$body = @{
    name = "Test User"
    email = "test@example.com"
    subject = "Staging Test"
    message = "This is a test message from staging environment"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/contact" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Expected Outcomes:**

**Option 1: Email Sends Successfully**
- Status: 200 OK
- Response: `{"success": true, "message": "Message sent successfully"}`
- Email received at configured email address

**Option 2: SMTP Timeout (Still Acceptable for Testing)**
- Status: 500 Internal Server Error
- Response: `Connection timeout` or similar
- Note: Email may still work in production environment with proper network access

**Checks:**
- [ ] API accepts POST requests
- [ ] Validates required fields (name, email, message)
- [ ] Returns appropriate error for missing fields
- [ ] Attempts to send email via mail.gidudu.org
- [ ] Logs email attempt in server console

---

#### C. Email Configuration Validation

**Environment Variables:**
```powershell
# Check .env file
cat server/.env
```

**Required Variables:**
- [ ] `EMAIL_HOST=mail.gidudu.org`
- [ ] `EMAIL_PORT=465`
- [ ] `EMAIL_USER=noreply@gidudu.org`
- [ ] `EMAIL_PASS=53YwD56kAjKy6bdrqTDm`
- [ ] `EMAIL_SECURE=true`

**Server Logs Check:**
```powershell
# Start server and check logs
node server.js

# Should see:
# ✅ Email transporter created successfully
# 📧 Email configured: noreply@gidudu.org via mail.gidudu.org:465
```

**Network Test:**
```powershell
# Test SMTP port connectivity
Test-NetConnection -ComputerName mail.gidudu.org -Port 465
```

**Expected:**
- If successful: `TcpTestSucceeded: True`
- If blocked: `TcpTestSucceeded: False` (Email may still work in production)

---

#### D. Admin Panel Testing

**Test URL:** `http://localhost:3000/admin/`

**Login Tests:**
- [ ] Admin page loads
- [ ] Login form displays
- [ ] Username field works
- [ ] Password field works (masked)
- [ ] Submit button works
- [ ] Invalid credentials show error
- [ ] Valid credentials grant access

**Admin Credentials:**
```
Username: admin
Password: (as hashed in server.js or configured credentials)
```

**Post-Login Checks:**
- [ ] Dashboard displays
- [ ] Can view children data
- [ ] Can view ambassadors data
- [ ] Can view contact messages (if stored)
- [ ] Logout works

---

#### E. Security Testing

**CORS Check:**
```powershell
# Test CORS headers
Invoke-WebRequest -Uri "http://localhost:3000/api/children" -Method OPTIONS
```

**Expected Headers:**
- `Access-Control-Allow-Origin: *` (or specific domain)
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE`

**Checks:**
- [ ] CORS enabled for frontend domains
- [ ] Rate limiting active (prevents spam)
- [ ] Helmet security headers present
- [ ] No sensitive data in API responses
- [ ] Environment variables not exposed

---

## 4. Cross-Browser Testing

**Test ALL functionality in:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (Mac/iOS - if available)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

**Key Checks:**
- Layout renders correctly
- JavaScript works without errors
- Forms submit properly
- Images display
- Navigation functions

---

## 5. Performance Testing

### Page Load Speed
```powershell
# Test page load times
Measure-Command { Invoke-WebRequest -Uri "http://localhost:5500/index.html" }
Measure-Command { Invoke-WebRequest -Uri "http://localhost:5500/ambassadors.html" }
Measure-Command { Invoke-WebRequest -Uri "http://localhost:5500/sponsor.html" }
```

**Target:** Pages should load in under 3 seconds

### API Response Time
```powershell
Measure-Command { Invoke-WebRequest -Uri "http://localhost:3000/api/children" }
Measure-Command { Invoke-WebRequest -Uri "http://localhost:3000/api/ambassadors" }
```

**Target:** API responses under 500ms

### Image Optimization Checks
- [ ] All images compressed (JPG quality 80-85%)
- [ ] Ambassador images are 400x400px (not larger)
- [ ] Ministry images reasonable size (800x600px recommended)
- [ ] No images over 500KB

---

## 6. Mobile Responsiveness Testing

**Test Breakpoints:**
- [ ] Mobile: 320px - 480px
- [ ] Tablet: 768px - 1024px
- [ ] Desktop: 1200px+

**How to Test:**
1. Open Chrome DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select different devices:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

**Checks for Each Breakpoint:**
- [ ] Navigation menu adapts (hamburger on mobile)
- [ ] Ambassador grid adjusts (1 column mobile, 2 tablet, 3 desktop)
- [ ] Child cards stack properly
- [ ] Images resize appropriately
- [ ] Text readable (not too small)
- [ ] Buttons accessible (large enough to tap)
- [ ] Forms usable on mobile

---

## 7. Content Validation

### Ambassador Content
```powershell
# Verify ambassador data
$ambassadors = Get-Content server/data/ambassadors.json | ConvertFrom-Json
$ambassadors | ForEach-Object {
    Write-Host "Name: $($_.name)" -ForegroundColor Green
    Write-Host "Location: $($_.location)" -ForegroundColor Cyan
    Write-Host "Image: $($_.image)" -ForegroundColor Yellow
    Write-Host "Testimony Length: $($_.testimony.Length) chars" -ForegroundColor Magenta
    Write-Host "---"
}
```

**Validation Checks:**
- [ ] All 5 ambassadors have complete data
- [ ] No missing fields (name, location, image, testimony)
- [ ] Image files exist in `images/ambassadors/`
- [ ] Testimonies are authentic (from magazine)
- [ ] No placeholder text ("Lorem ipsum", etc.)

### Children Content
```powershell
# Verify children data
$children = Get-Content server/data/children.json | ConvertFrom-Json
Write-Host "Total Children: $($children.Length)" -ForegroundColor Green

# Check for any with missing images
$children | Where-Object { -not (Test-Path "images/children/$($_.image)") } | ForEach-Object {
    Write-Host "Missing image for: $($_.name)" -ForegroundColor Red
}
```

---

## 8. Accessibility Testing

**Manual Checks:**
- [ ] All images have alt text
- [ ] Form labels properly associated with inputs
- [ ] Keyboard navigation works (Tab key)
- [ ] Focus indicators visible
- [ ] Color contrast sufficient (text readable)
- [ ] Screen reader friendly (test with NVDA/JAWS if available)

**Automated Testing:**
1. Install Lighthouse extension in Chrome
2. Run audit on each page
3. Target: Accessibility score > 90%

---

## 9. Pre-Production Deployment Checklist

### Configuration Updates for Production

**Frontend Changes:**
1. Update API URLs in all loader files:
```javascript
// js/script.js, js/child-loader.js, js/sponsor-loader.js, etc.
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://api.gidudu.org';  // Production API
```

2. Verify all internal links use relative paths (not localhost)

3. Check that no debugging code remains:
   - No `console.log()` statements (or minimize)
   - No `debugger;` statements
   - No commented-out code blocks

**Backend Changes:**
1. Update `.env` for production:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=[generate new secure secret]

# Email Configuration
EMAIL_HOST=mail.gidudu.org
EMAIL_PORT=465
EMAIL_USER=noreply@gidudu.org
EMAIL_PASS=53YwD56kAjKy6bdrqTDm
EMAIL_SECURE=true
```

2. Verify CORS allows production domains:
```javascript
// In server.js
const allowedOrigins = ['https://new.gidudu.org', 'https://gidudu.org'];
```

3. Ensure rate limiting is enabled

4. Verify error handling doesn't expose sensitive info

---

## 10. Staging-to-Production Migration Plan

### Step 1: Final Local Testing
- [ ] Complete ALL tests above
- [ ] Document any issues found
- [ ] Fix all critical bugs
- [ ] Re-test fixes

### Step 2: Create Production Backup
```powershell
# Before deploying, backup current production
# Download current files from new.gidudu.org and api.gidudu.org via FTP
# Save to: C:\Users\DELL\gidudu\backups\[date]
```

### Step 3: Deploy to Production
```powershell
# Use FileZilla or WinSCP
# Upload to:
# - Frontend: /home/giduduorg/domains/new.gidudu.org/public_html
# - Backend: /home/giduduorg/domains/api.gidudu.org/public_html
```

### Step 4: Post-Deployment Testing
- [ ] Test production URLs (https://new.gidudu.org)
- [ ] Verify SSL certificate valid
- [ ] Test all API endpoints on production
- [ ] Submit test contact form
- [ ] Verify email sends from production server
- [ ] Check browser console for errors
- [ ] Test on multiple devices

### Step 5: Monitoring
- [ ] Monitor server logs for errors
- [ ] Check email deliverability
- [ ] Monitor API response times
- [ ] Watch for user-reported issues

---

## 11. Troubleshooting Common Issues

### Issue: Ambassador Text Not Black
**Symptom:** Names and locations appear white instead of black

**Fix:**
```css
/* In css/style.css, verify: */
.ambassador-header h3 {
    color: #000; /* Should be black, not white */
}

.ambassador-header .location {
    color: #000; /* Should be black, not white */
}
```

### Issue: Location Text Cut Off
**Symptom:** Location text hidden behind circular image

**Fix:**
```css
/* In css/style.css, verify: */
.ambassador-header {
    padding: 1.5rem 2rem 3.5rem; /* Top padding should be 1.5rem */
}

.ambassador-image {
    margin: -60px auto 0; /* Negative margin should be -60px */
}
```

### Issue: Child Images Cut Off
**Symptom:** Child faces appear cut off at top of card

**Fix:**
```css
/* In css/style.css, verify: */
.child-image img {
    object-fit: cover;
    object-position: center top; /* Should focus on top of image */
}
```

### Issue: Email Not Sending
**Symptom:** Contact form returns error or timeout

**Diagnosis:**
```powershell
# Test SMTP connection
Test-NetConnection -ComputerName mail.gidudu.org -Port 465
```

**Fixes:**
1. Verify .env credentials correct
2. Check firewall not blocking port 465
3. Confirm mail.gidudu.org resolves correctly
4. Try port 587 instead of 465
5. Contact hosting provider to enable SMTP
6. Consider alternative: SendGrid API (see PRODUCTION_EMAIL_SETUP.md)

### Issue: API Not Loading Data
**Symptom:** Frontend shows "Loading..." indefinitely

**Diagnosis:**
1. Check browser console for errors
2. Check Network tab for failed requests
3. Verify API server is running

**Fix:**
```powershell
# Restart server
cd C:\Users\DELL\gidudu\server
node server.js

# Check data files exist
Test-Path data/ambassadors.json
Test-Path data/children.json
```

---

## 12. Test Results Documentation

### Test Report Template

```
=== STAGING TEST REPORT ===
Date: [DATE]
Tester: [NAME]
Environment: Local / Remote Staging

FRONTEND TESTS:
✅ Navigation & Logo: PASS
✅ Ambassador Page Layout: PASS
  - Black text: PASS
  - Location visible: PASS
  - Spacing correct: PASS
✅ Child Profile Page: PASS
✅ Ministry Pages: PASS
✅ Contact Form: PASS

BACKEND TESTS:
✅ Server Startup: PASS
✅ Children API: PASS
✅ Ambassador API: PASS
✅ Email API: PASS / WARN [specify issue]

BROWSER TESTS:
✅ Chrome: PASS
✅ Firefox: PASS
✅ Edge: PASS
❓ Safari: NOT TESTED
⚠️ Mobile: PARTIAL [specify issues]

PERFORMANCE:
✅ Page Load: PASS (avg 1.5s)
✅ API Response: PASS (avg 250ms)

ISSUES FOUND:
1. [Issue description]
   Status: FIXED / PENDING
   
2. [Issue description]
   Status: FIXED / PENDING

READY FOR PRODUCTION: YES / NO
Deployment ETA: [DATE/TIME]

Notes:
[Additional observations]
```

---

## 13. Sign-Off Checklist

Before deploying to production, confirm:

- [ ] All critical tests passed
- [ ] All bugs fixed or documented
- [ ] Code committed to Git
- [ ] Production backup created
- [ ] Environment variables configured for production
- [ ] API URLs point to production endpoints
- [ ] SSL certificates valid
- [ ] Team notified of deployment
- [ ] Rollback plan prepared
- [ ] Contact form tested and confirmed working
- [ ] Ambassador page displays correctly (black text, proper spacing)
- [ ] Child profiles load without errors
- [ ] All ministry pages show unique images
- [ ] Email configuration tested
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Performance benchmarks met

---

## 14. Contact & Support

**If Issues Arise:**
1. Check this guide's troubleshooting section
2. Review server logs: `C:\Users\DELL\gidudu\server\logs\`
3. Check browser console for frontend errors
4. Review documentation:
   - `PRODUCTION_EMAIL_SETUP.md`
   - `GIDUDU_MAIL_SERVER_SETUP.md`
   - `FTP_DEPLOYMENT.md`
   - `DEPLOYMENT_GUIDE.md`

**Critical Issues:**
- Email not sending: See `PRODUCTION_EMAIL_SETUP.md` alternatives
- FTP access issues: Check `FTP_DEPLOYMENT.md`
- Server errors: Review `server/server.js` logs

---

## Quick Start Testing Commands

```powershell
# 1. Start Backend Server
cd C:\Users\DELL\gidudu\server
node server.js

# 2. Start Frontend (VS Code)
# Right-click index.html → Open with Live Server

# 3. Run Quick Tests
# Test API
Invoke-WebRequest http://localhost:3000/api/ambassadors | ConvertFrom-Json

# Test Pages
start http://localhost:5500/ambassadors.html
start http://localhost:5500/child.html?id=abbas-bollo
start http://localhost:5500/sponsor.html

# 4. Check for Errors
# Open each page, press F12, check Console tab (should have no red errors)
```

---

**READY TO DEPLOY?** 
Once all tests pass, proceed with production deployment using `FTP_DEPLOYMENT.md`!
