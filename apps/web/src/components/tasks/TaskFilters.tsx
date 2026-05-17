import { TaskPriority, TaskStatusFilter } from '@/types/task';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface TaskFiltersProps {
  search: string;
  status: TaskStatusFilter;
  priority: '' | TaskPriority;
  onSearch: (value: string) => void;
  onStatus: (value: TaskStatusFilter) => void;
  onPriority: (value: '' | TaskPriority) => void;
}

export const TaskFilters = ({ search, status, priority, onSearch, onStatus, onPriority }: TaskFiltersProps) => {
  return (
    <Card>
      <CardContent className="grid gap-3 pt-5 md:grid-cols-3">
        <Input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search title or description" />
        <select
          value={status}
          onChange={(event) => onStatus(event.target.value as TaskStatusFilter)}
          className="h-10 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={priority || 'all'}
          onChange={(event) => onPriority(event.target.value === 'all' ? '' : (event.target.value as TaskPriority))}
          className="h-10 rounded-md border border-(--color-border) bg-(--color-surface) px-3 py-2 text-sm"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </CardContent>
    </Card>
  );
};
