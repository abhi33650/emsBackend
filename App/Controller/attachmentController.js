const path = require("path"); 
const fs = require("fs");   
const { EmailAttachmentModel, GetEmailAttachmentModel , GetAttachmentByIdModel} = require("../Models/attachmentModel");


async function saveAttachmentsController(emailId, files) {
  try {
    for (let file of files) {
      await EmailAttachmentModel({
        mode: "Insert_File",
        emailId: emailId,
        filename: file.fileName,
        filepath: file.filePath,
      });
    }
    return { success: true, message: "Attachments saved successfully" };

  } catch (error) {
    console.error("Attachment Save Error:", error.message);
    return { success: false, error: error.message };
  }
}

async function GetEmailAttachmentController(req ,res) {
       try {
        const params = {threadid : req.body.threadid};
        const data = await GetEmailAttachmentModel(params);
        
    res.status(200).json({
      success: true,
      message: "Email Attachment fetched successfully",
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

// async function DownloadAttachmentController(req, res) {
//   try {
//     const { id } = req.params;  // ✅ matches :id in route
//     console.log("📌 Download requested for id:", id);

//     const rows = await GetAttachmentByIdModel(parseInt(id));  // ✅ pass number directly
//     console.log("📌 DB rows returned:", rows);

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ success: false, message: "Attachment not found" });
//     }

//     const { FileName, FilePath } = rows[0];
//     console.log("📌 FileName:", FileName);
//     console.log("📌 FilePath from DB:", FilePath);

//     const fileName = path.basename(FilePath);
//     const absolutePath = path.join("D:/EmailAttachment", fileName);
//     console.log("📌 absolutePath:", absolutePath);
//     console.log("📌 File exists?", fs.existsSync(absolutePath));

//     if (!fs.existsSync(absolutePath)) {
//       return res.status(404).json({ success: false, message: "File not found on disk" });
//     }

//     res.setHeader("Content-Disposition", `attachment; filename="${FileName}"`);
//     res.setHeader("Content-Type", "application/octet-stream");
//     res.sendFile(absolutePath);

//   } catch (error) {
//     console.error("❌ Download Attachment Error:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// }



async function DownloadAttachmentController(req, res) {
  try {
    const { id } = req.body;   // ✅ BODY se id lo
    console.log("📌 Download requested for id:", id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    }
const rows = await GetAttachmentByIdModel({
  emailId: parseInt(id),
});
    console.log("📌 DB rows returned:", rows);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found",
      });
    }

    const { FileName, FilePath } = rows[0];

    const fileName = path.basename(FilePath);
    const absolutePath = path.join("D:/EmailAttachment", fileName);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on disk",
      });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${FileName}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    res.sendFile(absolutePath);
  } catch (error) {
    console.error("❌ Download Attachment Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
module.exports = { saveAttachmentsController , GetEmailAttachmentController,DownloadAttachmentController};