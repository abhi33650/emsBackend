const { sql, dbConnect } = require("../../DataBase/db");

async function UserRegister_Send_OTP(params) {
  const pool = await dbConnect();
  const request = pool.request();

  request.input("Email", sql.VarChar(250), params.email ?? null);
  request.input("Password", sql.VarChar(250), params.password ?? null);
  request.input("OTP", sql.VarChar(6), params.otp ?? null);
  request.input("Role", sql.VarChar(50), params.role ?? null);
  const result = await request.execute("dbo.pRegisterUser_SendOtp");       
  return result.recordset;
}

async function UserRegister_Verify_OTP(params) {
  const pool = await dbConnect();
  const request = pool.request();
  request.input("Email", sql.VarChar(250), params.email ?? null);
  request.input("OTP",sql.VarChar(6), params.otp ?? null);
  const result = await request.execute("dbo.pRegisterUser_VerifyOtp");
 return result.recordset;
}

async function User_Login(params) {
   const pool = await dbConnect();
   const request = pool.request();
   request.input("Email", sql.VarChar(250),params.email ?? null);
   const result = await request.execute("dbo.pLoginUser");
   return result.recordset;
}

module.exports = { UserRegister_Send_OTP,UserRegister_Verify_OTP ,User_Login };
     