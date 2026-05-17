import { FormEvent, useState } from 'react';
import { Task, TaskPriority } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (taskId: string, payload: Partial<Task>) => Promise<void>;
}

const getPriorityBadge = (priority: string): 'low' | 'medium' | 'high' => {
  if (priority === 'high') return 'high';
  if (priority === 'low') return 'low';
  return 'medium';
};

export const TaskList = ({ tasks, onToggleComplete, onDelete, onEdit }: TaskListProps) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const openEdit = (task: Task): void => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPriority(task.priority);
    setDueDate(task.dueDate.slice(0, 10));
  };

  const submitEdit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!editingTask) return;

    await onEdit(editingTask.id, {
      title,
      description: description || undefined,
      priority,
      dueDate
    });

    setEditingTask(null);
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-[var(--color-muted)]" aria-live="polite">
          No tasks found. Create one now.
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <ul className="grid gap-3" aria-live="polite">
        {tasks.map((task) => (
          <li key={task.id}>
            <Card>
              <CardContent className="space-y-3 pt-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className={`text-lg font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-[var(--color-foreground)]'}`}>
                      {task.title}
                    </h3>
                    {task.description && <p className="mt-1 text-sm text-[var(--color-muted)]">{task.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                    {task.completed && <Badge variant="success">completed</Badge>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-[var(--color-muted)]">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  <Button type="button" variant="outline" size="sm" aria-label={`Toggle completion for ${task.title}`} onClick={() => onToggleComplete(task)}>
                    {task.completed ? 'Mark pending' : 'Mark complete'}
                  </Button>
                  <Button type="button" variant="secondary" size="sm" aria-label={`Edit ${task.title}`} onClick={() => openEdit(task)}>
                    Edit
                  </Button>
                  <Button type="button" variant="destructive" size="sm" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="Edit task">
          <Card className="w-full max-w-lg">
            <CardContent className="space-y-4 pt-5">
              <h4 className="text-lg font-semibold">Edit Task</h4>
              <form onSubmit={submitEdit} className="space-y-3">
                <Input value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Task title" required />
                <Input value={description} onChange={(event) => setDescription(event.target.value)} aria-label="Task description" />
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value as TaskPriority)}
                  className="h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
                  aria-label="Task priority"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <Input value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" aria-label="Task due date" required />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
