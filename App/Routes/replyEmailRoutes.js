const express = require ("express");

const authMiddleware = require("../Middelware/auth");
const { SaveReplyEmailController } = require("../Controller/replyEmailController");
const {upload} = require("../Middelware/multer")
const ReplyRouter = express.Router();
// ReplyRouter.post("/saveReplyEmail",authMiddleware, SaveReplyEmailController);

ReplyRouter.post("/saveReplyEmail",upload.single("file"), SaveReplyEmailController);

module.exports = ReplyRouter;