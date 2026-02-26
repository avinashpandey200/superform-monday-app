import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import formsRouter from "./routes/forms";
import submissionsRouter from "./routes/submissions";
import mondayRouter from "./routes/monday";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/superform";

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/forms", formsRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/monday", mondayRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
