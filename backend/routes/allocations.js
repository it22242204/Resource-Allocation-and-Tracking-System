const express = require("express");
const db = require("../config/db");
const router = express.Router();

// ✅ Allocate a resource (POST)
router.post("/", async (req, res) => {
    const { resourceId, projectId, startTime, endTime, status } = req.body;

    if (!resourceId || !startTime || !endTime || !status) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // ✅ Check if the resource exists
        const [resource] = await connection.query("SELECT * FROM resources WHERE id = ?", [resourceId]);

        if (resource.length === 0) {
            throw new Error("Resource not found.");
        }

        if (resource[0].status === "In Use" && status !== "Under Maintenance") {
            throw new Error("Resource is already in use.");
        }

        // ✅ Insert allocation
        const [alloc] = await connection.query(
            "INSERT INTO allocations (resource_id, project_id, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)",
            [resourceId, projectId || null, startTime, endTime, status]
        );

        // ✅ Update resource status
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

// // ✅ Get latest allocation for a specific resource (GET)
// router.get("/latest", async (req, res) => {
//     const { resource_id } = req.query;

//     if (!resource_id) return res.status(400).json({ error: "Missing resource ID." });

//     const query = `
//         SELECT resource_id, status, 
//                DATE_FORMAT(start_time, '%Y-%m-%d %H:%i') AS start_time, 
//                DATE_FORMAT(end_time, '%Y-%m-%d %H:%i') AS end_time 
//         FROM allocations 
//         WHERE resource_id = ?
//         ORDER BY start_time DESC 
//         LIMIT 1
//     `;

//     try {
//         const [results] = await db.query(query, [resource_id]);
//         console.log("✅ Latest allocation fetched:", results);
//         res.json(results.length > 0 ? results[0] : null);
//     } catch (err) {
//         console.error("❌ Database error:", err);
//         res.status(500).json({ error: "Database error while fetching allocation." });
//     }
// });

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
        res.json(results || []); // Ensure an array is returned
    } catch (err) {
        console.error("❌ Database error:", err);
        res.status(500).json({ error: "Database error while fetching allocations." });
    }
});




module.exports = router;
