const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all projects
router.get('/', (req, res) => {
  const query = 'SELECT id, name FROM projects';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results); 
  });
});

module.exports = router;
