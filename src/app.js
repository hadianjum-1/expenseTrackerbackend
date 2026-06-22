import express from "express";
import connectDb from "../Config/Dbconnection.js";
import Userrouter from "./Users/user.route.js";
import expenseRouter from "./Expenses/expense.route.js";
import incomeRouter from "./Income/income.route.js";
import categoryRouter from "./Categories/category.route.js";
import dashboardRouter from "./Dashboard/dashboard.route.js";
import profileRouter from "./Profile/profile.route.js";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  CLIENT_ORIGIN
];

// Security
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { message: "Too many requests, please try again later." },
});
app.use(limiter);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", Userrouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/income", incomeRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/profile", profileRouter);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running 🚀" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server only after DB connects successfully
const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`✅ Server running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to database. Exiting.");
    process.exit(1);
  }
};

startServer();