import { Router } from "express";
import { Creatuser, test ,Login, sendEmail, VerifyOtp, Forgotpassword, VerifyResetOtp, ResetPassword, AdminGuard, CheckAuth, Logout } from "./user.controller.js";

const Userrouter = Router();

Userrouter.post("/signup", Creatuser);
Userrouter.post("/login", Login);
Userrouter.post('/sendemail' , sendEmail)
Userrouter.post("/verify-otp", VerifyOtp);
Userrouter.post("/forgot-password", Forgotpassword);
Userrouter.post("/verify-reset-otp", VerifyResetOtp);
Userrouter.post("/reset-password", ResetPassword);
Userrouter.post("/sesion", AdminGuard,(req , res )=>{res.json({message : "Sucess"})});
Userrouter.get("/check-auth", CheckAuth);
Userrouter.post('/logout', Logout);
Userrouter.get("/test", test);

export default Userrouter;