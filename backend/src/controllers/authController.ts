import { Request, Response } from 'express';
import authService from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types/auth';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name }: RegisterRequest = req.body;

      const result = await authService.register({ email, password, name });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login user
  async login(req: Request, res: Response) {
    try {
      // Extract data from HTTP request
      const { email, password }: LoginRequest = req.body;

      // Call service (business logic)
      const result = await authService.login({ email, password });

      // Send HTTP response
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new AuthController();