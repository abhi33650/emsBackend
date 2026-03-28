const {sql, dbConnect } = require("../DataBase/db");

async function EmailAttachmentModel(params) {
  const pool  = await dbConnect();
  const request = pool.request();
  request.input("Mode", sql.VarChar(50), params.mode);
  request.input("EmailId", sql.Int , params.emailId ?? null);
  request.input("FileName", sql.VarChar(500), params.filename ?? null);
  request.input("FilePath", sql.VarChar(500),params.filepath ?? null);
  const result = await request.execute("dbo.pEmailAttachment");
  return result.recordset;
}

async function GetEmailAttachmentModel(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode", sql.VarChar(50), "get_File");
  request.input("ThreadId" , sql.VarChar(500), params.threadid ?? null);
  const result = await request.execute("dbo.pEmailAttachment");
  return result.recordset;
}
async function GetAttachmentByIdModel(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode", sql.VarChar(50), "get_File_By_Id");
  request.input("EmailId", sql.Int, params.emailId ?? null);
  const result = await request.execute("dbo.pEmailAttachment");
  return result.recordset;
}
module.exports = {EmailAttachmentModel , GetEmailAttachmentModel,GetAttachmentByIdModel}