import express, { Request, Response } from "express";

import { CategoryService } from "../services/categoryService";
import { requireRole, authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const categoryService = new CategoryService();

router.get("/api/categories", async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

//@ts-ignore
router.get("/api/category/:id", async (req: Request, res: Response) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/api/createCategory",
  authMiddleware,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const { name, description } = req.body;
      const category = await categoryService.createCategory(
        { name, description },
        req.currentUser!.id
      );
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  "/api/updateCategory/:id",
  requireRole("admin"),
  async (req, res) => {
    try {
      const category = await categoryService.updateCategory(
        req.params.id,
        req.body,
        req.currentUser!.id
      );
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete(
  "/api/deleteCategory/:id",
  requireRole("admin"),
  async (req, res) => {
    try {
      await categoryService.deleteCategory(req.params.id, req.currentUser!.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

export { router as categoryRouter };
