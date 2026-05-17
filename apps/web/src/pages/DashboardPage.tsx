import { DashboardLayout } from '../layouts/DashboardLayout';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskList } from '../components/tasks/TaskList';
import { useTasks } from '../hooks/useTasks';

export const DashboardPage = () => {
  const { tasks, loading, search, setSearch, status, setStatus, priority, setPriority, addTask, editTask, removeTask } =
    useTasks();

  return (
    <DashboardLayout>
      <div className="space-y-4">
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
          <p className="rounded-xl bg-white p-6 text-center text-slate-500 shadow-sm">Loading tasks...</p>
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
