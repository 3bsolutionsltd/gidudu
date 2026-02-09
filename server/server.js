const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Already set in HTML
    crossOriginEmbedderPolicy: false
}));

// Rate limiting for login attempts
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per minute
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});

// CORS Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://new.gidudu.org', 'https://gidudu.org', 'https://3bsolutionsltd.github.io', 'https://api.gidudu.org']
        : '*',
    credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'CMS API is running',
        timestamp: new Date().toISOString()
    });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Ensure data and uploads directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|webm|mov/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type. Only images and videos allowed.'));
    }
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
};

// Helper functions for data management
const getDataFile = (filename) => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const saveDataFile = (filename, data) => {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Initialize default data files
const initializeData = () => {
    // Hero slideshow data
    if (!fs.existsSync(path.join(dataDir, 'hero.json'))) {
        saveDataFile('hero.json', {
            slides: [
                {
                    id: 1,
                    type: 'video',
                    src: '/images/hero-video.mp4',
                    title: 'Transforming Lives',
                    subtitle: 'Through Faith and Action',
                    active: true
                }
            ]
        });
    }

    // Admin users
    if (!fs.existsSync(path.join(dataDir, 'users.json'))) {
        const hashedPassword = bcrypt.hashSync('admin123', 10);
        saveDataFile('users.json', {
            users: [
                {
                    id: 1,
                    username: 'admin',
                    password: hashedPassword,
                    email: 'admin@igfm.org'
                }
            ]
        });
    }

    // Programs data
    if (!fs.existsSync(path.join(dataDir, 'programs.json'))) {
        saveDataFile('programs.json', {
            programs: []
        });
    }
};

initializeData();

// ============= AUTH ROUTES =============

// Login with validation and rate limiting
app.post('/api/auth/login', 
    loginLimiter,
    [
        body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3, max: 50 }),
        body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 })
    ],
    async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const { username, password } = req.body;
        const usersData = getDataFile('users.json');
        
        const user = usersData.users.find(u => u.username === username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email 
            } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= CONTACT FORM ROUTE =============

// Contact form submission
app.post('/api/contact',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('subject').trim().notEmpty().withMessage('Subject is required'),
        body('message').trim().notEmpty().withMessage('Message is required')
    ],
    async (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const { name, email, subject, message } = req.body;
        
        // Create email transporter
        const transporter = nodemailer.createTransporter({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: ['paul@gidudu.org', 'igfm@gidudu.org'],
            replyTo: email,
            subject: `IGFM Website Contact: ${subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p style="color: #666; font-size: 0.9em;">This message was sent via the IGFM website contact form.</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            success: true, 
            message: 'Your message has been sent successfully!' 
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.',
            details: error.message 
        });
    }
});

// ============= CHILDREN ROUTES =============

// Get all children
app.get('/api/children', (req, res) => {
    try {
        const childrenData = getDataFile('children.json');
        if (!childrenData) {
            return res.status(404).json({ error: 'Children data not found' });
        }
        res.json(childrenData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single child by ID
app.get('/api/children/:id', (req, res) => {
    try {
        const childrenData = getDataFile('children.json');
        if (!childrenData) {
            return res.status(404).json({ error: 'Children data not found' });
        }
        
        const child = childrenData.children.find(c => c.id === req.params.id);
        if (!child) {
            return res.status(404).json({ error: 'Child not found' });
        }
        
        res.json(child);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= HERO SLIDESHOW ROUTES =============

// Get all hero slides
app.get('/api/hero', (req, res) => {
    try {
        const heroData = getDataFile('hero.json');
        res.json(heroData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new hero slide with validation
app.post('/api/hero', 
    authenticateToken, 
    upload.single('file'),
    [
        body('title').trim().isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
        body('subtitle').trim().isLength({ max: 300 }).withMessage('Subtitle must be 300 characters or less'),
        body('type').isIn(['image', 'video']).withMessage('Type must be either image or video')
    ],
    (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const heroData = getDataFile('hero.json');
        const { title, subtitle, type } = req.body;
        
        const newSlide = {
            id: Date.now(),
            type: type || 'image',
            src: req.file ? `/uploads/${req.file.filename}` : '',
            title: title || '',
            subtitle: subtitle || '',
            active: true,
            createdAt: new Date().toISOString()
        };

        heroData.slides.push(newSlide);
        saveDataFile('hero.json', heroData);
        
        res.json(newSlide);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update hero slide with validation
app.put('/api/hero/:id', 
    authenticateToken,
    [
        body('title').optional().trim().isLength({ max: 200 }).withMessage('Title must be 200 characters or less'),
        body('subtitle').optional().trim().isLength({ max: 300 }).withMessage('Subtitle must be 300 characters or less'),
        body('active').optional().isBoolean().withMessage('Active must be a boolean')
    ],
    (req, res) => {
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const heroData = getDataFile('hero.json');
        const slideIndex = heroData.slides.findIndex(s => s.id === parseInt(req.params.id));
        
        if (slideIndex === -1) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        heroData.slides[slideIndex] = {
            ...heroData.slides[slideIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        saveDataFile('hero.json', heroData);
        res.json(heroData.slides[slideIndex]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete hero slide
app.delete('/api/hero/:id', authenticateToken, (req, res) => {
    try {
        const heroData = getDataFile('hero.json');
        const slideIndex = heroData.slides.findIndex(s => s.id === parseInt(req.params.id));
        
        if (slideIndex === -1) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        // Delete associated file
        const slide = heroData.slides[slideIndex];
        if (slide.src && slide.src.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, slide.src);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        heroData.slides.splice(slideIndex, 1);
        saveDataFile('hero.json', heroData);
        
        res.json({ message: 'Slide deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= FILE UPLOAD ROUTE =============

app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        res.json({
            filename: req.file.filename,
            path: `/uploads/${req.file.filename}`,
            mimetype: req.file.mimetype,
            size: req.file.size
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= ADMIN PANEL ROUTE =============

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 IGFM CMS Server running on port ${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
});
