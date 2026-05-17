import { FilterQuery, HydratedDocument, Types } from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { ITask, TaskModel, TaskPriority } from '../models/TaskModel.js';
import { AppError } from '../utils/AppError.js';

interface TaskQuery {
  status?: 'completed' | 'pending';
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt';
}

interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: string;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  completed?: boolean;
}

const ensureOwnership = async (taskId: string, userId: string): Promise<HydratedDocument<ITask>> => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  const task = await TaskModel.findById(taskId);
  if (!task) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Task not found');
  }

  if (String(task.userId) !== userId) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Forbidden');
  }

  return task;
};

export const taskService = {
  createTask: async (userId: string, payload: CreateTaskInput): Promise<ITask> => {
    const task = await TaskModel.create({
      userId,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: new Date(payload.dueDate)
    });

    return task;
  },

  getTasks: async (userId: string, query: TaskQuery): Promise<ITask[]> => {
    const filters: FilterQuery<ITask> = { userId };

    if (query.status === 'completed') {
      filters.completed = true;
    }

    if (query.status === 'pending') {
      filters.completed = false;
    }

    if (query.priority) {
      filters.priority = query.priority;
    }

    if (query.search) {
      filters.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    const sortField = query.sortBy ?? 'dueDate';

    return TaskModel.find(filters).sort({ [sortField]: 1, createdAt: 1 });
  },

  updateTask: async (taskId: string, userId: string, payload: UpdateTaskInput): Promise<ITask> => {
    const task = await ensureOwnership(taskId, userId);

    if (payload.title !== undefined) task.title = payload.title;
    if (payload.description !== undefined) task.description = payload.description;
    if (payload.priority !== undefined) task.priority = payload.priority;
    if (payload.dueDate !== undefined) task.dueDate = new Date(payload.dueDate);
    if (payload.completed !== undefined) task.completed = payload.completed;

    await task.save();
    return task;
  },

  deleteTask: async (taskId: string, userId: string): Promise<void> => {
    const task = await ensureOwnership(taskId, userId);
    await task.deleteOne();
  }
};
