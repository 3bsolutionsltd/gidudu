# IGFM Website - International Great Faith Ministries

Modern, responsive website for International Great Faith Ministries (IGFM) - Transforming lives in Uganda through faith, care, and compassion.

🌐 **Live Site:** https://3bsolutionsltd.github.io/gidudu/

## About IGFM

International Great Faith Ministries is a non-denominational 501(c)(3) nonprofit organization bringing hope to unreached communities in Uganda and beyond through:
- **Berakhah Childcare** - Serving 5,000+ children
- **Church Planting** - Establishing churches in remote villages
- **Pastor Training** - Supporting 1,000+ rural pastors
- **Healthcare** - Berakhah Clinic serving communities
- **Education** - Berakhah School nurturing future leaders
- **Widows & Elderly Care** - Supporting 700+ vulnerable individuals

## Features

- **Dynamic Content Management**: Backend CMS for easy content updates (no coding required!)
- **Modern Design**: Clean, contemporary design with smooth animations
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Hero Slideshow**: Dynamic video/image slideshow managed through admin panel
- **Professional Forms**: Dynamic sponsorship forms with auto-population
- **Fast Performance**: Lightweight code with lazy loading for images
- **SEO Optimized**: Semantic HTML and meta tags for better search visibility
- **Accessible**: WCAG compliant with proper ARIA labels
- **Interactive**: Smooth scrolling, animated counters, and parallax effects

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
5. **Berakhah Choir**: Showcase of children's choir ministry
6. **Call2Prayer Church**: Local church information
7. **Impact Metrics**: Animated statistics showing organizational impact
8. **Donation Section**: Multiple giving options
9. **Sponsorship**: Child sponsorship program details
10. **Volunteer**: Opportunities to serve
11. **Contact**: Contact information and form
12. **Footer**: Complete navigation and social links

## Technologies Used

### Frontend
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript
- Google Fonts (Inter & Poppins)
- Font Awesome Icons

### Backend (NEW!)
- Node.js + Express
- JWT Authentication
- Multer (File Uploads)
- bcryptjs (Password Security)
- JSON-based Data Storage

## Installation

### Quick Start (Frontend Only)
1. Clone or download this repository
2. Open `index.html` in your web browser
3. No build process required - pure HTML/CSS/JS

### Full Setup (With CMS Backend)

**Prerequisites:**
- Node.js 16+ installed
- Python 3.x for frontend dev server

**Step 1: Install Backend Dependencies**
```bash
cd server
npm install
```

**Step 2: Configure Environment**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env and set your JWT_SECRET
```

**Step 3: Start Backend Server**
```bash
npm start
# Server runs on http://localhost:3000
```

**Step 4: Start Frontend Server**
```bash
# In project root (new terminal)
python -m http.server 8000
# Website runs on http://localhost:8000
```

**Step 5: Access Admin Panel**
- URL: http://localhost:3000/admin
- Username: `admin`
- Password: `admin123`

📖 **Detailed CMS Guide**: See [CMS_GUIDE.md](CMS_GUIDE.md) for complete instructions

## Content Management

### Managing Hero Slideshow
1. Login to admin panel at http://localhost:3000/admin
2. Upload videos (MP4, WEBM, MOV) or images (JPEG, PNG, GIF)
3. Add titles and subtitles
4. Toggle slides active/inactive
5. Changes appear automatically on website!

### API Endpoints
- `GET /api/hero` - Get all hero slides (public)
- `POST /api/hero` - Upload new slide (requires auth)
- `PUT /api/hero/:id` - Update slide (requires auth)
- `DELETE /api/hero/:id` - Delete slide (requires auth)

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

## Future Enhancements

- [x] ✅ Backend CMS system
- [x] ✅ Dynamic hero slideshow
- [x] ✅ Professional sponsorship forms
- [ ] Programs management via CMS
- [ ] Children profiles management
- [ ] Add image gallery
- [ ] Implement actual donation integration (Stripe/PayPal)
- [ ] Add blog section
- [ ] Integrate email service for contact form
- [ ] Add language translation
- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] Image optimization and CDN integration

## Credits

Design and Development: GitHub Copilot
Based on content from: gidudu.org

## License

© 2025 International Great Faith Ministries. All rights reserved.
