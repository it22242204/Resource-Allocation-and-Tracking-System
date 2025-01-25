const express = require('express');
const db = require('../config/db');
const router = express.Router();

// Allocate a resource
router.post('/', (req, res) => {
  const { resourceId, projectId, startTime, endTime } = req.body;

  // Check for missing fields
  if (!resourceId || !projectId || !startTime || !endTime) {
    return res.status(400).send("Missing required fields.");
  }

  const query = 'INSERT INTO allocations (resource_id, project_id, start_time, end_time) VALUES (?, ?, ?, ?)';

  db.query(query, [resourceId, projectId, startTime, endTime], (err) => {
    if (err) {
      console.error("Database Error:", err); // Log the error
      return res.status(500).send("Database error while allocating resource.");
    }

    const updateQuery = 'UPDATE resources SET status = ? WHERE id = ?';
    db.query(updateQuery, ['In Use', resourceId], (updateErr) => {
      if (updateErr) {
        console.error("Update Error:", updateErr); // Log the error
        return res.status(500).send("Failed to update resource status.");
      }

      res.send("Resource allocated successfully");
    });
  });
});


// Get all allocations
router.get('/', (req, res) => {
  const query = `
    SELECT a.*, r.name AS resource_name, r.description AS resource_description
    FROM allocations a
    JOIN resources r ON a.resource_id = r.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Get all projects
router.get('/projects', (req, res) => {
  const query = 'SELECT id, name FROM projects';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results); 
  });
});


module.exports = router;
