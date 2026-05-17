import { FormEvent, useState } from 'react';
import { TaskPriority } from '../../types/task';

interface TaskFormProps {
  onSubmit: (payload: { title: string; description?: string; priority: TaskPriority; dueDate: string }) => Promise<void>;
}

export const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    await onSubmit({ title, description: description || undefined, priority, dueDate });
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Task title"
        required
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      <input
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
        type="date"
        required
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value as TaskPriority)}
        className="rounded-md border border-slate-300 px-3 py-2"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description (optional)"
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 font-medium text-white md:col-span-2">
        Add Task
      </button>
    </form>
  );
};
