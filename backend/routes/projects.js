const express = require('express');
const db = require('../config/db'); 
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT id, name FROM projects');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

module.exports = router;
