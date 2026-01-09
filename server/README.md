# IGFM Backend CMS

Dynamic content management system for the IGFM website.

## Features

- **Hero Slideshow Management**: Upload and manage videos/images for the homepage hero section
- **JWT Authentication**: Secure admin access with token-based authentication
- **File Upload**: Support for images (JPEG, PNG, GIF) and videos (MP4, WEBM, MOV)
- **RESTful API**: Clean API endpoints for content management
- **Admin Panel**: User-friendly interface for managing content

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env`
- Update `JWT_SECRET` with a secure random string

4. Start the server:

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Default Credentials

- **Username**: admin
- **Password**: admin123

⚠️ **IMPORTANT**: Change the default password immediately after first login!

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token

### Hero Slideshow
- `GET /api/hero` - Get all hero slides (public)
- `POST /api/hero` - Upload new slide (requires auth)
- `PUT /api/hero/:id` - Update slide (requires auth)
- `DELETE /api/hero/:id` - Delete slide (requires auth)

### File Upload
- `POST /api/upload` - Upload a single file (requires auth)

## Admin Panel

Access the admin panel at: `http://localhost:3000/admin`

Features:
- Upload videos/images for hero slideshow
- View all uploaded slides
- Toggle slide active/inactive status
- Delete slides
- Preview media before uploading

## File Storage

- Uploaded files are stored in `server/uploads/`
- Content data is stored in JSON files in `server/data/`
  - `hero.json` - Hero slideshow slides
  - `users.json` - Admin users
  - `programs.json` - Programs (coming soon)

## Frontend Integration

The frontend automatically fetches content from the backend. Make sure both servers are running:

1. **Frontend** (Python server on port 8000):
```bash
python -m http.server 8000
```

2. **Backend** (Node.js on port 3000):
```bash
cd server
npm start
```

Then access:
- Website: `http://localhost:8000`
- Admin Panel: `http://localhost:3000/admin`

## Security Notes

1. Change the default admin password immediately
2. Use a strong, random JWT_SECRET in production
3. Enable HTTPS in production environments
4. Implement rate limiting for production
5. Consider using a proper database instead of JSON files for production

## Future Enhancements

- [ ] Programs management
- [ ] Children profiles management
- [ ] Image optimization and resizing
- [ ] CDN integration
- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Backup and restore functionality

## Troubleshooting

**Cannot connect to backend:**
- Ensure the server is running on port 3000
- Check if another application is using port 3000
- Verify firewall settings

**File upload fails:**
- Check file size (max 50MB)
- Verify file type (only images and videos allowed)
- Ensure uploads directory exists and is writable

**Authentication errors:**
- Clear browser localStorage
- Check JWT_SECRET is set in .env
- Verify token hasn't expired (24-hour validity)

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Multer** - File upload handling
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment configuration
