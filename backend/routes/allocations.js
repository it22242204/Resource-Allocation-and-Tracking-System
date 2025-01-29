const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.post('/', (req, res) => {
  const { resourceId, projectId, startTime, endTime } = req.body;

  // Check for missing fields
  if (!resourceId || !projectId || !startTime || !endTime) {
    return res.status(400).send("Missing required fields.");
  }

  // Start a transaction to ensure consistency
  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction Error:", err);
      return res.status(500).send("Error starting transaction.");
    }

    // Check if the resource exists and is available
    const checkQuery = 'SELECT * FROM resources WHERE id = ?';
    db.query(checkQuery, [resourceId], (checkErr, checkResults) => {
      if (checkErr) {
        return db.rollback(() => {
          console.error("Check Error:", checkErr);
          res.status(500).send("Database error while checking resource.");
        });
      }

      if (checkResults.length === 0) {
        return db.rollback(() => {
          res.status(404).send("Resource not found.");
        });
      }

      const resource = checkResults[0];

      // Ensure the resource is not "In Use" before allocation
      if (resource.status === "In Use") {
        return db.rollback(() => {
          res.status(400).send("Resource is already in use.");
        });
      }

      // Insert the allocation and set status to "In Use" in the same operation
      const insertQuery = 'INSERT INTO allocations (resource_id, project_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)';
      db.query(insertQuery, [resourceId, projectId, startTime, endTime, 'In Use'], (allocErr, allocResults) => {
        if (allocErr) {
          return db.rollback(() => {
            console.error("Database Error:", allocErr);
            res.status(500).send("Database error while allocating resource.");
          });
        }

        // Update the resource status to "In Use" in the resources table
        const updateQuery = 'UPDATE resources SET status = ? WHERE id = ?';
        db.query(updateQuery, ['In Use', resourceId], (updateErr) => {
          if (updateErr) {
            return db.rollback(() => {
              console.error("Update Error:", updateErr);
              res.status(500).send("Failed to update resource status.");
            });
          }

          // Commit the transaction if everything is successful
          db.commit((commitErr) => {
            if (commitErr) {
              return db.rollback(() => {
                console.error("Commit Error:", commitErr);
                res.status(500).send("Error committing transaction.");
              });
            }

            // Respond with the allocation details
            res.json({
              message: "Resource allocated successfully",
              allocation: {
                id: allocResults.insertId,
                resourceId,
                projectId,
                startTime,
                endTime,
                status: "In Use"
              }
            });
          });
        });
      });
    });
  });
});



// Get all allocations
router.get('/', (req, res) => {
  const query = `
    SELECT a.*, r.name AS resource_name, r.description AS resource_description, r.status AS resource_status
    FROM allocations a
    JOIN resources r ON a.resource_id = r.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    
    // You can now access `resource_status` in the results and respond accordingly
    res.json(results);
  });
});


module.exports = router;
