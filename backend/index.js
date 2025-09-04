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

dotenv.config();
databaseConnection();

const app = express();
const __dirname = path.resolve();

app.set("trust proxy", 1);

// --- Middleware Setup ---
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Your CORS setup is fine, but we can simplify it for this setup.
// This allows requests from your Render URL and localhost.
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// ***** START OF THE FIX *****
// This is the new middleware to prevent API caching on Render.
// It will apply the 'no-store' cache policy to all routes starting with /api/v1
app.use("/api/v1", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
// ***** END OF THE FIX *****

// --- API Routes ---
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tweet", tweetRoute);
app.use("/api/v1/notifications", notificationRoute);

// --- Static File Serving & Client-Side Routing for Production ---
// This part is essential and should NOT be removed.
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.resolve(__dirname, "..", "frontend", "dist");
  app.use(express.static(frontendDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// --- Centralized Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
