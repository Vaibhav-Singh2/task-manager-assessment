import { TaskPriority, TaskStatusFilter } from '@/types/task';

interface TaskFiltersProps {
  search: string;
  status: TaskStatusFilter;
  priority: '' | TaskPriority;
  sortBy: 'dueDate' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  onSearch: (value: string) => void;
  onStatus: (value: TaskStatusFilter) => void;
  onPriority: (value: '' | TaskPriority) => void;
  onSortBy: (value: 'dueDate' | 'createdAt') => void;
  onSortOrder: (value: 'asc' | 'desc') => void;
}

export const TaskFilters = ({ status, priority, sortBy, sortOrder, onStatus, onPriority, onSortBy, onSortOrder }: TaskFiltersProps) => {
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
      <div className="relative">
        <select
          value={sortBy}
          onChange={(event) => onSortBy(event.target.value as 'dueDate' | 'createdAt')}
          className="appearance-none px-4 py-2 pl-10 pr-8 bg-surface-container-high text-on-surface border border-outline-variant/20 rounded-full font-body-md text-body-md flex items-center gap-2 hover:bg-surface-bright transition-colors outline-none focus:border-primary"
        >
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Date Created</option>
        </select>
        <span className="material-symbols-outlined text-[18px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">sort</span>
      </div>

      <button
        onClick={() => onSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        className="w-10 h-10 flex items-center justify-center bg-surface-container-high hover:bg-surface-bright rounded-full border border-outline-variant/20 transition-colors"
        title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
      >
        <span className="material-symbols-outlined text-on-surface text-[20px]">
          {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
        </span>
      </button>
    </div>
  );
};
