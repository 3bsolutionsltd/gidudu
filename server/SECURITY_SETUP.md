# Security Setup Guide

## 🔐 Critical Security Steps

### 1. Change Default Admin Password

**IMPORTANT:** The default admin password is `admin123`. Change it immediately!

**Option A: Via Admin Panel (Recommended)**
1. Login to admin panel: https://igfm-cms-backend.onrender.com/admin
2. Change password through the admin interface (if available)

**Option B: Manually Update**
1. Generate a new bcrypt hash:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('YOUR_NEW_PASSWORD', 10))"
   ```
2. Update `server/data/users.json` with the new hash
3. Commit and push changes

### 2. Set Secure JWT Secret

**On Render Dashboard:**
1. Go to your service settings
2. Navigate to "Environment" tab
3. Add environment variable:
   - Key: `JWT_SECRET`
   - Value: A long random string (at least 64 characters)
   
Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Enable Production Mode

Set environment variable in Render:
- Key: `NODE_ENV`
- Value: `production`

## 🛡️ Security Features Implemented

### ✅ Rate Limiting
- **Login endpoint**: 5 attempts per 15 minutes per IP
- **API endpoints**: 100 requests per minute per IP

### ✅ HTTP Security Headers
- Helmet.js configured for secure headers
- Content Security Policy (set in HTML)
- X-Content-Type-Options: nosniff
- Referrer Policy configured

### ✅ Input Validation & Sanitization
- All user inputs validated using express-validator
- XSS protection through input sanitization
- File upload type validation
- Size limits: 50MB max

### ✅ Authentication & Authorization
- JWT tokens with 2-hour expiration
- bcrypt password hashing (10 rounds)
- Protected admin endpoints

### ✅ CORS Protection
- Whitelisted origins only in production
- Credentials enabled for authenticated requests

## 🔍 Security Monitoring

### Regular Checks
1. Review login attempt logs
2. Monitor unusual API traffic
3. Check file upload activity
4. Update dependencies regularly

### Update Dependencies
```bash
cd server
npm audit
npm audit fix
npm update
```

## 📋 Security Checklist

- [ ] Changed default admin password
- [ ] Set secure JWT_SECRET in environment
- [ ] Set NODE_ENV=production
- [ ] Verified HTTPS is working
- [ ] Tested rate limiting
- [ ] Reviewed CORS settings
- [ ] Updated all npm packages
- [ ] Enabled error logging/monitoring

## 🚨 In Case of Security Incident

1. Immediately change admin password
2. Rotate JWT_SECRET
3. Review server logs
4. Check for unauthorized access
5. Update all dependencies
6. Contact security team if needed

## 📞 Support

For security concerns, contact: admin@igfm.org
