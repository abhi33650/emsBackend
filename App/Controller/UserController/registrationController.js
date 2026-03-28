const bcrypt = require("bcrypt");
const { SendVerificationCode } = require("../../Middelware/email");
const {UserRegister_Send_OTP,UserRegister_Verify_OTP,User_Login} = require("../../Models/UserModel/registrationModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function register_User(req, res) {
  try {
    const { email, password, secretKey } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Call model

    
    const role = secretKey === process.env.ADMIN_SECRET_KEY ? "Admin" : "User";
    const result = await UserRegister_Send_OTP({
      email: email,
      password: hashPassword,
      otp: otp,
      role: role,
    });

    const status = result[0]?.Status;
    if (status !== "OTP_SENT") {
      return res.status(400).json({ message: status });
    }
    // Send email
    await SendVerificationCode(email, otp);
    return res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function register_Varify_OTP(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }
    const result = await UserRegister_Verify_OTP({
      email: email,
      otp: otp,
    });
    const status = result[0]?.Status?.trim().toUpperCase();

    if (status !== "OTP VERIFIED") {
      return res.status(400).json({
        message: "Wrong or expired OTP",
      });
    }

    return res.status(200).json({
      message: "User Registered successfully",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

async function register_User_Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const result = await User_Login({ email });
    const user = result[0];

    if (!user) {
      return res.status(400).json({
        message: "Login failed",
      });
    }
    const status = user.Status?.trim().toUpperCase();
    if (status === "EMAIL_NOT_FOUND") {
      return res.status(404).json({
        message: "Email not registered",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.HashedPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({userId: user.Id, email: user.Email,role: user.Role},process.env.JWT_SECRET,{ expiresIn: "1h" });
    return res.status(200).json({
      message: "Login successful",
      token: token,
      role: user.Role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = { register_User, register_Varify_OTP, register_User_Login };
