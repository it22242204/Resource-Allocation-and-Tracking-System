const express = require('express');
const db = require('../config/db'); // Import the database connection pool
const router = express.Router();

// ✅ Get all resources (async/await)
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM resources');
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("An internal server error occurred.");
    }
});

// ✅ Get resource by ID (async/await)
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).send("Invalid resource ID.");
    }

    try {
        const [results] = await db.query('SELECT * FROM resources WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).send("Resource not found.");
        }
        res.json(results[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("An internal server error occurred.");
    }
});

// ✅ Update resource status (async/await)
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (isNaN(id)) {
        return res.status(400).send("Invalid resource ID.");
    }

    const allowedStatuses = ["Available", "In Use", "Maintenance"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).send("Invalid status value.");
    }

    try {
        const [results] = await db.query('UPDATE resources SET status = ? WHERE id = ?', [status, id]);

        if (results.affectedRows === 0) {
            return res.status(404).send("Resource not found.");
        }
        res.send("Resource status updated successfully.");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to update resource status.");
    }
});

module.exports = router;
