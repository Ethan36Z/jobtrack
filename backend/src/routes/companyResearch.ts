import { type NextFunction, type Request, type Response, Router } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { companyResearchUpdateSchema } from "../validation/companyResearch.js";

export const companyResearchRouter = Router();

companyResearchRouter.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid company research id" });
    }

    const data = companyResearchUpdateSchema.parse(req.body);
    const companyResearch = await prisma.companyResearch.update({
      where: { id },
      data
    });

    res.json(companyResearch);
  } catch (error) {
    next(error);
  }
});

companyResearchRouter.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid company research id" });
    }

    await prisma.companyResearch.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

companyResearchRouter.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
    return res.status(404).json({ message: "Company research not found" });
  }

  next(error);
});
