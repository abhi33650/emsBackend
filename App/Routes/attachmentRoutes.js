const express = require("express");
const authMiddleware = require("../Middelware/auth");
const { GetEmailAttachmentController , DownloadAttachmentController } = require("../Controller/attachmentController");
const attachRouter = express.Router();
attachRouter.post("/attachment",authMiddleware, GetEmailAttachmentController)
// attachRouter.get("/download/:id",DownloadAttachmentController); 
attachRouter.post("/download", DownloadAttachmentController);
module.exports= attachRouter;