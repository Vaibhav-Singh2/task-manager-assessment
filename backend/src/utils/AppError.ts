import { ZodIssue } from 'zod';

export class AppError extends Error {
  statusCode: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(statusCode: number, message: string, issues?: ZodIssue[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = issues?.map((issue) => ({ field: issue.path.join('.') || 'body', message: issue.message }));
  }
}
