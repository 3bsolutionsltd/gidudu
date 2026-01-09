# IGFM Dynamic Content Management System - Quick Start Guide

## 🎉 What's New?

Your website now has a powerful backend CMS that allows you to dynamically manage content without editing code!

## 🚀 System Overview

### Frontend (Website)
- **URL**: http://localhost:8000
- **Tech**: HTML, CSS, JavaScript
- **Server**: Python HTTP server

### Backend (CMS)
- **URL**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Tech**: Node.js + Express
- **Default Login**: 
  - Username: `admin`
  - Password: `admin123`

## 📋 How to Use

### Starting the Servers

1. **Start Frontend** (in one terminal):
```bash
python -m http.server 8000
```

2. **Start Backend** (in another terminal):
```bash
cd server
npm start
```

Or for development with auto-restart:
```bash
cd server
npm run dev
```

### Managing Hero Slideshow

1. Open the admin panel: http://localhost:3000/admin
2. Login with the default credentials
3. Upload videos or images:
   - Click "Choose File"
   - Select your video (MP4, WEBM, MOV) or image (JPEG, PNG, GIF)
   - Add a title and subtitle (optional)
   - Click "Upload & Add Slide"
4. View your uploaded slides below
5. Toggle slides active/inactive using the toggle button
6. Delete slides you no longer need

### How It Works

1. **Admin uploads content** → Stored in `server/uploads/` folder
2. **Content info saved** → In `server/data/hero.json`
3. **Frontend fetches data** → From `http://localhost:3000/api/hero`
4. **Website displays dynamically** → Videos/images shown automatically

## 🎥 Hero Slideshow Features

### Single Slide
- If only one slide is active, it displays as a single video/image
- Title and subtitle update dynamically

### Multiple Slides
- If multiple slides are active, creates an automatic slideshow
- Transitions every 7 seconds
- Navigation controls (prev/next buttons)
- Dot indicators for each slide
- Smooth fade transitions

## 📁 File Structure

```
gidudu/
├── index.html              (Main website - updated with CMS integration)
├── css/
│   └── style.css          (Updated with slideshow styles)
├── js/
│   ├── script.js          (Original functionality)
│   └── cms-loader.js      (NEW - Fetches content from backend)
└── server/                (NEW - Backend CMS)
    ├── server.js          (Express server with API)
    ├── package.json       (Dependencies)
    ├── .env              (Configuration)
    ├── README.md         (Detailed backend docs)
    ├── admin/
    │   └── index.html    (Admin panel interface)
    ├── data/             (Content storage)
    │   ├── hero.json     (Hero slideshow data)
    │   ├── users.json    (Admin users)
    │   └── programs.json (Coming soon)
    └── uploads/          (Uploaded files)
```

## 🔐 Security

**IMPORTANT - Change Default Password:**

1. The default password is for initial setup only
2. After first login, immediately create a new admin account
3. For production, update these in `.env`:
   - Change `JWT_SECRET` to a random 32+ character string
   - Enable HTTPS
   - Use a proper database instead of JSON files

## 📡 API Endpoints

### Public Endpoints
- `GET /api/hero` - Get all hero slides (used by website)

### Protected Endpoints (Require Login)
- `POST /api/auth/login` - Login and get access token
- `POST /api/hero` - Upload new slide
- `PUT /api/hero/:id` - Update slide
- `DELETE /api/hero/:id` - Delete slide
- `POST /api/upload` - Upload file

## 🎨 Client Instructions

### Uploading Videos for Hero Section

1. Prepare your videos:
   - **Format**: MP4 (recommended), WEBM, or MOV
   - **Size**: Maximum 50 MB per file
   - **Aspect Ratio**: 16:9 (recommended)
   - **Resolution**: 1920x1080 or higher
   - **Duration**: 10-30 seconds works best

2. Go to http://localhost:3000/admin

3. Login (use provided credentials)

4. In the "Add New Slide" section:
   - Click "Choose File"
   - Select your video
   - Preview appears automatically
   - Add title (e.g., "Welcome to IGFM")
   - Add subtitle (e.g., "Transforming Lives Through Faith")
   - Click "Upload & Add Slide"

5. Your slide appears in "Current Slides" section
   - Green "Active" badge means it's visible on the website
   - Click toggle button to activate/deactivate
   - Click delete to remove

6. Visit http://localhost:8000 to see your changes live!

### Managing Multiple Videos

- You can upload multiple videos
- All active slides will rotate in a slideshow
- Use toggle buttons to control which slides are shown
- Reorder by uploading in your preferred sequence

## 🔧 Troubleshooting

### Backend won't start
- **Error**: "address already in use"
- **Solution**: Port 3000 is busy. Either:
  - Stop other Node.js processes
  - Or change PORT in `.env` file

### Frontend doesn't show new content
- **Problem**: Still seeing old video
- **Solution**: 
  - Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
  - Clear browser cache
  - Ensure backend is running on port 3000

### Upload fails
- **File too large**: Reduce file size or compress video
- **Wrong format**: Use MP4, WEBM, MOV for videos
- **No auth**: Make sure you're logged in

### Can't login to admin
- **Wrong credentials**: Use `admin` / `admin123`
- **Token expired**: Clear browser localStorage and login again

## 🚀 Future Enhancements

The CMS is designed to expand. Coming soon:
- [ ] Programs management (upload images, edit descriptions)
- [ ] Children profiles (add/edit sponsored children)
- [ ] Testimonials/Stories management
- [ ] Settings (contact info, social links)
- [ ] Image optimization and compression
- [ ] Analytics dashboard

## 📞 Support

If you encounter issues:
1. Check the terminal for error messages
2. Review the [Backend README](server/README.md) for detailed docs
3. Verify both servers are running
4. Check browser console (F12) for frontend errors

## 💡 Tips for Best Results

1. **Video Quality**: Use high-quality videos but compressed for web
2. **Consistency**: Keep similar style/tone across all slides
3. **Text**: Keep titles short (5-8 words), subtitles (10-15 words)
4. **Testing**: Always preview on the website after uploading
5. **Backups**: Keep original videos/images in a safe location

## 🎯 Quick Reference

| Task | URL/Command |
|------|-------------|
| View Website | http://localhost:8000 |
| Admin Panel | http://localhost:3000/admin |
| Start Frontend | `python -m http.server 8000` |
| Start Backend | `cd server && npm start` |
| Default Login | admin / admin123 |
| Upload Limit | 50 MB per file |

---

**Congratulations! Your website now has dynamic content management! 🎉**

The client can now update the hero section without touching any code. Simply upload videos/images through the admin panel, and they'll appear on the website automatically.
