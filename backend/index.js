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

// --- THE FINAL, PRODUCTION-READY CORS SOLUTION ---
const corsOptions = {
  origin: (origin, callback) => {
    // Whitelist for local development
    const devWhitelist = ["http://localhost:5173", "http://127.0.0.1:5173"];

    // In production, your Render service URL will be the origin.
    // We check if the request origin is the same as your deployed backend URL.
    // The `!origin` check allows tools like Postman to work.
    const isAllowed =
      process.env.NODE_ENV !== "production"
        ? devWhitelist.includes(origin) || !origin
        : origin === process.env.CORS_ORIGIN || !origin;

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};

// --- Middleware Setup ---
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// --- Static File Serving for Production ---
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// --- Centralized Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 10000; // Render uses port 10000
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
