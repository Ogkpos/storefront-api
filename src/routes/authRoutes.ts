import express, { Request, Response } from "express";

import authService from "../services/authService";

const router = express.Router();

router.post("/api/register", async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.register(email, password, role);
    req.session = { jwt: result.token };
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    req.session = { jwt: result.token };
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export { router as authRouter };
