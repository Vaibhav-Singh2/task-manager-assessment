import { TaskPriority, TaskStatusFilter } from '@/types/task';

interface TaskFiltersProps {
  search: string;
  status: TaskStatusFilter;
  priority: '' | TaskPriority;
  onSearch: (value: string) => void;
  onStatus: (value: TaskStatusFilter) => void;
  onPriority: (value: '' | TaskPriority) => void;
}

export const TaskFilters = ({ status, priority, onStatus, onPriority }: TaskFiltersProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
      <div className="relative">
        <select
          value={status}
          onChange={(event) => onStatus(event.target.value as TaskStatusFilter)}
          className="appearance-none px-4 py-2 pl-10 pr-8 bg-surface-container-high text-on-surface border border-outline-variant/20 rounded-full font-body-md text-body-md flex items-center gap-2 hover:bg-surface-bright transition-colors outline-none focus:border-primary"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">filter_list</span>
      </div>
      
      <div className="relative">
        <select
          value={priority || 'all'}
          onChange={(event) => onPriority(event.target.value === 'all' ? '' : (event.target.value as TaskPriority))}
          className="appearance-none px-4 py-2 pl-10 pr-8 bg-surface-container-high text-on-surface border border-outline-variant/20 rounded-full font-body-md text-body-md flex items-center gap-2 hover:bg-surface-bright transition-colors outline-none focus:border-primary"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">low_priority</span>
      </div>
    </div>
  );
};
