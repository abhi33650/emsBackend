const express = require ("express");
const { getemail, getThreadEmail, updateReadStatusController } = require("../Controller/emailController");
const authMiddleware = require("../Middelware/auth")
const router = express.Router();
router.get("/getAllEmails",authMiddleware, getemail);
router.post("/getAllThreads",authMiddleware, getThreadEmail)
router.post("/updateStatus",authMiddleware,updateReadStatusController)
module.exports = router;