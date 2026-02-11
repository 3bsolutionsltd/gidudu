// Quick test to verify if CORS is configured correctly
// Run this locally to test your code before deploying

const express = require('express');
const cors = require('cors');

const app = express();

// This is the CORS config that should be in your production server.js
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
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            console.log('✅ CORS ALLOWED:', origin);
            callback(null, true);
        } else {
            console.log('❌ CORS BLOCKED:', origin);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'CORS is configured correctly',
        origin: req.headers.origin || 'no-origin-header'
    });
});

// Ambassadors test endpoint
app.get('/api/ambassadors', (req, res) => {
    res.json([
        { id: 1, name: "Test Ambassador", location: "Test Location" }
    ]);
});

const PORT = 3001; // Use different port to avoid conflict
app.listen(PORT, () => {
    console.log(`\n🧪 Test server running on http://localhost:${PORT}`);
    console.log('\n📋 Allowed Origins:');
    allowedOrigins.forEach(origin => console.log(`   ✅ ${origin}`));
    console.log('\n🔗 Test URLs:');
    console.log(`   http://localhost:${PORT}/api/test`);
    console.log(`   http://localhost:${PORT}/api/ambassadors\n`);
});
