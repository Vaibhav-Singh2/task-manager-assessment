import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { authService } from '../services/authService.js';
import { sendSuccess } from '../utils/response.js';

export const authController = {
  register: async (req: AuthRequest, res: Response): Promise<void> => {
    const data = await authService.register(req.body);
    sendSuccess(res, StatusCodes.CREATED, 'User registered successfully', data);
  },

  login: async (req: AuthRequest, res: Response): Promise<void> => {
    const data = await authService.login(req.body);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Authentication successful',
      token: data.token,
      user: data.user
    });
  }
};
