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

dotenv.config();
databaseConnection();

const app = express();

const __dirname = path.resolve();

// Middlewares
app.use(helmet()); // Helmet for security
app.use(morgan("dev")); // Morgan for logging
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corsOptions));

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

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
