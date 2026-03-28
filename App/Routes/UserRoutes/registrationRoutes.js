const express = require("express");
const { register_User, register_Varify_OTP, register_User_Login } = require("../../Controller/UserController/registrationController");
const Register_Router = express.Router();

Register_Router.post("/register_Send_OTP", register_User);
Register_Router.post("/register_Verify_OTP", register_Varify_OTP)
Register_Router.post("/login_user", register_User_Login)
module.exports = Register_Router;
