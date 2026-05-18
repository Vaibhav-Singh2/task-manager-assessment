import { z } from 'zod';

const dueDateSchema = z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Due date must be a valid date');

export const createTaskSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: dueDateSchema,
  tags: z.array(z.string().trim().max(30)).max(10).optional().default([])
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(100).optional(),
    description: z.string().trim().max(500).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    dueDate: dueDateSchema.optional(),
    completed: z.boolean().optional(),
    tags: z.array(z.string().trim().max(30)).max(10).optional()
  })
  .refine((body) => Object.keys(body).length > 0, 'At least one field must be updated');
