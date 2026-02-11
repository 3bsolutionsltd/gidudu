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
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Production optimization: Enable gzip compression
app.use(compression());

// Production logging
if (IS_PRODUCTION) {
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            console.log(`${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`);
        });
        next();
    });
}

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

// CORS Middleware - Allow requests from production and development
const allowedOrigins = [
    'https://new.gidudu.org',
    'https://gidudu.org',
    'https://www.gidudu.org',
    'https://3bsolutionsltd.github.io',
    'https://api.gidudu.org',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, or curl)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint with system info
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'CMS API is running',
        timestamp: new Date().toISOString(),
        environment: IS_PRODUCTION ? 'production' : 'development',
        uptime: process.uptime()
    });
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Ensure data and uploads directories exist
const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const childrenImagesDir = path.join(__dirname, '..', 'all_children_images');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(childrenImagesDir)) fs.mkdirSync(childrenImagesDir, { recursive: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use children images folder for children endpoints, uploads for others
        const isChildrenRoute = req.path.includes('/children');
        const uploadPath = isChildrenRoute ? childrenImagesDir : uploadsDir;
        cb(null, uploadPath);
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
        
        // Validate email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email credentials not configured');
            console.error('EMAIL_USER:', process.env.EMAIL_USER ? 'SET' : 'NOT SET');
            console.error('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
            console.error('EMAIL_HOST:', process.env.EMAIL_HOST ? 'SET' : 'NOT SET');
            return res.status(500).json({ 
                error: 'Email service is not configured. Please contact us directly at paul@gidudu.org' 
            });
        }

        console.log('Email config:', {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            user: process.env.EMAIL_USER,
            secure: process.env.EMAIL_SECURE
        });

        // Create email transporter
        const emailPort = parseInt(process.env.EMAIL_PORT) || 587;
        const emailSecure = process.env.EMAIL_SECURE === 'true' || emailPort === 465;
        
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: emailPort,
            secure: emailSecure, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            tls: {
                rejectUnauthorized: IS_PRODUCTION // Strict in production, relaxed in development
            }
        });

        // Verify transporter configuration (non-blocking)
        transporter.verify()
            .then(() => {
                console.log('✅ Email server connection verified');
            })
            .catch((verifyError) => {
                console.warn('⚠️  Email server verification failed (will still attempt to send):', verifyError.message);
                console.warn('   Email may still work when actually sending. Error details:', {
                    code: verifyError.code,
                    command: verifyError.command
                });
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
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        res.status(500).json({ 
            error: 'Failed to send message. Please try again later.',
            details: IS_PRODUCTION ? undefined : {
                message: error.message,
                code: error.code,
                response: error.response
            }
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

// ============= AMBASSADORS ROUTES =============

// Get all ambassadors
app.get('/api/ambassadors', (req, res) => {
    try {
        const ambassadorsData = getDataFile('ambassadors.json');
        if (!ambassadorsData) {
            return res.status(404).json({ error: 'Ambassadors data not found' });
        }
        res.json(ambassadorsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single ambassador by ID
app.get('/api/ambassadors/:id', (req, res) => {
    try {
        const ambassadorsData = getDataFile('ambassadors.json');
        if (!ambassadorsData) {
            return res.status(404).json({ error: 'Ambassadors data not found' });
        }
        
        const ambassador = ambassadorsData.find(a => a.id === parseInt(req.params.id));
        if (!ambassador) {
            return res.status(404).json({ error: 'Ambassador not found' });
        }
        
        res.json(ambassador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new ambassador (protected)
app.post('/api/ambassadors', authenticateToken, upload.single('image'), [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('bio').trim().notEmpty().withMessage('Bio is required')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const ambassadorsData = getDataFile('ambassadors.json') || [];
        
        const newAmbassador = {
            id: ambassadorsData.length > 0 ? Math.max(...ambassadorsData.map(a => a.id)) + 1 : 1,
            name: req.body.name,
            location: req.body.location,
            image: req.file ? `/uploads/${req.file.filename}` : req.body.image || 'images/igfm-logo.png',
            bio: req.body.bio,
            quote: req.body.quote || ''
        };
        
        ambassadorsData.push(newAmbassador);
        saveDataFile('ambassadors.json', ambassadorsData);
        
        res.status(201).json(newAmbassador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update ambassador (protected)
app.put('/api/ambassadors/:id', authenticateToken, upload.single('image'), [
    body('name').optional().trim().notEmpty(),
    body('location').optional().trim().notEmpty(),
    body('bio').optional().trim().notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const ambassadorsData = getDataFile('ambassadors.json');
        if (!ambassadorsData) {
            return res.status(404).json({ error: 'Ambassadors data not found' });
        }
        
        const ambassadorIndex = ambassadorsData.findIndex(a => a.id === parseInt(req.params.id));
        if (ambassadorIndex === -1) {
            return res.status(404).json({ error: 'Ambassador not found' });
        }
        
        const updatedAmbassador = {
            ...ambassadorsData[ambassadorIndex],
            name: req.body.name || ambassadorsData[ambassadorIndex].name,
            location: req.body.location || ambassadorsData[ambassadorIndex].location,
            bio: req.body.bio || ambassadorsData[ambassadorIndex].bio,
            quote: req.body.quote !== undefined ? req.body.quote : ambassadorsData[ambassadorIndex].quote
        };
        
        if (req.file) {
            updatedAmbassador.image = `/uploads/${req.file.filename}`;
        }
        
        ambassadorsData[ambassadorIndex] = updatedAmbassador;
        saveDataFile('ambassadors.json', ambassadorsData);
        
        res.json(updatedAmbassador);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete ambassador (protected)
app.delete('/api/ambassadors/:id', authenticateToken, (req, res) => {
    try {
        const ambassadorsData = getDataFile('ambassadors.json');
        if (!ambassadorsData) {
            return res.status(404).json({ error: 'Ambassadors data not found' });
        }
        
        const ambassadorIndex = ambassadorsData.findIndex(a => a.id === parseInt(req.params.id));
        if (ambassadorIndex === -1) {
            return res.status(404).json({ error: 'Ambassador not found' });
        }
        
        const deletedAmbassador = ambassadorsData.splice(ambassadorIndex, 1)[0];
        saveDataFile('ambassadors.json', ambassadorsData);
        
        // Delete associated image file if it exists in uploads
        if (deletedAmbassador.image && deletedAmbassador.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, deletedAmbassador.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        res.json({ message: 'Ambassador deleted successfully', ambassador: deletedAmbassador });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new child
app.post('/api/children',
    authenticateToken,
    upload.single('image'),
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('birthday').trim().notEmpty().withMessage('Birthday is required'),
        body('age').isInt({ min: 0, max: 25 }).withMessage('Age must be between 0 and 25'),
        body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
        body('nationality').optional().trim(),
        body('location').optional().trim(),
        body('story').optional().trim(),
        body('dream').optional().trim()
    ],
    (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const childrenData = getDataFile('children.json');
        const { name, birthday, age, gender, nationality, location, story, dream } = req.body;
        
        // Generate ID from name
        const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Check if ID already exists
        if (childrenData.children.find(c => c.id === id)) {
            return res.status(400).json({ error: 'A child with this name already exists' });
        }

        const newChild = {
            id,
            name,
            birthday,
            age: parseInt(age),
            gender,
            nationality: nationality || 'Uganda',
            location: location || 'Uganda',
            image: req.file ? req.file.filename : '',
            story: story ? [story] : [],
            dream: dream || null
        };

        childrenData.children.push(newChild);
        saveDataFile('children.json', childrenData);
        
        res.status(201).json(newChild);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update child
app.put('/api/children/:id',
    authenticateToken,
    upload.single('image'),
    [
        body('name').optional().trim().notEmpty(),
        body('birthday').optional().trim().notEmpty(),
        body('age').optional().isInt({ min: 0, max: 25 }),
        body('gender').optional().isIn(['Male', 'Female']),
        body('nationality').optional().trim(),
        body('location').optional().trim(),
        body('story').optional().trim(),
        body('dream').optional().trim()
    ],
    (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const childrenData = getDataFile('children.json');
        const childIndex = childrenData.children.findIndex(c => c.id === req.params.id);
        
        if (childIndex === -1) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const updatedFields = { ...req.body };
        
        // Handle age conversion
        if (updatedFields.age) {
            updatedFields.age = parseInt(updatedFields.age);
        }
        
        // Handle story as array
        if (updatedFields.story) {
            updatedFields.story = [updatedFields.story];
        }
        
        // Handle image upload
        if (req.file) {
            updatedFields.image = req.file.filename;
        }

        childrenData.children[childIndex] = {
            ...childrenData.children[childIndex],
            ...updatedFields
        };

        saveDataFile('children.json', childrenData);
        res.json(childrenData.children[childIndex]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete child
app.delete('/api/children/:id', authenticateToken, (req, res) => {
    try {
        const childrenData = getDataFile('children.json');
        const childIndex = childrenData.children.findIndex(c => c.id === req.params.id);
        
        if (childIndex === -1) {
            return res.status(404).json({ error: 'Child not found' });
        }

        const deletedChild = childrenData.children.splice(childIndex, 1)[0];
        saveDataFile('children.json', childrenData);
        
        res.json({ message: 'Child deleted successfully', child: deletedChild });
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

// ============= SPONSORSHIP ROUTES =============

// Get sponsorship information
app.get('/api/sponsorship', (req, res) => {
    try {
        const sponsorshipData = getDataFile('sponsorship.json');
        if (!sponsorshipData) {
            return res.status(404).json({ error: 'Sponsorship data not found' });
        }
        res.json(sponsorshipData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update sponsorship information
app.put('/api/sponsorship', 
    authenticateToken,
    [
        body('header.title').optional().trim().isLength({ max: 200 }),
        body('header.description').optional().trim().isLength({ max: 1000 }),
        body('callToAction.title').optional().trim().isLength({ max: 200 }),
        body('callToAction.description').optional().trim().isLength({ max: 1000 })
    ],
    (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Invalid input', details: errors.array() });
        }

        const currentData = getDataFile('sponsorship.json') || {};
        const updatedData = {
            ...currentData,
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        saveDataFile('sponsorship.json', updatedData);
        res.json(updatedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update specific benefit
app.put('/api/sponsorship/benefits/:id', authenticateToken, (req, res) => {
    try {
        const sponsorshipData = getDataFile('sponsorship.json');
        const benefitIndex = sponsorshipData.benefits.findIndex(b => b.id === req.params.id);
        
        if (benefitIndex === -1) {
            return res.status(404).json({ error: 'Benefit not found' });
        }

        sponsorshipData.benefits[benefitIndex] = {
            ...sponsorshipData.benefits[benefitIndex],
            ...req.body,
            id: req.params.id // Ensure ID doesn't change
        };

        saveDataFile('sponsorship.json', sponsorshipData);
        res.json(sponsorshipData.benefits[benefitIndex]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update specific payment platform
app.put('/api/sponsorship/platforms/:id', authenticateToken, (req, res) => {
    try {
        const sponsorshipData = getDataFile('sponsorship.json');
        const platformIndex = sponsorshipData.paymentPlatforms.findIndex(p => p.id === req.params.id);
        
        if (platformIndex === -1) {
            return res.status(404).json({ error: 'Payment platform not found' });
        }

        sponsorshipData.paymentPlatforms[platformIndex] = {
            ...sponsorshipData.paymentPlatforms[platformIndex],
            ...req.body,
            id: req.params.id // Ensure ID doesn't change
        };

        saveDataFile('sponsorship.json', sponsorshipData);
        res.json(sponsorshipData.paymentPlatforms[platformIndex]);
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
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 IGFM CMS Server running on port ${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`💚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${IS_PRODUCTION ? 'production' : 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Closing server gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    if (IS_PRODUCTION) {
        process.exit(1);
    }
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (IS_PRODUCTION) {
        process.exit(1);
    }
});
