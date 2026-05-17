import { DashboardLayout } from '@/layouts/DashboardLayout';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskList } from '@/components/tasks/TaskList';
import { SkeletonCard } from '@/components/feedback/SkeletonCard';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { useTasks } from '@/hooks/useTasks';

export const DashboardPage = () => {
  const { tasks, loading, error, search, setSearch, status, setStatus, priority, setPriority, addTask, editTask, removeTask } =
    useTasks();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {error && <AlertBanner message={error} />}
        <TaskForm onSubmit={addTask} />
        <TaskFilters
          search={search}
          status={status}
          priority={priority}
          onSearch={setSearch}
          onStatus={setStatus}
          onPriority={setPriority}
        />
        {loading ? (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onToggleComplete={(task) => editTask(task.id, { completed: !task.completed })}
            onDelete={removeTask}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
