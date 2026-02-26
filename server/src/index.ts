import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import formsRouter from "./routes/forms";
import submissionsRouter from "./routes/submissions";
import mondayRouter from "./routes/monday";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/forms", formsRouter);
app.use("/api/submissions", submissionsRouter);
app.use("/api/monday", mondayRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Using in-memory data store (no database required)");
});
