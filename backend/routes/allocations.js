const express = require("express");
const db = require("../config/db");
const router = express.Router();

// Allocate a resource
router.post("/", (req, res) => {
  const { resourceId, projectId, startTime, endTime, status } = req.body;

  if (!resourceId || !startTime || !endTime || !status) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: "Error starting transaction." });

    try {
      // Check if the resource exists & its status
      const [resource] = await db.promise().query("SELECT * FROM resources WHERE id = ?", [resourceId]);
      if (resource.length === 0) throw new Error("Resource not found.");

      if (resource[0].status === "In Use" && status !== "Under Maintenance") {
        throw new Error("Resource is already in use.");
      }

      // Insert allocation
      const [alloc] = await db.promise().query(
        "INSERT INTO allocations (resource_id, project_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)",
        [resourceId, projectId || null, startTime, endTime, status]
      );

      // Update resource status
      await db.promise().query("UPDATE resources SET status = ? WHERE id = ?", [status, resourceId]);

      await db.commit();
      res.json({ message: "Resource allocated successfully", allocationId: alloc.insertId });
    } catch (error) {
      await db.rollback();
      res.status(400).json({ error: error.message });
    }
  });
});

// Get all allocations
router.get("/", (req, res) => {
  const { resource_id } = req.query;  // Ensure resource_id is passed in request

  if (!resource_id) return res.status(400).send("Missing resource ID.");

  const query = `
    SELECT resource_name, status, 
           DATE_FORMAT(start_time, '%Y-%m-%d %H:%i') AS start_time, 
           DATE_FORMAT(end_time, '%Y-%m-%d %H:%i') AS end_time 
    FROM allocations 
    WHERE resource_id = ?  -- Fetch only the requested resource
    ORDER BY start_time DESC 
    LIMIT 1
  `;

  db.query(query, [resource_id], (err, results) => {
    if (err) return res.status(500).send("Database error while fetching allocation.");
    res.json(results.length > 0 ? results[0] : null);
  });
});



module.exports = router;