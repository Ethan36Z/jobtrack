import { type NextFunction, type Request, type Response, Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { resumeVersionSchema, resumeVersionUpdateSchema } from "../validation/resumeVersion.js";

export const resumeVersionsRouter = Router();

resumeVersionsRouter.get("/", async (_req, res, next) => {
  try {
    const resumeVersions = await prisma.resumeVersion.findMany({
      orderBy: { updatedAt: "desc" }
    });

    res.json(resumeVersions);
  } catch (error) {
    next(error);
  }
});

resumeVersionsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid resume version id" });
    }

    const resumeVersion = await prisma.resumeVersion.findUnique({
      where: { id }
    });

    if (!resumeVersion) {
      return res.status(404).json({ message: "Resume version not found" });
    }

    res.json(resumeVersion);
  } catch (error) {
    next(error);
  }
});

resumeVersionsRouter.post("/", async (req, res, next) => {
  try {
    const data = resumeVersionSchema.parse(req.body);
    const resumeVersion = await prisma.resumeVersion.create({ data });

    res.status(201).json(resumeVersion);
  } catch (error) {
    next(error);
  }
});

resumeVersionsRouter.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid resume version id" });
    }

    const data = resumeVersionUpdateSchema.parse(req.body);
    const resumeVersion = await prisma.resumeVersion.update({
      where: { id },
      data
    });

    res.json(resumeVersion);
  } catch (error) {
    next(error);
  }
});

resumeVersionsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid resume version id" });
    }

    await prisma.resumeVersion.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

resumeVersionsRouter.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return res.status(404).json({ message: "Resume version not found" });
  }

  next(error);
});
