import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { taskService } from '../services/taskService.js';
import { sendSuccess } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

const getUserId = (req: AuthRequest): string => {
  if (!req.userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  return req.userId;
};

const getTaskId = (req: AuthRequest): string => {
  const { id } = req.params;
  if (!id) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Task id is required');
  }

  return id;
};

export const taskController = {
  createTask: async (req: AuthRequest, res: Response): Promise<void> => {
    const task = await taskService.createTask(getUserId(req), req.body);
    sendSuccess(res, StatusCodes.CREATED, 'Task created successfully', task);
  },

  getTasks: async (req: AuthRequest, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await taskService.getTasks(getUserId(req), {
      status: req.query.status as 'completed' | 'pending' | undefined,
      priority: req.query.priority as 'low' | 'medium' | 'high' | undefined,
      search: req.query.search as string | undefined,
      tag: req.query.tag as string | undefined,
      sortBy: req.query.sortBy as 'dueDate' | 'createdAt' | undefined,
      sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
      page,
      limit
    });

    res.status(StatusCodes.OK).json({ success: true, data: result.tasks, total: result.total, page, limit });
  },

  updateTask: async (req: AuthRequest, res: Response): Promise<void> => {
    const task = await taskService.updateTask(getTaskId(req), getUserId(req), req.body);
    sendSuccess(res, StatusCodes.OK, 'Task updated successfully', task);
  },

  deleteTask: async (req: AuthRequest, res: Response): Promise<void> => {
    await taskService.deleteTask(getTaskId(req), getUserId(req));
    sendSuccess(res, StatusCodes.OK, 'Task deleted successfully');
  }
};
