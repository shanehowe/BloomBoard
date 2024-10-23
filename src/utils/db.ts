import sql from "mssql";

const config: sql.config = {
  server: process.env.DB_SERVER || "",
  database: process.env.DB_NAME || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

export async function connectToDatabase(): Promise<sql.ConnectionPool> {
  try {
    if (
      !config.server ||
      !config.database ||
      !config.user ||
      !config.password
    ) {
      throw new Error(
        "Database configuration is incomplete. Check your environment variables.",
      );
    }
    const pool = await new sql.ConnectionPool(config).connect();
    return pool;
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    throw err;
  }
}
