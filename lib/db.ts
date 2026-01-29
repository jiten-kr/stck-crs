import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Add connection error handling
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Log connection errors but don't crash the app
pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err.message);
});

export default pool;
