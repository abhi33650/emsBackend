const express = require("express");
const { getRegisteredUser } = require("../../Controller/UserController/getUserController");
const authMiddleware = require("../../Middelware/auth")
const GetUserRouter = express.Router();

GetUserRouter.get("/get_ALL_Users",authMiddleware, getRegisteredUser)

module.exports = GetUserRouter;   