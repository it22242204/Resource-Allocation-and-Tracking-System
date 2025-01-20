const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all resources
router.get('/', (req, res) => {
  const query = 'SELECT * FROM resources';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get resource by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM resources WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).send('Resource not found');
    res.json(results[0]);
  });
});

// Update resource status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = 'UPDATE resources SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Resource status updated successfully');
  });
});

module.exports = router;
