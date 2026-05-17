import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { AuthRequest } from '../types/auth.js';
import { taskService } from '../services/taskService.js';
import { sendSuccess } from '../utils/response.js';

export const taskController = {
  createTask: async (req: AuthRequest, res: Response): Promise<void> => {
    const task = await taskService.createTask(req.userId!, req.body);
    sendSuccess(res, StatusCodes.CREATED, 'Task created successfully', task);
  },

  getTasks: async (req: AuthRequest, res: Response): Promise<void> => {
    const tasks = await taskService.getTasks(req.userId!, {
      status: req.query.status as 'completed' | 'pending' | undefined,
      priority: req.query.priority as 'low' | 'medium' | 'high' | undefined,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as 'dueDate' | 'createdAt' | undefined
    });

    res.status(StatusCodes.OK).json({ success: true, data: tasks });
  },

  updateTask: async (req: AuthRequest, res: Response): Promise<void> => {
    const task = await taskService.updateTask(req.params.id, req.userId!, req.body);
    sendSuccess(res, StatusCodes.OK, 'Task updated successfully', task);
  },

  deleteTask: async (req: AuthRequest, res: Response): Promise<void> => {
    await taskService.deleteTask(req.params.id, req.userId!);
    sendSuccess(res, StatusCodes.OK, 'Task deleted successfully');
  }
};
