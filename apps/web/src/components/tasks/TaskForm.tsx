import { FormEvent, useState } from 'react';
import { TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader><CardTitle>Create Task</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2">
          <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Task title" required />
          <Input value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" required />
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value as TaskPriority)}
            className="h-10 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description (optional)" />
          <Button type="submit" className="md:col-span-2">Add Task</Button>
        </form>
      </CardContent>
    </Card>
  );
};
