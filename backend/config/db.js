require('dotenv').config();
const mysql = require('mysql2/promise'); // Use promise-based MySQL2

// Create a connection pool (Recommended)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
async function testDBConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected to the database');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Exit if the connection fails
    }
}

testDBConnection(); // Call the function

module.exports = pool;
