import { Task } from '../../types/task';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}

const priorityBadge: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-rose-100 text-rose-700'
};

export const TaskList = ({ tasks, onToggleComplete, onDelete }: TaskListProps) => {
  if (tasks.length === 0) {
    return <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">No tasks found. Create one now.</p>;
  }

  return (
    <ul className="grid gap-3">
      {tasks.map((task) => (
        <li key={task.id} className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className={`text-lg font-semibold ${task.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {task.title}
              </h3>
              {task.description && <p className="mt-1 text-sm text-slate-600">{task.description}</p>}
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${priorityBadge[task.priority]}`}>{task.priority}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="text-slate-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            <button type="button" onClick={() => onToggleComplete(task)} className="rounded-md border px-2 py-1">
              {task.completed ? 'Mark pending' : 'Mark complete'}
            </button>
            <button type="button" onClick={() => onDelete(task.id)} className="rounded-md bg-red-600 px-2 py-1 text-white">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
