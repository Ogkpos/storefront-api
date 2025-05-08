import express, { Request, Response } from "express";
import { ProductService } from "../services/productService";
import { requireRole, authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const productService = new ProductService();

router.get(
  "/api/product/category/:categoryId",
  async (req: Request, res: Response) => {
    try {
      const products = await productService.getProductsByCategory(
        req.params.categoryId
      );
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get(
  "/api/product/:id",
  //@ts-ignore
  async (req: Request, res: Response) => {
    try {
      const product = await productService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.post(
  "/api/product/create",
  authMiddleware,
  requireRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const { name, description, price, stock, categoryId } = req.body;
      const product = await productService.createProduct(
        { name, description, price, stock, categoryId },
        req.currentUser!.id
      );
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.put(
  "/api/product/update/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      const product = await productService.updateProduct(
        req.params.id,
        req.body,
        req.currentUser!.id
      );
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.delete(
  "/api/product/delete/:id",
  authMiddleware,
  requireRole("admin"),
  async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id, req.currentUser!.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
);

export { router as productRouter };
