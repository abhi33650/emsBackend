const { dbConnect, sql } = require("../../DataBase/db");


async function AssignEmail(params) {
   const pool = await dbConnect();
   const request = pool.request();
   request.input("Mode", sql.VarChar(50),"AssignEmail");
   request.input("EmailId", sql.Int, params.emailId);
   request.input("UserId", sql.Int, params.userId);
   const result = await request.execute("dbo.pAssignEmailToUser");
   return result.recordset;
}

async function getAssignEmail(params) {
   const pool = await dbConnect();
   const request = pool.request();
  request.input("Mode", sql.VarChar(50), "GetMyEmail");
  request.input("UserId", sql.VarChar(100), params.userId);
  const result = await request.execute("dbo.pAssignEmailToUser");
  return result.recordset;
}

module.exports={AssignEmail ,getAssignEmail}