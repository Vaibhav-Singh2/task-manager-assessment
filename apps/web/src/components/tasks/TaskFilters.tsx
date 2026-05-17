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

import { CustomSelect } from '@/components/common/CustomSelect';

export const TaskFilters = ({ status, priority, sortBy, sortOrder, onStatus, onPriority, onSortBy, onSortOrder }: TaskFiltersProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-visible pb-2 md:pb-0">
      <CustomSelect
        value={status}
        onChange={(val) => onStatus(val as TaskStatusFilter)}
        options={[
          { value: 'all', label: 'All Statuses' },
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' }
        ]}
        icon="filter_list"
        className="w-40 z-30"
      />
      
      <CustomSelect
        value={priority || 'all'}
        onChange={(val) => onPriority(val === 'all' ? '' : (val as TaskPriority))}
        options={[
          { value: 'all', label: 'All Priorities' },
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]}
        icon="low_priority"
        className="w-44 z-20"
      />

      <CustomSelect
        value={sortBy}
        onChange={(val) => onSortBy(val as 'dueDate' | 'createdAt')}
        options={[
          { value: 'dueDate', label: 'Due Date' },
          { value: 'createdAt', label: 'Date Created' }
        ]}
        icon="sort"
        className="w-44 z-10"
      />

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
