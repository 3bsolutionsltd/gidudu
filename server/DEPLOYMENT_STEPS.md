# Quick Deployment Steps for CORS Fix

## Current Issue
CORS error on https://new.gidudu.org/ambassadors.html preventing API access

## Cause
The updated `server.js` with CORS fix hasn't been deployed to api.gidudu.org yet, OR the Node.js server hasn't been restarted.

---

## Step-by-Step Deployment

### Step 1: Verify API Server is Running

**Test in browser:**
Open: https://api.gidudu.org/api/health

**Expected Response:**
```json
{
  "status": "ok",
  "message": "CMS API is running",
  "timestamp": "2026-02-11T...",
  "environment": "production",
  "uptime": 12345
}
```

**If you get an error or nothing:**
- Server is not running
- Need to start/restart the Node.js application (see Step 4)

---

### Step 2: Upload Updated Files via FTP

**Use FileZilla or WinSCP:**

**Connection Details:**
```
Host: gidudu.org
Username: 3bsgidudu@gidudu.org
Password: xDjEthySG6BBpw6ZnPZy
Port: 21
```

**Navigate to:**
`/home/giduduorg/domains/api.gidudu.org/public_html/`

**Upload these files from your local `C:\Users\DELL\gidudu\server\`:**
1. ✅ **server.js** (contains CORS fix)
2. ✅ **.env** (has NODE_ENV=production)
3. ✅ **package.json** (if changed)

**OVERWRITE existing files when prompted!**

---

### Step 3: Verify Files Were Uploaded

**Via FTP:**
1. Right-click `server.js` on remote server
2. Select "View/Edit"
3. Search for "allowedOrigins" - should see:
```javascript
const allowedOrigins = [
    'https://new.gidudu.org',
    'https://gidudu.org',
    ...
```

**If you DON'T see this:**
- File didn't upload properly
- Try uploading again
- Check you're in the correct directory

---

### Step 4: Restart Node.js Application

**Option A: Hosting Control Panel (Recommended)**

1. Log into your hosting control panel:
   - URL: https://gidudu.org:2222 (DirectAdmin)
   - OR: https://cpanel.gidudu.org (cPanel)
   - Username: 3bsgidudu@gidudu.org
   - Password: xDjEthySG6BBpw6ZnPZy

2. Find one of these:
   - "Node.js Selector" or "Node.js Apps"
   - "Application Manager"
   - "Setup Node.js App"

3. Locate: api.gidudu.org application

4. Click: **"Restart"** or **"Restart Application"**

5. Wait 10-15 seconds

**Option B: Via SSH (If Available)**

```bash
# Connect via SSH
ssh 3bsgidudu@gidudu.org

# Navigate to api directory
cd /home/giduduorg/domains/api.gidudu.org/public_html

# If using PM2
pm2 restart server

# OR if using forever
forever restart server.js

# OR kill and restart manually
pkill -f "node server.js"
nohup node server.js > server.log 2>&1 &

# Exit SSH
exit
```

**Option C: Touch .htaccess to Trigger Restart**

Some hosts auto-restart when files change:
1. Via FTP, edit `.htaccess` in api.gidudu.org/public_html/
2. Add a space or comment: `# Restart trigger`
3. Save file

---

### Step 5: Test CORS is Fixed

**Method 1: Browser Console Test**

1. Open: https://new.gidudu.org/ambassadors.html
2. Press F12 → Console tab
3. Paste and run:
```javascript
fetch('https://api.gidudu.org/api/ambassadors')
  .then(response => {
    console.log('Status:', response.status);
    console.log('Headers:', [...response.headers.entries()]);
    return response.json();
  })
  .then(data => console.log('✅ SUCCESS! Ambassadors:', data))
  .catch(error => console.error('❌ FAILED:', error));
```

**Expected Output:**
```
Status: 200
Headers: [..., ["access-control-allow-origin", "https://new.gidudu.org"], ...]
✅ SUCCESS! Ambassadors: [Array of 5 ambassadors]
```

**Method 2: Direct Page Test**

Simply refresh: https://new.gidudu.org/ambassadors.html

**Expected:**
- 5 ambassador cards display
- No console errors
- Black text visible
- Images loaded

**Method 3: Network Tab Check**

1. Open: https://new.gidudu.org/ambassadors.html
2. Press F12 → Network tab
3. Refresh page
4. Click on "ambassadors" request
5. Check "Response Headers" section
6. Should see: `access-control-allow-origin: https://new.gidudu.org`

---

## Troubleshooting

### Issue: Health Check Fails (api.gidudu.org/api/health doesn't load)

**Problem:** Server not running

**Solution:**
1. Check if Node.js is installed on server
2. SSH to server and manually start:
   ```bash
   cd /home/giduduorg/domains/api.gidudu.org/public_html
   node server.js
   ```
3. Contact hosting support to enable Node.js

---

### Issue: CORS Error Persists After Restart

**Problem:** Old server.js file still in use

**Check:**
1. Via FTP, download server.js from api.gidudu.org
2. Open it locally
3. Search for "allowedOrigins"
4. If NOT found → file didn't upload correctly

**Solution:**
1. Delete server.js on remote server
2. Re-upload from local C:\Users\DELL\gidudu\server\server.js
3. Restart server again

---

### Issue: "ERR_BLOCKED_BY_CLIENT" Error

**Problem:** Browser extension (ad blocker) blocking request

**Solution:**
1. Disable browser ad blockers (uBlock Origin, Adblock Plus, etc.)
2. Try in incognito/private mode
3. Or whitelist new.gidudu.org and api.gidudu.org

---

### Issue: Server Starts But Immediately Crashes

**Check server logs:**

Via SSH:
```bash
cd /home/giduduorg/domains/api.gidudu.org/public_html
cat server.log
# OR
pm2 logs server
```

**Common issues:**
- Missing dependencies: Run `npm install`
- Port already in use: Change PORT in .env
- Syntax error in server.js: Check for upload corruption

---

## Verification Checklist

- [ ] **Health check works**: https://api.gidudu.org/api/health returns OK
- [ ] **server.js uploaded**: File modified date matches today
- [ ] **.env uploaded**: Contains NODE_ENV=production
- [ ] **Server restarted**: Via control panel or SSH
- [ ] **CORS header present**: Network tab shows access-control-allow-origin
- [ ] **Ambassadors load**: https://new.gidudu.org/ambassadors.html shows 5 cards
- [ ] **No console errors**: F12 console is clean (except ad blocker warnings)

---

## Quick Command Reference

**Test API health:**
```powershell
Invoke-WebRequest https://api.gidudu.org/api/health
```

**Test ambassadors endpoint:**
```powershell
Invoke-WebRequest https://api.gidudu.org/api/ambassadors
```

**Expected response should include:**
```
Headers: {..., Access-Control-Allow-Origin: https://new.gidudu.org, ...}
```

---

## Contact Support If

- Unable to access hosting control panel
- Can't find Node.js restart option
- SSH access not available
- Server keeps crashing
- CORS still fails after all steps

**Support Info:**
- Hosting Provider: [Your hosting provider]
- Account: 3bsgidudu@gidudu.org
- Issue: "Need to restart Node.js application for api.gidudu.org after code update"

---

## Success Indicators

When everything works, you'll see:

✅ https://api.gidudu.org/api/health → `{"status":"ok"}`
✅ https://new.gidudu.org/ambassadors.html → 5 ambassador cards visible
✅ Browser console → No CORS errors
✅ Network tab → Response headers include `access-control-allow-origin`
✅ Ambassador images → All 5 profiles with black text and correct spacing

**You're done when the ambassadors page loads without errors!**
