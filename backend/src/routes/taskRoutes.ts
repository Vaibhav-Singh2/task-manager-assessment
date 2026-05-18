import { Router } from 'express';
import { taskController } from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validateBody } from '../middleware/validateBody.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';

export const taskRouter = Router();

taskRouter.use(authMiddleware);
taskRouter.get('/', asyncHandler(taskController.getTasks));
taskRouter.post('/', validateBody(createTaskSchema), asyncHandler(taskController.createTask));
taskRouter.put('/:id', validateBody(updateTaskSchema), asyncHandler(taskController.updateTask));
taskRouter.delete('/:id', asyncHandler(taskController.deleteTask));
