const express = require('express');
const db = require('../config/db'); // Import the database connection pool
const router = express.Router();

// ✅ Get all projects (async/await)
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, name FROM projects');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
