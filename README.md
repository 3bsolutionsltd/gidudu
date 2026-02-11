# IGFM Website - International Great Faith Ministries

Modern, responsive website for International Great Faith Ministries (IGFM) - Transforming lives in Uganda through faith, care, and compassion.

🌐 **Production Site:** https://new.gidudu.org  
🔗 **Backend API:** https://api.gidudu.org  
📊 **Project Status:** ✅ LIVE AND OPERATIONAL

## About IGFM

International Great Faith Ministries is a non-denominational 501(c)(3) nonprofit organization bringing hope to unreached communities in Uganda and beyond through:
- **Berakhah Childcare** - Serving 5,000+ children
- **Church Planting** - Establishing churches in remote villages
- **Pastor Training** - Supporting 1,000+ rural pastors
- **Berakhah Hospital** - Life-saving medical care for vulnerable communities
- **Healthcare** - Berakhah Clinic serving communities
- **Education** - Berakhah School nurturing future leaders
- **Widows & Elderly Care** - Supporting 700+ vulnerable individuals

## Features

### Production Features
- ✅ **Production Deployment**: Live on https://new.gidudu.org with backend API at https://api.gidudu.org
- ✅ **Ambassador Management System**: Dynamic ambassador profiles loaded from backend CMS
- ✅ **Contact Form Integration**: Functional contact form with email API and professional notifications
- ✅ **Children Sponsorship Data**: Backend management for child sponsorship program
- ✅ **Secure Backend API**: JWT authentication, rate limiting, CORS protection, helmet security
- ✅ **Modern Design**: Clean, contemporary design with smooth animations
- ✅ **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- ✅ **Professional Forms**: Dynamic sponsorship forms with auto-population
- ✅ **Fast Performance**: Lightweight code with optimized loading
- ✅ **SEO Optimized**: Semantic HTML and meta tags for better search visibility
- ✅ **Interactive**: Smooth scrolling, animated elements, and professional UI feedback

## Sections

1. **Hero Section**: Eye-catching landing with call-to-action buttons
2. **Mission Statement**: Clear presentation of organizational mission
3. **About Section**: Organization overview with impact statistics
4. **Programs**: Six main programs with detailed cards
   - Berakhah Childcare
   - Berakhah School
   - Berakhah Clinic
   - Church Planting
   - Pastors Network Uganda
   - Widows & Elderly Care
5. **Berakhah Hospital**: Life-saving healthcare for vulnerable communities
6. **Berakhah Choir**: Showcase of children's choir ministry
7. **Call2Prayer Church**: Local church information
8. **Impact Metrics**: Animated statistics showing organizational impact
9. **Donation Section**: Multiple giving options
10. **Sponsorship**: Child sponsorship program details
11. **Volunteer**: Opportunities to serve
12. **Contact**: Contact information and form
13. **Footer**: Complete navigation and social links

## Technologies Used

### Frontend
- HTML5 (Semantic markup)
- CSS3 (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript (ES6+)
- Google Fonts (Inter & Poppins)
- Font Awesome Icons

### Backend (Production)
- **Runtime**: Node.js v20.10.0
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: nodemailer (SMTP integration)
- **Security**: 
  - helmet (HTTP headers security)
  - express-rate-limit (DDoS protection)
  - CORS (Cross-Origin Resource Sharing)
  - bcryptjs (Password hashing)
- **Storage**: JSON-based data storage
- **File Handling**: Multer (file uploads)

### Hosting & Infrastructure
- **Shared Hosting**: Reverse proxy (Apache/LiteSpeed)
- **Production URLs**:
  - Frontend: https://new.gidudu.org
  - Backend API: https://api.gidudu.org
- **Environment**: Production with secure JWT secrets
- **Deployment**: FTP with hosting control panel configuration

## Installation & Setup

### Production Deployment (Current Live Site)

**Status:** ✅ Deployed and operational at https://new.gidudu.org

The production site is already configured with:
- Backend API running on https://api.gidudu.org
- Node.js v20.10.0 with all dependencies installed
- Environment variables configured via hosting control panel
- CORS enabled for production domain
- Trust proxy configured for shared hosting
- Email integration with graceful error handling

**Production Documentation:**
- See [server/DEPLOYMENT_STEPS.md](server/DEPLOYMENT_STEPS.md) for deployment guide
- See [server/PRODUCTION_EMAIL_SETUP.md](server/PRODUCTION_EMAIL_SETUP.md) for email configuration

### Local Development Setup

**Prerequisites:**
- Node.js 16+ installed
- Git for version control
- Text editor (VS Code recommended)

**Step 1: Clone Repository**
```bash
git clone https://github.com/3bsolutionsltd/gidudu.git
cd gidudu
```

**Step 2: Install Backend Dependencies**
```bash
cd server
npm install
```

**Step 3: Configure Environment**
```bash
# Create .env file in server directory
cp .env.example .env

# Edit .env and set your values:
# JWT_SECRET=your_secure_random_secret_here
# NODE_ENV=development
# EMAIL_HOST=mail.gidudu.org
# EMAIL_PORT=465
# EMAIL_SECURE=true
# EMAIL_USER=noreply@gidudu.org
# EMAIL_PASS=your_email_password
```

**Step 4: Start Backend Server**
```bash
npm start
# Server runs on http://localhost:3000
```

**Step 5: Open Frontend**
```bash
# In project root, open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

**Step 6: Access Admin Panel (Optional)**
- URL: http://localhost:3000/admin
- Username: `admin`
- Password: `admin123` (change in production!)

📖 **Detailed Guides:**
- [CMS_GUIDE.md](CMS_GUIDE.md) - Content management instructions
- [SPONSORSHIP_CMS_GUIDE.md](SPONSORSHIP_CMS_GUIDE.md) - Sponsorship system guide

## API & Content Management

### Production API Endpoints

**Base URL:** https://api.gidudu.org

#### Public Endpoints
- `GET /api/health` - API health check
- `GET /api/ambassadors` - Get all ambassador profiles
- `GET /api/children` - Get all children profiles
- `GET /api/children/:id` - Get specific child profile
- `POST /api/contact` - Submit contact form

#### Protected Endpoints (Require JWT)
- `POST /api/auth/login` - Admin authentication
- `POST /api/ambassadors` - Create new ambassador
- `PUT /api/ambassadors/:id` - Update ambassador
- `DELETE /api/ambassadors/:id` - Delete ambassador
- `POST /api/children` - Create new child profile
- `PUT /api/children/:id` - Update child profile
- `DELETE /api/children/:id` - Delete child profile

### Ambassador Management
The website features 5 authentic ambassador testimonies:
1. **Phyllis Stewart** - Texas
2. **Jim and Nancy** - Colorado
3. **Ann and Steve McKinley** - Ohio
4. **Benjamin and Sheila Burum** - Houston
5. **Trina Ryan** - Ohio

Ambassadors are dynamically loaded from the API and displayed on the [ambassadors page](https://new.gidudu.org/ambassadors.html).

### Contact Form
- Integrated with backend API
- Professional notification system (no popups)
- Email sending with timeout protection
- Graceful error handling with fallback contact information

For full API documentation, see [server/README.md](server/README.md)

## Customization

### Colors
Edit the CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... more colors */
}
```

### Images
Replace placeholder images in the `images` folder:
- `about.jpg` - About section image
- `choir.jpg` - Choir section image
- `church.jpg` - Church section image

### Content
Edit the text content directly in `index.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

## Project Structure

```
gidudu/
├── index.html              # Main landing page
├── ambassadors.html        # Ambassador profiles page
├── sponsor.html            # Sponsorship program page
├── child.html             # Individual child profile page
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── script.js          # Main JavaScript with contact form
│   ├── ambassador-loader.js  # Ambassador dynamic loading
│   ├── sponsor-loader.js  # Sponsorship form logic
│   ├── cms-loader.js      # CMS content loading
│   └── nav-loader.js      # Navigation system
├── images/                # Frontend images and assets
├── server/                # Backend API
│   ├── server.js          # Express server with all API endpoints
│   ├── package.json       # Node.js dependencies
│   ├── .env              # Environment variables (not in git)
│   ├── data/             # JSON data storage
│   │   ├── ambassadors.json
│   │   ├── children.json
│   │   └── users.json
│   ├── uploads/          # Uploaded files
│   └── admin/            # Admin panel (if implemented)
├── docs/                  # Documentation
└── README.md             # This file
```

## Security Notes

- JWT authentication protects admin endpoints
- Password hashing with bcryptjs
- Rate limiting prevents API abuse (100 requests per 15 minutes)
- Helmet.js sets security HTTP headers
- CORS restricted to production domains only
- Trust proxy configured for X-Forwarded-For validation
- Environment variables never committed to git
- Secure JWT_SECRET (64-character cryptographic random)

## Project Status & Roadmap

### ✅ Completed Features
- [x] Backend CMS system with API
- [x] Ambassador management and profiles (5 profiles live)
- [x] Children sponsorship data management
- [x] Contact form with email integration
- [x] Production deployment (new.gidudu.org, api.gidudu.org)
- [x] Security configuration (CORS, helmet, rate limiting, JWT)
- [x] Professional UI with styled notifications
- [x] Responsive design optimization
- [x] Error handling and timeout protection
- [x] Trust proxy for shared hosting environment

### 🔄 In Progress / Known Issues
- ⚠️ Email server timeout (mail.gidudu.org:465 unreachable from hosting)
  - Currently gracefully handled with fallback contact
  - Options: Contact hosting support, switch to SendGrid/Mailgun, or accept current behavior
- 🎥 Missing hero video (hero-video.mp4) - minor, non-critical

### 📋 Future Enhancements
- [ ] Fix email SMTP connectivity (contact hosting or switch to API-based service)
- [ ] Upload hero video content
- [ ] Programs management via CMS admin panel
- [ ] Children profiles management via admin panel
- [ ] Image gallery section
- [ ] Stripe/PayPal donation integration
- [ ] Blog section with CMS management
- [ ] Language translation (Spanish, Luganda)
- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] CDN integration for faster asset delivery
- [ ] Advanced analytics dashboard

### 📊 Production Monitoring
- Health check: https://api.gidudu.org/api/health
- Status: All systems operational
- Uptime: Monitored via hosting control panel

## Contributing

This is a private project for International Great Faith Ministries. For questions or contributions, contact the development team.

## Credits

**Development:** 3B Solutions Ltd with GitHub Copilot  
**Content:** International Great Faith Ministries  
**Ministry Leadership:** Pastor Paul Musoke (Founder & President)  
**Based on:** gidudu.org legacy website

## Support

For technical support or questions:
- **Email:** paul@gidudu.org
- **Website:** https://new.gidudu.org
- **API Status:** https://api.gidudu.org/api/health

## License

© 2025 International Great Faith Ministries. All rights reserved.

---

**Last Updated:** February 11, 2026  
**Version:** 2.0 (Production Release)  
**Status:** ✅ Live and Operational
