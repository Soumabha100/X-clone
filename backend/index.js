import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import cors from "cors";
import path from "path";

// Load environment variables
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
  });
}

// Start the server
const PORT = process.env.PORT || 8000;
// FIX: Added '0.0.0.0' to accept requests from the local network
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening at port ${PORT}`);
});
