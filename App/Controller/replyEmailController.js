const { sendReplyEmail } = require("../Middelware/email");
const { SaveReplyEmailModel } = require("../Models/replyEmailModel");
const { saveAttachmentMetaModel } = require("../Models/attachmentModel");
// Controller / Action file
const SaveReplyEmailController = async (req, res) => {
  const { fromEmail, toEmail, subject, body, inReplyTo, emailId } = req.body;

  const file = req.file;

  console.log("emailId:", emailId); 

  try {
    const { messageId } = await sendReplyEmail(
      toEmail,
      subject,
      body,
      inReplyTo,
      file,
    );

    // ✅ Save email
    await SaveReplyEmailModel({
      fromEmail,
      toEmail,
      subject,
      body,
      messageId,
      inReplyTo,
      fileName: file?.originalname || null,
      filePath: null,
    });

    // ✅ Save attachment metadata (HERE ONLY)
    if (file) {
      await saveAttachmentMetaModel({
        emailId: emailId,
        filename: file.originalname,
        messageId: messageId,
        partId: null,
      });
    }

    res.status(200).json({ success: true, messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};



module.exports = { SaveReplyEmailController };
// const SaveReplyEmailController = async (req, res) => {
//   const { fromEmail, toEmail, subject, body, inReplyTo } = req.body;

//   // ✅ FIX: get file from multer
//   const fileName = req.file?.originalname || null;
//   const filePath = req.file?.path || null;

//   if (!toEmail || !body || !inReplyTo) {
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

//   try {
//     // ✅ Step 1: Send email (with attachment)
//     const { response, messageId } = await sendReplyEmail(
//       toEmail,
//       subject,
//       body,
//       inReplyTo,
//       fileName,
//       filePath
//     );

//     // ✅ Step 2: Save to DB
//     await SaveReplyEmailModel({
//       fromEmail,
//       toEmail,
//       subject,
//       body,
//       messageId,
//       inReplyTo,
//       fileName,
//       filePath,
//     });

//     return res.status(200).json({ success: true, messageId });

//   } catch (error) {
//     console.error("Reply error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };
// const { sendReplyEmail } = require("../Middelware/email");
// const { SaveReplyEmailModel } = require("../Models/replyEmailModel");

// // Controller / Action file
// const SaveReplyEmailController = async (req, res) => {
//   const { fromEmail, toEmail, subject, body, inReplyTo } = req.body;

//   if (!toEmail || !body || !inReplyTo) {
//     return res.status(400).json({ success: false, message: "Missing required fields" });
//   }

//   try {
//     // Step 1: Send email via nodemailer
//     const { response, messageId } = await sendReplyEmail(toEmail, subject, body, inReplyTo);

//     // Step 2: Save to DB
//     await SaveReplyEmailModel({
//       fromEmail,
//       toEmail,
//       subject,
//       body,
//       messageId,         // nodemailer ka generated messageId
//       inReplyTo,         // original email ka messageId
//     });

//     return res.status(200).json({ success: true, messageId });

//   } catch (error) {
//     console.error("Reply error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// module.exports = { SaveReplyEmailController };
