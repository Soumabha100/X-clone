import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import tweetRoute from "./routes/tweetRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import cors from "cors";

// Load environment variables from the .env file.
dotenv.config({
  path: ".env",
});

// Establish the connection to the MongoDB database.
databaseConnection();

// Initialize the Express application.
const app = express();

// --- Middlewares ---
// These functions run for every incoming request.

// Parse URL-encoded bodies (as sent by HTML forms).
app.use(
  express.urlencoded({
    extended: true,
  })
);
// Parse JSON bodies (as sent by API clients).
app.use(express.json());
// Parse cookies attached to the client request.
app.use(cookieParser());

// Configure Cross-Origin Resource Sharing (CORS).
const corsOptions = {
  // Allow requests only from our frontend's origin.
  origin: "http://localhost:5173",
  // Allow cookies to be sent with requests.
  credentials: true,
};
app.use(cors(corsOptions));

// --- API Routes ---
// Mount the routers on their specific base paths.

// All routes related to users will be prefixed with /api/v1/user
app.use("/api/v1/user", userRoute);
// All routes related to tweets will be prefixed with /api/v1/tweet
app.use("/api/v1/tweet", tweetRoute);
// All routes related to notifications will be prefixed with /api/v1/notifications
app.use("/api/v1/notifications", notificationRoute);

// Start the server and listen for incoming requests on the specified port.
app.listen(process.env.PORT, () => {
  console.log(`Server listen at port ${process.env.PORT}`);
});
