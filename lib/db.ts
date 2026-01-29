import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL required for Neon and most cloud databases
  ssl: {
    rejectUnauthorized: false,
  },
});

// Log connection errors but don't crash the app
pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

export default pool;
