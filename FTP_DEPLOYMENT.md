# FTP Deployment Guide

## Your FTP Credentials

```
Host: gidudu.org (or ftp.gidudu.org)
Username: 3bsgidudu@gidudu.org
Password: xDjEthySG6BBpw6ZnPZy
Port: 21 (FTP) or 22 (SFTP - more secure)
Login Path: /home/giduduorg/domains/ (Direct access to subdomains!)
```

✅ **Perfect!** This account logs directly into the `/domains/` folder where your subdomains are located.

## Understanding Your Directory Structure

**You're currently seeing**: `/home/giduduorg/public_html` (WordPress site)

This is normal! Your FTP login defaults to the main domain. Your subdomains are likely in **one of these locations**:

### Option A: Domains Folder (Common)
```
/home/giduduorg/domains/api.gidudu.org/public_html
/home/giduduorg/domains/new.gidudu.org/public_html
```

To access: Navigate UP one level from `public_html` to see the `domains/` folder

### Option B: Subdirectories in public_html (Alternative)
```
/home/giduduorg/public_html/api/
/home/giduduorg/public_html/new/
```

### Option C: Subdomains Folder
```
/home/giduduorg/subdomains/api.gidudu.org/public_html
/home/giduduorg/subdomains/new.gidudu.org/public_html
```

**How to find out**: See "Finding Your Subdomain Paths" section below

---

## Finding Your Subdomain Paths

### Method 1: Navigate Up in FileZilla

1. You're currently in: `/home/giduduorg/public_html` (WordPress)
2. In FileZilla's remote site panel, look for `..` (parent directory) at the top
3. Double-click `..` to go up one level to `/home/giduduorg/`
4. Look for folders: `domains/`, `subdomains/`, or just see if `api/` and `new/` are there
5. Navigate into the appropriate folder

### Method 2: Manually Type Path in FileZilla

1. In FileZilla's remote site path bar (top of right pane)
2. Delete current path and type: `/home/giduduorg/domains/`
3. Press Enter - if it exists, you'll see your subdomain folders
4. If not, try: `/home/giduduorg/subdomains/`
5. Or try: `/home/giduduorg/` to see all available folders

### Method 3: Check DirectAdmin

1. Log into DirectAdmin panel
2. Go to **Subdomain Management**
3. Click on `api.gidudu.org` or `new.gidudu.org`
4. Look for "Document Root" or "Directory" - this shows the exact path
5. Use that path in FileZilla

### Method 4: Use Command Line FTP to Explore

```cmd
ftp gidudu.org
User: 3bsgidudu@gidudu.org
Password: 9UY7cwkLDetTvcBaMEVw

ftp> pwd
# Shows: /home/giduduorg/public_html

ftp> cd ..
ftp> pwd
# Shows: /home/giduduorg/

ftp> ls
# Lists all available directories

ftp> cd domains
ftp> ls
# If exists, shows: api.gidudu.org, new.gidudu.org folders
```

---

## Method 1: Using FileZilla (Recommended)

### Download FileZilla
- Download from: https://filezilla-project.org/download.php?type=client
- Install the client version (free)

### Connect to Server

1. Open FileZilla
2. Click **File → Site Manager** (Ctrl+S)
3. Click **New Site**, name it "Gidudu Server"
4. Configure:
   - **Protocol**: FTP (or SFTP if available)
   - **Host**: gidudu.org
   - **Port**: 21 (FTP) or 22 (SFTP)
   - **Encryption**: Use explicit FTP over TLS if available
   - **Logon Type**: Normal
   - **User**: 3bsgidudu@gidudu.org
   - **Password**: xDjEthySG6BBpw6ZnPZy
   - **Initial Remote Directory**: Leave blank (defaults to /domains/)
5. Click **Connect**

**After connecting**, you'll land in `/home/giduduorg/domains/` - Perfect!
- You should immediately see folders: `api.gidudu.org/` and `new.gidudu.org/`
- No need to navigate up - you're already in the right place!

### Deploy Backend to api.gidudu.org

1. After connecting, you're already in `/home/giduduorg/domains/`
2. Double-click the `api.gidudu.org/` folder
3. Double-click the `public_html/` folder inside it
4. You're now in: `/home/giduduorg/domains/api.gidudu.org/public_html`
5. On your local computer (left pane), navigate to: `C:\Users\DELL\gidudu\server`
3. Select these local files/folders:
   - `server.js`
   - `package.json`
   - `admin/` folder
   - `data/` folder
   - `uploads/` folder
   - `README.md`
   - `SECURITY_SETUP.md`
4. Right-click → Upload
5. Wait for transfer to complete

### Deploy Frontend to new.gidudu.org

1. From `/home/giduduorg/domains/`, double-click `new.gidudu.org/` folder
2. Double-click the `public_html/` folder inside it
3. You're now in: `/home/giduduorg/domains/new.gidudu.org/public_html`
4. On your local computer, navigate to: `C:\Users\DELL\gidudu`
3. Select and upload:
   - All `.html` files
   - `css/` folder
   - `js/` folder
   - `images/` folder
   - `robots.txt`
   - `sitemap.xml`
4. Right-click → Upload
5. **Do NOT upload** the `server/` folder here

---

## Method 2: Using WinSCP

### Download WinSCP
- Download from: https://winscp.net/eng/download.php
- Free and portable

### Connect to Server

1. Open WinSCP
2. New Session:
   - **File protocol**: FTP (or SFTP)
   - **Host name**: gidudu.org
   - **Port**: 21
   - **User name**: 3bsgidudu@gidudu.org
   - **Password**: xDjEthySG6BBpw6ZnPZy
3. Click **Login**

### Upload Files
- Same process as FileZilla
- Navigate to subdomain paths
- Drag and drop files from left (local) to right (remote)

---

## Method 3: Using Windows Command Line FTP

### Connect via Command Prompt

```cmd
ftp gidudu.org
```
Enter username: `3bsgidudu@gidudu.org`
Enter password: `xDjEthySG6BBpw6ZnPZy`

### Basic FTP Commands

```ftp
# Navigate directories
cd /home/giduduorg/domains/api.gidudu.org/public_html

# List files
ls

# Upload single file
put server.js

# Upload multiple files
mput *.html

# Create directory
mkdir uploads

# Change local directory
lcd C:\Users\DELL\gidudu\server

# Quit
bye
```

**Note**: Command line FTP doesn't support recursive folder uploads easily. Use FileZilla for folders.

---

## After Upload: Set File Permissions

### Via FTP Client (FileZilla/WinSCP)

Right-click file/folder → File Permissions (or File Attributes)

**Backend (api.gidudu.org):**
- `server.js`: 755
- `admin/` folder: 755 (recursive)
- `uploads/` folder: 777 (recursive)
- `data/` folder: 755
- `data/*.json` files: 666

**Frontend (new.gidudu.org):**
- All `.html` files: 644
- `css/` folder: 755
- `js/` folder: 755
- `images/` folder: 755

### Via SSH (if available)

```bash
# Backend permissions
cd /home/giduduorg/domains/api.gidudu.org/public_html
chmod 755 server.js
chmod -R 755 admin/
chmod -R 777 uploads/
chmod -R 666 data/*.json

# Frontend permissions
cd /home/giduduorg/domains/new.gidudu.org/public_html
find . -type f -name "*.html" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

---

## Post-Upload Checklist

### Backend (api.gidudu.org)

- [ ] All files uploaded to `/domains/api.gidudu.org/public_html/`
- [ ] File permissions set correctly
- [ ] Go to DirectAdmin → Node.js Selector
- [ ] Create/Configure Node.js application
- [ ] Set environment variables (JWT_SECRET, PORT, NODE_ENV)
- [ ] Run `npm install` via DirectAdmin terminal
- [ ] Start the application
- [ ] Test: Visit `https://api.gidudu.org/api/health`

### Frontend (new.gidudu.org)

- [ ] All files uploaded to `/domains/new.gidudu.org/public_html/`
- [ ] Update `sitemap.xml` URLs to new.gidudu.org
- [ ] Update `robots.txt` sitemap URL
- [ ] Test: Visit `https://new.gidudu.org`
- [ ] Verify hero slideshow loads
- [ ] Test navigation between pages

---

## Troubleshooting FTP Issues

### Cannot Connect
- Try using `ftp.gidudu.org` as host instead of `gidudu.org`
- Verify DirectAdmin hasn't blocked your IP
- Try SFTP (port 22) instead of FTP (port 21)
- Check if passive mode is enabled in FTP client

### Permission Denied
- Check FTP user has access to subdomain directories
- You may need to upload via main domain and navigate to subdomain paths

### Subdomain Paths Not Found
If `/home/giduduorg/domains/api.gidudu.org/` doesn't exist, subdomains might be at:
```
/home/giduduorg/public_html/api/
/home/giduduorg/public_html/new/
```
Or check DirectAdmin → Subdomain Management for actual paths.

### Upload Fails for Large Files
- Use binary mode: `type binary` in command line FTP
- In FileZilla: Transfer → Transfer Type → Binary
- Check disk quota in DirectAdmin

---

## Quick Deploy Commands (FileZilla)

### Backend
1. Connect to FTP
2. Navigate remote: `/home/giduduorg/domains/api.gidudu.org/public_html`
3. Navigate local: `C:\Users\DELL\gidudu\server`
4. Select all → Upload

### Frontend
1. Navigate remote: `/home/giduduorg/domains/new.gidudu.org/public_html`
2. Navigate local: `C:\Users\DELL\gidudu`
3. Select: `*.html`, `css/`, `js/`, `images/`, `robots.txt`, `sitemap.xml`
4. Upload (exclude `server/` folder)

---

## Security Reminders

- **Change FTP password** after initial setup (DirectAdmin → FTP Management)
- Use **SFTP (port 22)** instead of FTP (port 21) when possible
- **Never commit** FTP credentials to Git
- Consider using **SSH keys** for authentication instead of password
- Enable **two-factor authentication** in DirectAdmin if available

---

## Next Steps After Upload

1. **Install Node.js Dependencies**
   - DirectAdmin → Node.js Selector → Your App → Run NPM Install

2. **Setup Environment Variables**
   - Generate JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Add in DirectAdmin → Node.js Selector → Environment Variables

3. **Create Admin User**
   - See DEPLOYMENT_GUIDE.md Step 6 for bcrypt hash generation

4. **Start Backend Application**
   - DirectAdmin → Node.js Selector → Start

5. **Test Everything**
   - Backend: `https://api.gidudu.org/admin/`
   - Frontend: `https://new.gidudu.org`

---

## Need Help?

- **FileZilla Guide**: https://wiki.filezilla-project.org/FileZilla_Client_Tutorial_(en)
- **WinSCP Guide**: https://winscp.net/eng/docs/guides
- **DirectAdmin Docs**: Check your hosting provider's knowledge base

**Remember**: You're uploading to testing environments (api and new subdomains). Your production gidudu.org site remains untouched!
