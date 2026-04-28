const Imap = require("imap-simple");
const { simpleParser } = require("mailparser");
const { saveemail } = require("../Controller/emailController");
const { saveAttachmentsToSSD } = require("../utils/attachmentSave");
const { saveAttachmentsController } = require("../Controller/attachmentController");

async function extractRegNo(body) {
  if (!body) return null;
  const regNoMatch = body.match(/\b1\d{7}\b/);
  return regNoMatch ? regNoMatch[0] : null;
}
async function fetchEmails() {
  const config = {
    imap: {
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      host: process.env.IMAP_HOST,
      port: process.env.IMAP_PORT,
      tls: true,
      authTimeout: 10000,
      tlsOptions: {
        rejectUnauthorized: false,
      },
    },
  }; 

  try {
    const connection = await Imap.connect(config);
    await connection.openBox("INBOX");

    const messages = await connection.search(["UNSEENb"], {
      bodies: [""],
      struct: true,   
      markSeen: true,
    });

    for (const item of messages) {
      const raw = item.parts[0].body;
      const parsed = await simpleParser(raw);

      const regNo = await extractRegNo(parsed.text);

      console.log({
        from: parsed.from.text,
        subject: parsed.subject,
        date: parsed.date,
        body: parsed.text,
        regNo: regNo,
        messageId: parsed.messageId,
        inReplyTo: parsed.headers.get("in-reply-to") || null,
      });

      // ✅ STEP 1: Save email
      const emailId = await saveemail({
        from: parsed.from?.text,
        subject: parsed.subject,
        date: parsed.date,
        body: parsed.text,
        regNo: regNo,
        messageId: parsed.messageId,
        inReplyTo: parsed.headers.get("in-reply-to") || null,
      });

      // ✅ STEP 2: Get attachments
      const attachments = parsed.attachments || [];

      if (attachments.length > 0) {

        // ✅ STEP 3: ONLY metadata (NO STORAGE)
  // const attachmentMeta = (parsed.attachments || []).map((att, index) => {
    /// avoid dublicTate entry for same aattchment 

  // const meta = {
  //   filename: att.filename,
  //   contentType: att.contentType,
  //   size: att.size,
  //   partId: att.partId || index,
  //   messageId: parsed.messageId,
  // };

  // console.log(meta);
//   return meta;
// });
  
     const seenMeta = new Set();
     const attachmentMeta = [];
     for (const att of attachments){
     const uniqueKey = `${att.filename}-${att.contentType}-${att.size}`;
      if(!seenMeta.has(uniqueKey)){
        seenMeta.add(uniqueKey);
        attachmentMeta.push({
          filename:att.filename,
          contentType:att.contentType,
          size:att.size,
          partId: att.partId,
          messageId: parsed.messageId 
        })
      }
     }
       console.log("Filtered Attachments:", attachmentMeta);
        // ✅ STEP 4: Save metadata in DB
         if (attachmentMeta.length > 0) {
    await saveAttachmentsController(emailId, attachmentMeta);
  }
      }
    }

    connection.end();
  } catch (err) {
    console.error("Email Fetch Error:", err.message);
  }
}

// async function fetchEmails() {
//   const config = {
//     imap: {
//       user: process.env.EMAIL_USER,
//       password: process.env.EMAIL_PASS,
//       host: process.env.IMAP_HOST,
//       port: process.env.IMAP_PORT,
//       tls: true,
//       authTimeout: 10000,
//       tlsOptions: {
//         rejectUnauthorized: false,
//       },
//     },
//   };

//   try {
//     const connection = await Imap.connect(config);
//     await connection.openBox("INBOX");

//     const messages = await connection.search(["UNSEEN"], {
//       bodies: [""],
//       markSeen: true,
//     });

//     for (const item of messages) {
//       const raw = item.parts[0].body;
//       const parsed = await simpleParser(raw);

//       const regNo = await extractRegNo(parsed.text);

//       console.log({
//         from: parsed.from.text,
//         subject: parsed.subject,
//         date: parsed.date,
//         body: parsed.text,
//         regNo: regNo,
//         messageId: parsed.messageId,
//         inReplyTo: parsed.headers.get("in-reply-to") || null,
//       });

//       // ✅ STEP 1: Save email → get emailId
//       const emailId = await saveemail({
//         from: parsed.from?.text,
//         subject: parsed.subject,
//         date: parsed.date,
//         body: parsed.text,
//         regNo: regNo,
//         messageId: parsed.messageId,
//         inReplyTo: parsed.headers.get("in-reply-to") || null,
//       });

//       // ✅ STEP 2: Get attachments
//       const attachments = parsed.attachments || [];

//       if (attachments.length > 0) {
//         // ✅ STEP 3: Save to SSD
//         const savedFiles = await saveAttachmentsToSSD(attachments);

//         // ✅ STEP 4: Save in DB
//         await saveAttachmentsController(emailId, savedFiles);
//       }
//     }

//     connection.end();
//   } catch (err) {
//     console.error("Email Fetch Error:", err.message);
//   }
// }

module.exports = fetchEmails;