import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
): Response => {
  void next;
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Resource validation failed',
      errors: error.issues.map((issue) => ({ field: issue.path.join('.') || 'body', message: issue.message }))
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
