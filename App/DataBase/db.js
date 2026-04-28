const sql = require("mssql/msnodesqlv8");

const config = {
  server: process.env.SERVER_NAME,
  database:process.env.DATABASE_NAME,
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true
  }
};

let pool; 

const dbConnect = async () => {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log("✅ SQL Server connected (Windows Auth)");
    }
    return pool;
  } catch (error) {
    console.error("❌ SQL Connection Error:", error); 
    process.exit(1);
  }
};

module.exports = { sql, dbConnect };

  // user:process.env.DATABASE_USER,
  // password:process.env.DATABASE_NAME,
  // server: process.env.SERVER_NAME,
  // database:process.env.DATABASE_NAME,