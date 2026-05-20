import { type NextFunction, type Request, type Response, Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { applicationSchema, applicationUpdateSchema } from "../validation/application.js";

export const applicationsRouter = Router();

applicationsRouter.get("/", async (_req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: [{ followUpDate: "asc" }, { createdAt: "desc" }]
    });

    res.json(applications);
  } catch (error) {
    next(error);
  }
});

applicationsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const application = await prisma.application.findUnique({
      where: { id }
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
});

applicationsRouter.post("/", async (req, res, next) => {
  try {
    const data = applicationSchema.parse(req.body);
    const application = await prisma.application.create({ data });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
});

applicationsRouter.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    const data = applicationUpdateSchema.parse(req.body);
    const application = await prisma.application.update({
      where: { id },
      data
    });

    res.json(application);
  } catch (error) {
    next(error);
  }
});

applicationsRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid application id" });
    }

    await prisma.application.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

applicationsRouter.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return res.status(404).json({ message: "Application not found" });
  }

  next(error);
});
