import { Request, Response, NextFunction } from 'express';

// Custom validation functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): boolean => {
  return !!password && password.length >= 6;
};

// Registration validation middleware
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;
  const errors: string[] = [];

  console.log('🔍 Validating registration:', { email, password: '***', name });

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (!isValidPassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  // Name validation (optional)
  if (name && (name.length < 2 || name.length > 50)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  if (errors.length > 0) {
    console.log('Validation failed:', errors);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  console.log('Validation passed');
  
  // Normalize email to lowercase
  req.body.email = email.toLowerCase().trim();
  if (name) {
    req.body.name = name.trim();
  }

  next();
};

// Login validation middleware
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  console.log('Validating login:', { email, password: '***' });

  // Email validation
  if (!email) {
    errors.push('Email is required');
  } else if (!isValidEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    console.log('Validation failed:', errors);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  console.log('Validation passed');
  
  // Normalize email
  req.body.email = email.toLowerCase().trim();

  next();
};;