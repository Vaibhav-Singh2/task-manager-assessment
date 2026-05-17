import { Schema, Types, model } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface ITask {
  id: string;
  userId: Types.ObjectId;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

taskSchema.index({ userId: 1, completed: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });

export const TaskModel = model<ITask>('Task', taskSchema);
