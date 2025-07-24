import express from "express";
import { ENV } from "./config/env.js";
import { connect } from "mongoose";
import { connectDB } from "./config/db.js";

const app = express();

connectDB();

app.get("/", (req, res) => res.send("Hello from the server!"))

app.listen(ENV.PORT, () => console.log("Server is running on port:",ENV.PORT));