import express from "express";
import cors from 'cors';
import clerkmiddleware from "@clerk/express";

import userRoutes from './routes/user.route.js';
import { ENV } from "./config/env.js";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";

const app = express();

app.use(cors())
app.use(express.json())

app.use(clerkmiddleware());


app.get("/", (req, res) => res.send("Hello from the server!"))

app.use("/api/users", userRoutes);


const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

export default app;