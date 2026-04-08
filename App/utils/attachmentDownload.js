// const Imap = require("imap");
// const { simpleParser } = require("mailparser");

// function getAttachmentFromGmail(messageId, fileName) {
//   return new Promise((resolve, reject) => {
//     const imap = new Imap({
//       user: process.env.EMAIL_USER,
//       password: process.env.EMAIL_PASS,
//       host: "imap.gmail.com",
//       port: 993,
//       tls: true,
//       tlsOptions: { rejectUnauthorized: false },
//     });

//     const boxes = ["INBOX", "[Gmail]/Sent Mail"];
//     const cleanMessageId = messageId.replace(/[<>]/g, "");

//     imap.once("ready", async () => {
//       for (const boxName of boxes) {
//         console.log("🔍 Checking box:", boxName);

//         const opened = await new Promise((res) => {
//           imap.openBox(boxName, false, (err) => {
//             if (err) {
//               console.log("❌ Cannot open:", boxName);
//               return res(false);
//             }
//             console.log("✅ Opened:", boxName);
//             res(true);
//           });
//         });

//         if (!opened) continue;

//         const results = await new Promise((res, rej) => {
//           imap.search(["ALL"], (err, results) => {
//             if (err) return rej(err);
//             res(results);
//           });
//         });

//         if (!results || results.length === 0) continue;

//         let found = false;

//         const fetch = imap.fetch(results, { bodies: "" });

//         await new Promise((resolveFetch) => {
//           fetch.on("message", (msg) => {
//             msg.on("body", async (stream) => {
//               try {
//                 const parsed = await simpleParser(stream);

//                 const parsedId = parsed.messageId?.replace(/[<>]/g, "");

//                 if (parsedId !== cleanMessageId) return;

//                 console.log("📧 MATCHED EMAIL in:", boxName);

//                 console.log(
//                   "📎 Attachments:",
//                   parsed.attachments.map((a) => a.filename)
//                 );

//                 const attachment = parsed.attachments.find(
//                   (att) =>
//                     att.filename?.toLowerCase() === fileName?.toLowerCase()
//                 );

//                 if (!attachment) return;

//                 found = true;

//                 resolve({
//                   content: attachment.content,
//                   contentType: attachment.contentType,
//                 });

//                 imap.end();
//               } catch (err) {
//                 reject(err);
//               }
//             });
//           });

//           fetch.once("end", resolveFetch);
//         });

//         if (found) return;
//       }

//       reject("Attachment not found in any mailbox");
//     });

//     imap.once("error", reject);
//     imap.connect();
//   });
// }

// module.exports = { getAttachmentFromGmail };
// const Imap = require("imap");
// const { simpleParser } = require("mailparser");

// function getAttachmentFromGmail(messageId, fileName) {
//   return new Promise((resolve, reject) => {
//     const imap = new Imap({
//       user: process.env.EMAIL_USER,
//       password: process.env.EMAIL_PASS,
//       host: "imap.gmail.com",
//       port: 993,
//       tls: true,
//       tlsOptions: {
//       rejectUnauthorized: false,   
//       },
//     });

//     imap.connect();

//     imap.once("ready", () => {
//       imap.openBox("INBOX", false, () => {
//         imap.search([["HEADER", "MESSAGE-ID", messageId]], (err, results) => {
//           if (err || !results.length) {
//             return reject("Email not found");
//           }

//           const fetch = imap.fetch(results, { bodies: "" });

//           fetch.on("message", (msg) => {
//             msg.on("body", async (stream) => {
//               try {
//                 const parsed = await simpleParser(stream);

//                 const attachment = parsed.attachments.find(
//                   (att) => att.filename === fileName
//                 );

//                 if (!attachment) {
//                   return reject("Attachment not found");
//                 }

//                 resolve({
//                   content: attachment.content,
//                   contentType: attachment.contentType,
//                 });
//               } catch (err) {
//                 reject(err);
//               }
//             });
//           });
//         });
//       });
//     });

//     imap.once("error", reject);
//   });
// }

// module.exports={getAttachmentFromGmail}

const Imap = require("imap");
const { simpleParser } = require("mailparser");

function getAttachmentFromGmail(messageId, fileName) {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: "imap.gmail.com",
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    });

    imap.connect();

    imap.once("ready", () => {
      const foldersToSearch = ["INBOX", "[Gmail]/Sent Mail", "[Gmail]/All Mail"];

      const searchInFolder = (folderIndex) => {
        if (folderIndex >= foldersToSearch.length) {
          imap.end();
          return reject(new Error("Email not found in any folder"));
        }

        const folder = foldersToSearch[folderIndex];
        // console.log(`🔍 Searching in folder: ${folder}`);

        imap.openBox(folder, true, (err) => {
          if (err) {
            console.log(`⚠️ Could not open folder ${folder}:`, err.message);
            return searchInFolder(folderIndex + 1);
          }

          // ✅ Try BOTH formats — with and without angle brackets
          const withBrackets = messageId.startsWith("<") ? messageId : `<${messageId}>`;
          const withoutBrackets = messageId.replace(/^<|>$/g, "");
          // First try without brackets (Gmail IMAP prefers this)
          imap.search([["HEADER", "MESSAGE-ID", withoutBrackets]], (err, results) => {
            console.log(`📬 Results (without brackets) in ${folder}:`, results);

            if (!err && results && results.length > 0) {
              return fetchAttachment(imap, results, fileName, resolve, reject);
            }

            // Fallback: try with brackets
            imap.search([["HEADER", "MESSAGE-ID", withBrackets]], (err2, results2) => {
              // console.log(`📬 Results (with brackets) in ${folder}:`, results2);

              if (!err2 && results2 && results2.length > 0) {
                return fetchAttachment(imap, results2, fileName, resolve, reject);
              }

              // Not found in this folder, try next
              console.log(`❌ Not found in ${folder}, trying next...`);
              searchInFolder(folderIndex + 1);
            });
          });
        });
      };

      searchInFolder(0);
    });

    imap.once("error", (err) => {
      console.error("IMAP Error:", err);
      reject(err);
    });
  });
}

// ✅ Separated fetch logic for clarity
function fetchAttachment(imap, results, fileName, resolve, reject) {
  const fetch = imap.fetch(results, { bodies: "" });

  fetch.on("message", (msg) => {
    msg.on("body", async (stream) => {
      try {
        const parsed = await simpleParser(stream);

        console.log(
          "📎 Attachments found:",
          parsed.attachments.map((a) => a.filename)
        );

        const attachment = parsed.attachments.find(
          (att) => att.filename === fileName
        );

        if (!attachment) {
          imap.end();
          return reject(new Error(`Attachment "${fileName}" not found in email`));
        }

        imap.end();
        resolve({
          content: attachment.content,
          contentType: attachment.contentType,
        });
      } catch (parseErr) {
        imap.end();
        reject(parseErr);
      }
    });
  });

  fetch.once("error", (err) => {
    imap.end();
    reject(err);
  });
}

module.exports = { getAttachmentFromGmail };