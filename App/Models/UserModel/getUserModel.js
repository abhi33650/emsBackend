const {sql , dbConnect} = require("../../DataBase/db");

async function getAllUsers(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode", sql.VarChar(10),"GetAllUsers")
  const result = await request.execute("dbo.pSaveEmail");
  return result.recordset;
}

module.exports={getAllUsers};