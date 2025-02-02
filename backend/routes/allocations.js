const express = require("express");
const db = require("../config/db");
const router = express.Router();


router.post("/", async (req, res) => {
    const { resourceId, projectId, startTime, endTime, status } = req.body;

    if (!resourceId || !startTime || !endTime || !status) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        
        const [resource] = await connection.query("SELECT * FROM resources WHERE id = ?", [resourceId]);

        if (resource.length === 0) {
            throw new Error("Resource not found.");
        }

        if (resource[0].status === "In Use" && status !== "Under Maintenance") {
            throw new Error("Resource is already in use.");
        }

       
        const [alloc] = await connection.query(
            "INSERT INTO allocations (resource_id, project_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)",
            [resourceId, projectId || null, startTime, endTime, status]
        );

        
        await connection.query("UPDATE resources SET status = ? WHERE id = ?", [status, resourceId]);

        await connection.commit();
        connection.release();

        res.json({ message: "Resource allocated successfully", allocationId: alloc.insertId });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("❌ Error allocating resource:", error.message);
        res.status(400).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    const { resource_id } = req.query;

    let query = `
        SELECT a.resource_id, a.project_id, a.status, 
               DATE_FORMAT(a.start_time, '%Y-%m-%d %H:%i') AS start_time, 
               DATE_FORMAT(a.end_time, '%Y-%m-%d %H:%i') AS end_time,
               r.name AS resource_name
        FROM allocations a
        LEFT JOIN resources r ON a.resource_id = r.id
    `;
    
    const params = [];

    if (resource_id) {
        query += " WHERE a.resource_id = ?";
        params.push(resource_id);
    }

    query += " ORDER BY a.start_time DESC";

    try {
        const [results] = await db.query(query, params);
        res.json(results || []); 
    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ error: "Database error while fetching allocations." });
    }
});

module.exports = router;
