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

// Middleware
import errorHandler from './middleware/errorHandler.js'

// Make sure dotenv is configured at the very top
dotenv.config();
databaseConnection();

const app = express();

const __dirname = path.resolve();

// Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// --- START: PERMANENT & ROBUST CORS CONFIGURATION ---

const corsOptions = {
  origin: (origin, callback) => {
    // For debugging: log the origin of the incoming request
    console.log(`Incoming request from origin: ${origin}`);
    console.log(`Node environment is: ${process.env.NODE_ENV}`);

    // Define the list of allowed origins
    const whitelist = [
      process.env.CORS_ORIGIN, // Your Vercel URL from .env
    ];

    // During development, add local URLs to the whitelist
    if (process.env.NODE_ENV === "development") {
      whitelist.push("http://localhost:5173", "http://127.0.0.1:5173");
      // Add a regex to allow any local network IP
      whitelist.push(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:5173$/);
    }

    // Check if the origin is in the whitelist or if there's no origin (e.g., Postman)
    // The .some() method will check both strings and the regex pattern.
    if (
      !origin ||
      whitelist.some((url) =>
        typeof url === "string" ? url === origin : url.test(origin)
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error("This origin is not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// --- END: PERMANENT & ROBUST CORS CONFIGURATION ---

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// This code is for deployment on Render
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
  });
}

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
