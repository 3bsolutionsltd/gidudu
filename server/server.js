const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
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

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        
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

// Add new hero slide
app.post('/api/hero', authenticateToken, upload.single('file'), (req, res) => {
    try {
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

// Update hero slide
app.put('/api/hero/:id', authenticateToken, (req, res) => {
    try {
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
app.listen(PORT, () => {
    console.log(`🚀 IGFM CMS Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`🔐 Default login: admin / admin123`);
});
