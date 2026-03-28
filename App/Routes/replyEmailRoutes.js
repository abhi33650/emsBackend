const express = require ("express");

const authMiddleware = require("../Middelware/auth");
const { SaveReplyEmailController } = require("../Controller/replyEmailController");
const ReplyRouter = express.Router();
ReplyRouter.post("/saveReplyEmail",authMiddleware, SaveReplyEmailController);
module.exports = ReplyRouter;