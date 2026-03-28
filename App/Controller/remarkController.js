const {RemarkSendModel , getEmailWithRemarks} = require("../Models/remarkModel")


async function addRemark(req, res) {
  try {
    const { emailId,  remark } = req.body;
  const userId = req.user.userId;
    if (!emailId  || !remark) {
      return res.status(400).json({
        status: "error",
        message: "emailId, remarkBy and remark are required"
      });
    }

    const result = await RemarkSendModel({
      mode: "Add_Remark",
      emailId,
      remarkBy:userId,
      remark
    });

    return res.status(200).json({
      status: "success",
      message: "Remark added successfully",
      data: result
    });
  } catch (error) {
    console.error("addRemark error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}


async function getEmailRemarks(req, res) {
  try {
    const params = {
      mode: "Get_Email_With_Remark",
      emailId: req.body.emailId
    };

    const data = await getEmailWithRemarks(params);

    res.status(200).json({
      success: true,
      message: "Email remarks fetched successfully",
      data: data
    });

  } catch (error) {
    console.error("Error fetching email remarks:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

module.exports = {
  addRemark,
  getEmailRemarks
};