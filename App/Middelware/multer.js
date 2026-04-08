const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.memoryStorage();
const upload = multer({ storage });
module.exports = { upload };

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// // ✅ choose one
// const uploadPath = "D:/EmailAttchmentSend";
// // const uploadPath = path.join(__dirname, "../../EmailAttchmentSend");

// // ✅ ensure folder exists
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadPath);
//   },

//   filename: function (req, file, cb) {
//     const uniqueSuffix =
//       Date.now() + "_" + file.originalname.replace(/\s+/g, "_");
//     cb(null, uniqueSuffix);
//   },
// });

// const upload = multer({ storage });

// module.exports = { upload };