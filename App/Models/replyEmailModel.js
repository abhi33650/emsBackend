const {sql, dbConnect } = require("../DataBase/db");

async function SaveReplyEmailModel(params) {
  const pool = await dbConnect();
  const request = pool.request();
    request.input("FromEmail", sql.VarChar(250), params.fromEmail ?? null);
    request.input("Subject", sql.VarChar(250),params.subject ?? null);
    request.input("Body", sql.NVarChar(sql.MAX), params.body ?? null);
    request.input("ToEmail" , sql.VarChar(250), params.toEmail ?? null);
    request.input("MessageId", sql.VarChar(500),params.messageId ?? null);
    request.input("InReplyTo", sql.VarChar(500), params.inReplyTo ?? null);
    const result = await request.execute("dbo.pReplyEmail");
    return result.recordset;
}
module.exports = {SaveReplyEmailModel};