const { InsertEmail, getemailData ,  getThreadData, updateReadStatusModel } = require("../Models/emailModel");
const fetchEmails = require("../utils/emailhelpr");
const { saveAttachmentsController } = require("./attachmentController");


async function startEmailPolling() {
  await fetchEmails(saveemail, saveAttachmentsController)
}

const getemail = async (req, res) => {
  
  try {
     await startEmailPolling();
    const result = await getemailData();
   
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ getemail error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch emails",
    });
  }
};

async function getThreadEmail(req, res) {
  try {
    const params = {
      mode: "GetThread",
      threadid: req.body.threadid
    };

    const data = await getThreadData(params);

    res.status(200).json({
      success: true,
      message: "Thread emails fetched successfully",
      data: data
    });

  } catch (error) {
    console.error("Error fetching thread emails:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}

async function extractRegNo(body) {
  if (!body) return null;
  const regNoMatch = body.match(/\b1\d{7}\b/);
  return regNoMatch ? regNoMatch[0] : null;
}

async function saveemail(email) {
  try {
    if (!email.from || !email.subject) {
      console.log("⚠️ Invalid email skipped");
      return null;
    }

    const regNo = await extractRegNo(email.body);

    // ✅ FIX: store result
    const result = await InsertEmail({
      mode: "INSERT",
      fromEmail: email.from,
      subject: email.subject,
      recivedDate: email.date || new Date(),
      body: email.body,
      regNo: regNo,
      toEmail: email.toEmail || null,
      messageId: email.messageId || null,
      inReplyTo: email.inReplyTo || null
    });
    // ✅ get ID
   const emailId = result?.[0]?.Id;

    console.log("Email saved:", emailId);

    return emailId;

  } catch (err) {
    console.error("❌ Save email failed:", err.message);
    return null;
  }
}

async function updateReadStatusController(req , res) {
  try {
   const params = {
  mode: "Update_Read_Status",
  emailId: Number(req.body.emailId),   // ✅ FIX
  isRead: Number(req.body.isRead)      // ✅ FIX
};
    const data = await updateReadStatusModel(params);
      res.status(200).json({
      success: true,
      message: "Update Read Status successfully",
      data: data
    });
  } catch (error) {
    console.error("Error fetching thread emails:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}
module.exports = { getemail, saveemail , getThreadEmail ,updateReadStatusController};
