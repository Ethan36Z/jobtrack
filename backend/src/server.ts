import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { ZodError } from "zod";
import { applicationsRouter } from "./routes/applications.js";
import { interviewNotesRouter } from "./routes/interviewNotes.js";
import { resumeVersionsRouter } from "./routes/resumeVersions.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: frontendOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/applications", applicationsRouter);
app.use("/api/interview-notes", interviewNotesRouter);
app.use("/api/resume-versions", resumeVersionsRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: error.flatten().fieldErrors
    });
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`JobTrack API listening on http://localhost:${port}`);
});
