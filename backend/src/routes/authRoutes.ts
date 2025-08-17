import { Router } from 'express';
import authController from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';

const router: Router = Router();

// POST /api/auth/register
router.post(
  '/register',
  validateRegister,        
  authController.register
);

// POST /api/auth/login
router.post(
  '/login',
  validateLogin,        
  authController.login
);

export default router;