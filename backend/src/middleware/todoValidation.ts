import { Request, Response, NextFunction } from 'express';

export const validateCreateTodo = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  const errors: string[] = [];

  // Title validation
  if (!title) {
    errors.push('Title is required');
  } else if (typeof title !== 'string') {
    errors.push('Title must be a string');
  } else if (title.trim().length === 0) {
    errors.push('Title cannot be empty');
  } else if (title.length > 200) {
    errors.push('Title must be less than 200 characters');
  }

  // Description validation (optional)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string');
    } else if (description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Normalize data
  req.body.title = title.trim();
  if (description) {
    req.body.description = description.trim();
  }

  next();
};

export const validateUpdateTodo = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, completed } = req.body;
  const errors: string[] = [];

  // At least one field must be provided
  if (title === undefined && description === undefined && completed === undefined) {
    errors.push('At least one field (title, description, or completed) must be provided');
  }

  // Title validation (if provided)
  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push('Title must be a string');
    } else if (title.trim().length === 0) {
      errors.push('Title cannot be empty');
    } else if (title.length > 200) {
      errors.push('Title must be less than 200 characters');
    }
  }

  // Description validation (if provided)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      errors.push('Description must be a string');
    } else if (description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
  }

  // Completed validation (if provided)
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      errors.push('Completed must be a boolean');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Normalize data
  if (title !== undefined) {
    req.body.title = title.trim();
  }
  if (description !== undefined && description !== null) {
    req.body.description = description.trim();
  }

  next();
};