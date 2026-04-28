const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Email Get & backend is running");
});

const fetchEmails = require("./App/Service/emailFetcher");
const { dbConnect } = require("./App/DataBase/db");
const router = require("./App/Routes/emailRoutes");
const Register_Router = require("./App/Routes/UserRoutes/registrationRoutes");
const GetUserRouter = require("./App/Routes/UserRoutes/getUserRoutes");
const GetEmailAssignRouter = require("./App/Routes/UserRoutes/emailAssingRoutes");
const ReplyRouter = require("./App/Routes/replyEmailRoutes");
const RemakrRouter = require("./App/Routes/remarkRoutes");
const attachRouter = require("./App/Routes/attachmentRoutes");
// fetchEmails();
dbConnect();  
  
app.use(
  cors({
    origin: process.env.HOST,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// app.use = ("/" ,  emailRoutes )     
app.use("/" , router) 
app.use("/api/user_Send_OTP" , Register_Router)
app.use("/api/getALLUsers", GetUserRouter)
app.use("/api/emailAssign",GetEmailAssignRouter)    
app.use("/api/replyEmail",ReplyRouter)
app.use("/api/remark", RemakrRouter)
app.use("/api/showattachment",attachRouter)
app.use("/attachments", require("express").static("D:/EmailAttachment"));
// async function startEmailPolling() {
//   await fetchEmails();
//   setInterval(async ()=>{
//     await fetchEmails();
//   },8000);
// }
// startEmailPolling();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
