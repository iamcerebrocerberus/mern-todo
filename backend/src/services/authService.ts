import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/config/database";
import { RegisterRequest, LoginRequest, JwtPayload } from "@/types/auth";

class AuthService {
  private generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
    });
  }

  async register(data: RegisterRequest) {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }

  async login(data: LoginRequest) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  }
}

export default new AuthService();
