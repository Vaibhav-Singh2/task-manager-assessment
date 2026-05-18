import { DashboardLayout } from '@/layouts/DashboardLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { SkeletonCard } from '@/components/feedback/SkeletonCard';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { useTasks } from '@/hooks/useTasks';

export const TasksPage = () => {
  const { tasks, totalTasks, loading, error, search, setSearch, status, setStatus, priority, setPriority, sortBy, setSortBy, sortOrder, setSortOrder, page, limit, setPage, editTask, removeTask } = useTasks();

  return (
    <DashboardLayout>
      <div className="p-gutter max-w-7xl w-full mx-auto space-y-stack-lg relative min-h-screen">
        {error && <AlertBanner message={error} />}
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-10">
          <h2 className="font-display-lg text-display-lg text-on-surface">My Tasks</h2>
          <TaskFilters
            search={search}
            status={status}
            priority={priority}
            onSearch={setSearch}
            onStatus={setStatus}
            onPriority={setPriority}
            sortBy={sortBy}
            onSortBy={setSortBy}
            sortOrder={sortOrder}
            onSortOrder={setSortOrder}
          />
        </div>

        {loading && tasks.length === 0 ? (
          <div className="grid gap-3" aria-live="polite">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className={`transition-opacity duration-300 relative ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <TaskList
              tasks={tasks}
              totalTasks={totalTasks}
              page={page}
              limit={limit}
              onPageChange={setPage}
              onToggleComplete={(task) => editTask(task.id, { completed: !task.completed })}
              onDelete={removeTask}
              onEdit={editTask}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
