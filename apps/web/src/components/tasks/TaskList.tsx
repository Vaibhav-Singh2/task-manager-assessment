import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const getPriorityBadge = (priority: string): 'low' | 'medium' | 'high' => {
  if (priority === 'high') return 'high';
  if (priority === 'low') return 'low';
  return 'medium';
};

export const TaskList = ({ tasks, onToggleComplete, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return <Card><CardContent className="p-6 text-center text-(--color-muted)">No tasks found. Create one now.</CardContent></Card>;
  }

  return (
    <ul className="grid gap-3">
      {tasks.map((task) => (
        <li key={task.id}>
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-(--color-foreground)'}`}>{task.title}</h3>
                  {task.description && <p className="mt-1 text-sm text-(--color-muted)">{task.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Badge variant={getPriorityBadge(task.priority)}>{task.priority}</Badge>
                  {task.completed && <Badge variant="success">completed</Badge>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-(--color-muted)">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                <Button type="button" variant="outline" size="sm" onClick={() => onToggleComplete(task)}>
                  {task.completed ? 'Mark pending' : 'Mark complete'}
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(task.id)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
};
