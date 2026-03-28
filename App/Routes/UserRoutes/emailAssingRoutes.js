const express = require('express');
const { AsignEmailToUser, getMyAsignEmail, UsergetMyAsignEmail } = require('../../Controller/UserController/emailAssingController');
const authMiddleware = require("../../Middelware/auth")
const GetEmailAssignRouter = express.Router();
GetEmailAssignRouter.post("/assign_email_to_user",authMiddleware, AsignEmailToUser);
GetEmailAssignRouter.post("/get_my_assign_email",authMiddleware, getMyAsignEmail);
GetEmailAssignRouter.get("/user_get_assignEmail",authMiddleware, UsergetMyAsignEmail)
module.exports = GetEmailAssignRouter;