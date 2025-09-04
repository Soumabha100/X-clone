import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();
databaseConnection();

const app = express();
const __dirname = path.resolve();

// --- Middleware Setup (Correct Order) ---
app.use(helmet()); // 1. Security headers first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 2. Cookie parser right after body parsers
app.use(morgan("dev"));

// --- Production-Ready CORS Configuration ---
const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = [
      process.env.CORS_ORIGIN,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ];

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};

// 3. Apply CORS ONLY to API routes, after cookies are parsed
app.use("/api/v1", cors(corsOptions));

// --- API Routes ---
// 4. API routes come after all general and CORS middleware
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// --- Static File Serving & Client-Side Routing for Production ---
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// --- Centralized Error Handler (Must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
