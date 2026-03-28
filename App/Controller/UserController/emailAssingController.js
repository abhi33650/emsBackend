const { AssignEmail, getAssignEmail } = require("../../Models/UserModel/emailAssingModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");
async function AsignEmailToUser(req, res) {
  try {
    const { emailId, userId } = req.body;
    if (!emailId || !userId) {
      return res.status(400).json({
        status: "error",
        message: "EmailId and UserId are required",
        });
      } 
      const result = await AssignEmail({
      emailId,              
      userId:userId,
    });      
    return res.status(201).json({ 
      status: "success",         
      message: "Email assigned successfully",
      data: result,
    });
  } catch (error) {
    console.error("Failed to assign email:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });              
  }  
}

async function getMyAsignEmail(req , res) {                                                          
  try {
    const {userId} = req.body;
    if(!userId){         
        return res.status(400).json({
        status: "error",
        message: "UserId are required",
      });
    }
  
    const result = await getAssignEmail({userId})
    
      return res.status(200).json({
      status: "success",
      message: "Get Assigned Email Successfully",
      data: result,
    });

  } catch (error) {
     console.error("❌Failed to get assign email  error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get assign email  error",
    });
  }
}

async function UsergetMyAsignEmail(req, res) {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const result = await getAssignEmail({ userId });
    return res.status(200).json({
      status: "success",
      data: result,
    });

  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
}



module.exports = { AsignEmailToUser ,getMyAsignEmail ,UsergetMyAsignEmail };