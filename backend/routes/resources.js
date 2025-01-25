const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Get all resources
router.get('/', (req, res) => {
  const query = 'SELECT * FROM resources';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An internal server error occurred.");
    }
    res.json(results);
  });
});

// Get resource by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send("Invalid resource ID.");
  }

  const query = 'SELECT * FROM resources WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An internal server error occurred.");
    }
    if (results.length === 0) {
      return res.status(404).send("Resource not found.");
    }
    res.json(results[0]);
  });
});

// Update resource status
router.put('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (isNaN(id)) {
    return res.status(400).send("Invalid resource ID.");
  }

  const allowedStatuses = ["Available", "In Use", "Maintenance"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).send("Invalid status value.");
  }

  const query = 'UPDATE resources SET status = ? WHERE id = ?';
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Failed to update resource status.");
    }
    if (results.affectedRows === 0) {
      return res.status(404).send("Resource not found.");
    }
    res.send("Resource status updated successfully.");
  });
});

module.exports = router;
