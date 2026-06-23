import { Sendemail } from "./emailer.js";
import { Otpgenerator } from "./otgenrte.js";
import { otptemp } from "./otp.template.js";
import Usermodel from "./user.model.js";
import jwt from "jsonwebtoken";

export const Creatuser = async (req, res) => {
  try {
    const data = req.body || {};

    console.log('Signup request body:', data);

    const { Name, Email, Phone, password } = data;
    if (!Name || !Email || !Phone || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prevent duplicate users
    const existing = await Usermodel.findOne({ Email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const otp = Otpgenerator();

    const user = new Usermodel({
      ...data,
      otp: String(otp),
    });

    await user.save();
    console.log(`[DEBUG] Registration OTP for ${user.Email}: ${otp}`);

    try {
      await Sendemail(user.Email, "OTP Verification", otptemp(otp));
    } catch (mailErr) {
      console.error("Failed to send OTP email:", mailErr);
      // don't fail the request if email fails; user record is created
    }

    res.json({ message: "OTP sent successfully" });
    
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// create token
const Createtoken = async (user) => {
  const payload = {
  id: user._id,
  email: user.Email,
  name: user.Name,
  role: user.Role,
  Status: user.Status,
};
  // Token
  const token = await jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

export const sendEmail = async(req,res)=>{
   try{
    const {Email} = req.body;
    const otp = Otpgenerator();

    await Sendemail(
      Email,
      'OTP Verification',
      otptemp(otp)
    );

    res.json({
      message : "Email Delivered"
    });
  }
  catch(err){
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}

export const VerifyOtp = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { otp , Email} = req.body;

    console.log("OTP RECEIVED:", otp);

    const user = await Usermodel.findOne({ otp: String(otp), Email });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.json({
      message: "Account verified successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const Forgotpassword = async (req,res)=>{
  const {Email} = req.body;

  const user = await Usermodel.findOne({Email});

  if(!user){
    return res.status(404).json({
      message: "User not found",
    });
  }

  const otp = Otpgenerator();
  user.otp = otp;
  await user.save();
  console.log(`[DEBUG] Forgot Password OTP for ${user.Email}: ${otp}`);

  await Sendemail(
    user.Email,
    "Password Reset OTP",
    otptemp(otp)
  );

  res.json({
    message: "Reset OTP sent to your email",
  });
}

export const VerifyResetOtp = async (req, res) => {
  const { Email, otp } = req.body;
  const user = await Usermodel.findOne({ Email, otp: String(otp) });

  if (!user) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  res.json({
    message: "OTP Verified",
  });
};

export const ResetPassword = async (req, res) => {
  try {
    const { Email, password } = req.body;

    const user = await Usermodel.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    user.otp = null;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const Login = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { Email, password } = req.body;

    const user = await Usermodel.findOne({ Email });

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    console.log("MATCH:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = await Createtoken(user);

    const getCookieOptions = (req) => {
      const origin = req.headers.origin || "";
      const isSecureContext = origin.startsWith("https://") || req.secure || req.headers["x-forwarded-proto"] === "https";
      
      const options = {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: !!isSecureContext,
        sameSite: isSecureContext ? 'none' : 'lax',
        path: '/',
      };
      
      if (isSecureContext && process.env.DOMAIN && !process.env.DOMAIN.includes("localhost")) {
        options.domain = process.env.DOMAIN;
      }
      return options;
    };

    res.cookie('Authcontrol', token, getCookieOptions(req));

    res.json({
      message: 'Login successful',
      role: user.Role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

const getCookieOptions = (req) => {
  const origin = req.headers.origin || "";
  const isSecureContext = origin.startsWith("https://") || req.secure || req.headers["x-forwarded-proto"] === "https";
  
  const options = {
    httpOnly: true,
    secure: !!isSecureContext,
    sameSite: isSecureContext ? 'none' : 'lax',
    path: '/',
  };
  
  if (isSecureContext && process.env.DOMAIN && !process.env.DOMAIN.includes("localhost")) {
    options.domain = process.env.DOMAIN;
  }
  return options;
};

const invalid = async (req, res) => {
  res.clearCookie('Authcontrol', getCookieOptions(req));
  return res.status(401).json({ message: 'Unauthorized. Please log in.' });
}

export const AdminGuard = async (req,res,next)=>{
  try {
    const token = req.cookies.Authcontrol;

    if (!token) {
      return invalid(req, res);
    }

    const payload = jwt.verify(
      token,
      process.env.SECRET_KEY
    );

    req.user = payload;

    next();
  } catch (err) {
    return invalid(req, res);
  }
}
// user.controller.js

export const CheckAuth = async (req, res) => {
  // prevent caching of auth result
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Surrogate-Control': 'no-store',
  });

  try {
    const token = req.cookies && req.cookies.Authcontrol;
    if (!token) {
      return res.status(200).json({ authenticated: false });
    }

    const payload = jwt.verify(token, process.env.SECRET_KEY);

    return res.status(200).json({ authenticated: true, user: payload });
  } catch (err) {
    return res.status(200).json({ authenticated: false });
  }
};

export const Logout = async (req, res) => {
  res.clearCookie('Authcontrol', getCookieOptions(req));
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  });

  return res.status(200).json({ success: true, message: 'Logged out' });
};
export const test = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    res.send("hi iam test");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
