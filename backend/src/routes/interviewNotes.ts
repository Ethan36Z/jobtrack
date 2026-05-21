import { type NextFunction, type Request, type Response, Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { interviewNoteUpdateSchema } from "../validation/interviewNote.js";

export const interviewNotesRouter = Router();

interviewNotesRouter.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid interview note id" });
    }

    const data = interviewNoteUpdateSchema.parse(req.body);
    const interviewNote = await prisma.interviewNote.update({
      where: { id },
      data
    });

    res.json(interviewNote);
  } catch (error) {
    next(error);
  }
});

interviewNotesRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid interview note id" });
    }

    await prisma.interviewNote.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

interviewNotesRouter.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return res.status(404).json({ message: "Interview note not found" });
  }

  next(error);
});
