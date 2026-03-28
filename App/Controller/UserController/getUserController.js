const { getAllUsers } = require("../../Models/UserModel/getUserModel");

async function getRegisteredUser(req , res) {
   try {
    const result = await getAllUsers();
    return res.status(200).json({
      success:true,
      data:result
    });
   } catch (error) {
    console.error("❌ getRegisteredUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Users",
    });
   }
}

module.exports = {getRegisteredUser}