import { Response } from 'express';
import { ApiSuccess } from '../types/api.js';

export const sendSuccess = <T>(
  response: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<ApiSuccess<T>> => {
  return response.status(statusCode).json({ success: true, message, data });
};
