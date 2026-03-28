const {sql, dbConnect } = require("../DataBase/db");

async function InsertEmail(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode" , sql.VarChar(10), params.mode);
  request.input("FromEmail", sql.VarChar(250), params.fromEmail ?? null);
  request.input("Subject", sql.VarChar(250),params.subject ?? null);
  request.input("RecivedDate",sql.DateTime,params.recivedDate ?? null);
  request.input("Body", sql.NVarChar(sql.MAX), params.body ?? null);
  request.input("RegNo", sql.VarChar(20), params.regNo ?? null); 
  request.input("ToEmail" , sql.VarChar(250), params.toEmail ?? null);
  request.input("MessageId", sql.VarChar(500),params.messageId ?? null);
  request.input("InReplyTo", sql.VarChar(500), params.inReplyTo ?? null);
  const result = await request.execute("dbo.pSaveEmail");
  return result.recordset;
}

async function getThreadData(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode" , sql.VarChar(10), params.mode);
  request.input("ThreadId" , sql.VarChar(500), params.threadid ?? null);
  const result = await request.execute("dbo.pSaveEmail");
  return result.recordset;
}

async function getemailData(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode", sql.VarChar(10), "GET")
  const result = await request.execute("dbo.pSaveEmail"); 
  return result.recordset;
}
      
async function updateReadStatusModel(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Mode", sql.VarChar(50), params.mode);
  request.input("emailId", sql.Int, params.emailId);
  request.input("IsRead", sql.Bit, params.isRead);
  const result = await request.execute("dbo.pSaveEmail");
  return result.recordset;
}

module.exports ={InsertEmail ,getemailData , getThreadData , updateReadStatusModel};            