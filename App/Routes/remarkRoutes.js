const express = require ("express");
const authMiddleware = require("../Middelware/auth");
const { addRemark, getEmailRemarks } = require("../Controller/remarkController");

const RemakrRouter = express.Router();
RemakrRouter.post("/sendRemark" , authMiddleware ,addRemark)
RemakrRouter.post("/getRemark", authMiddleware , getEmailRemarks)
module.exports = RemakrRouter