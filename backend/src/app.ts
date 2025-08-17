import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import prisma from "./config/database";

import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://localhost:3000",
    credentials: true,
  })
);

app.use(morgan("combined"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

prisma
  .$connect()
  .then(() => console.log("Database connected successfully"))
  .catch((err: any) => console.error("Database connection failed:", err));

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running!",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use('/api/auth', authRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    ...(process.env.NODE_ENV == "development" && { error: err.message }),
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: https://localhost:${PORT}/api/health`);
  console.log(`Auth endpoints`);
  console.log(`POST https://localhost:${PORT}/api/auth/register`)
  console.log(`POST https://localhost:${PORT}/api/auth/login`)
});


export default app;
