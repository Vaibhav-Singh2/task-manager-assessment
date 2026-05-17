import { ChangeEvent } from 'react';
import { TaskPriority, TaskStatusFilter } from '../../types/task';

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
    <section className="grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-3">
      <input
        value={search}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
        placeholder="Search title or description"
        className="rounded-md border border-slate-300 px-3 py-2"
      />
      <select
        value={status}
        onChange={(event) => onStatus(event.target.value as TaskStatusFilter)}
        className="rounded-md border border-slate-300 px-3 py-2"
      >
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
      <select
        value={priority}
        onChange={(event) => onPriority(event.target.value as '' | TaskPriority)}
        className="rounded-md border border-slate-300 px-3 py-2"
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </section>
  );
};
