import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import cors from "cors";
import path from "path";

// Load environment variables from the .env file in the current directory
dotenv.config();

// Establish the connection to the MongoDB database.
databaseConnection();

const app = express();

// --- Define __dirname for ES Modules ---
const __dirname = path.resolve();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// --- Static Files Middleware for Production ---
// FIX: Corrected path to go up one directory level to find the frontend build
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// FIX: Corrected path for the catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start the server
app.listen(process.env.PORT || 8000, () => {
  console.log(`Server listening at port ${process.env.PORT || 8000}`);
});