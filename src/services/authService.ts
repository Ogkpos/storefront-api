import bcrypt from "bcryptjs";
import prisma from "../prismaClient/prismaClient";
import { generateToken } from "../middlewares/authMiddleware";

class AuthService {
  async register(email: string, password: string, role?: "admin" | "customer") {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      token: generateToken(user.id.toString(), user.email, user.role),
    };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    return {
      id: user.id.toString(),
      email: user.email,
      role: user.role,
      token: generateToken(user.id.toString(), user.email, user.role),
    };
  }
}

export default new AuthService();
