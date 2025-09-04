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
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();
databaseConnection();

const app = express();
const __dirname = path.resolve();

// --- Production-Ready CORS Configuration ---
const whitelist = [
    process.env.CORS_ORIGIN, // Your deployed frontend URL from Render ENV VARS
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    // In production, the 'origin' will be your frontend URL.
    // The !origin check allows requests from tools like Postman or server-to-server.
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};

// --- Middleware Setup ---
app.use(helmet()); // Sets important security headers
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // For logging HTTP requests

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// --- Static File Serving for Production ---
// This block serves your built React app from the backend
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    // For any route not handled by the API, send the main HTML file.
    // This allows React Router to take over on the client-side.
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// --- Centralized Error Handler ---
// This must be the last piece of middleware.
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
