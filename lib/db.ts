import { Pool } from "pg";

// Append libpq compatibility params to connection string
const connectionString = process.env.DATABASE_URL || "";
const separator = connectionString.includes("?") ? "&" : "?";
const connectionStringWithSSL = `${connectionString}${separator}sslmode=require&uselibpqcompat=true`;

const pool = new Pool({
  connectionString: connectionStringWithSSL,
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
