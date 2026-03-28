const { sql, dbConnect } = require("../DataBase/db");

async function RemarkSendModel(params) {
  try {
    const pool = await dbConnect();
    const request = pool.request();

    request.input("Mode", sql.VarChar(50), params.mode ?? null);
    request.input("emailid", sql.Int, params.emailId ?? null);
    request.input("remarkBy", sql.Int, params.remarkBy ?? null);
    request.input("remark", sql.VarChar(500), params.remark ?? null);

    const result = await request.execute("dbo.pEmailRemarks");

    return result.recordset; 
  } catch (error) {
    console.error("Error in RemarkSend:", error);
    throw error;
  }
}


async function getEmailWithRemarks(params) {
  try {
    const pool = await dbConnect();
    const request = pool.request();
    request.input("Mode", sql.VarChar(50), "Get_Email_With_Remark");
    request.input("emailid", sql.Int, params.emailId);
    request.input("remarkBy", sql.Int, 0); 
    request.input("remark", sql.VarChar(500), ""); 

    const result = await request.execute("dbo.pEmailRemarks");

    return result.recordset; 
  } catch (error) {
    console.error("Error in getEmailWithRemarks:", error);
    throw error;
  }
}
module.exports = {RemarkSendModel ,getEmailWithRemarks};