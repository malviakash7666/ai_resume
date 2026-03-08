import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "../src/modules/user/user.routes.js";
import resumeRoutes from "../src/modules/resume/resume.routes.js";
const app = express();

/* =========================
   Global Middlewares
========================= */

// Enable CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // default frontend URL
    credentials: true, // ✅ required for cookies
  })
);

// Parse JSON
app.use(express.json());

// Parse URL encoded data
app.use(express.urlencoded({ extended: true }));

// Parse Cookies
app.use(cookieParser());

/* =========================
   Health Check Route
========================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Running Successfully 🚀",
  });
});

/* =========================
   Example Route Structure
========================= */

// Example future route
// import userRoutes from "./routes/user.routes.js";
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);

/* =========================
   404 Handler
========================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* =========================
   Global Error Handler
========================= */

app.use((err, req, res, next) => {
  console.error("ERROR 💥", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;