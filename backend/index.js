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

// --- General Middleware (applied to all requests) ---
app.use(helmet()); // Sets important security headers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev")); // For logging HTTP requests

// --- Production-Ready CORS Configuration ---
const corsOptions = {
  origin: (origin, callback) => {
    // Define your whitelist
    const whitelist = [
      process.env.CORS_ORIGIN, // Your deployed frontend URL from Render ENV VARS
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ];

    // Check if the origin is in the whitelist or if it's not a browser request (e.g., Postman)
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};

// --- THE FIX: Apply CORS ONLY to API routes ---
// All routes starting with /api/v1 will use our CORS policy.
// Static file requests (like for CSS and JS) will bypass this.
app.use("/api/v1", cors(corsOptions));

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// --- Static File Serving & Client-Side Routing for Production ---
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    // For any route that isn't an API route, send the React app's entry point.
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// --- Centralized Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
