const { sendReplyEmail } = require("../Middelware/email");
const { SaveReplyEmailModel } = require("../Models/replyEmailModel");

// Controller / Action file
const SaveReplyEmailController = async (req, res) => {
  const { fromEmail, toEmail, subject, body, inReplyTo } = req.body;

  if (!toEmail || !body || !inReplyTo) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Step 1: Send email via nodemailer
    const { response, messageId } = await sendReplyEmail(toEmail, subject, body, inReplyTo);

    // Step 2: Save to DB
    await SaveReplyEmailModel({
      fromEmail,
      toEmail,
      subject,
      body,
      messageId,         // nodemailer ka generated messageId
      inReplyTo,         // original email ka messageId
    });

    return res.status(200).json({ success: true, messageId });

  } catch (error) {
    console.error("Reply error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { SaveReplyEmailController };                                                                                                                                   