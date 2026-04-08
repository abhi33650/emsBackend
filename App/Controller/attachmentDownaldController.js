
const { getAttachmentFromGmail } = require("../utils/attachmentDownload")

async function downloadFromGmailController(req, res) {
  try {
    const { messageId, fileName } = req.body;

    console.log("Download request:", { messageId, fileName });
    if (!messageId || !fileName) {
      return res.status(400).json({
        success: false,
        message: "messageId and fileName required",
      });
    }
    const file = await getAttachmentFromGmail(messageId, fileName);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );
    res.setHeader("Content-Type", file.contentType);
    return res.send(file.content);
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attachment",
    });
  }
}

module.exports = { downloadFromGmailController };