const fs = require("fs");
const path = require("path");

async function saveAttachmentsToSSD(attachments) {
  const uploadDir = "D:/EmailAttachment";

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const files = [];

  for (let att of attachments) {
    if (!att.filename) continue;

    const uniqueName = `${Date.now()}-${att.filename}`;
    const fullPath = path.join(uploadDir, uniqueName);

    fs.writeFileSync(fullPath, att.content);

    files.push({
      fileName: att.filename,
      filePath: `/attachments/${uniqueName}` // 👈 URL path
    });
  }

  return files;
}

module.exports = {saveAttachmentsToSSD}