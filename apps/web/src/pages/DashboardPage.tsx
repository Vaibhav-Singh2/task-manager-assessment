import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { SkeletonCard } from '@/components/feedback/SkeletonCard';
import { AlertBanner } from '@/components/feedback/AlertBanner';
import { useTasks } from '@/hooks/useTasks';

export const DashboardPage = () => {
  const { tasks, totalTasks, loading, error, search, setSearch, status, setStatus, priority, setPriority, sortBy, setSortBy, sortOrder, setSortOrder, page, limit, setPage, addTask, editTask, removeTask } = useTasks();
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // Derived stats for Bento Grid
  const activeTasks = tasks.filter(t => !t.completed).length;
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
  const completionRate = tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="p-gutter max-w-7xl w-full mx-auto space-y-stack-lg relative min-h-screen">
        {error && <AlertBanner message={error} />}

        {/* Summary Section: Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tasks Today */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 flex flex-col justify-between h-48 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Active Tasks</span>
              <span className="material-symbols-outlined text-primary">today</span>
            </div>
            <div>
              <h2 className="font-display-lg text-display-lg text-primary">{activeTasks < 10 ? `0${activeTasks}` : activeTasks}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Currently pending</p>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-inverse-primary rounded-xl p-6 flex items-center justify-between h-48 shadow-xl">
            <div className="flex flex-col justify-between h-full">
              <span className="font-label-sm text-label-sm text-primary-fixed opacity-80 uppercase tracking-widest">Completion Rate</span>
              <div>
                <h2 className="font-display-lg text-display-lg text-on-primary">{completionRate}<span className="text-headline-md">%</span></h2>
                <p className="font-body-md text-body-md text-on-primary opacity-70">Overall progress</p>
              </div>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle className="text-on-primary/10" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-on-primary" cx="48" cy="48" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * completionRate) / 100} strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary">trending_up</span>
              </div>
            </div>
          </div>

          {/* Overdue */}
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6 flex flex-col justify-between h-48 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <span className="font-label-sm text-label-sm text-error uppercase tracking-widest">Overdue</span>
              <span className="material-symbols-outlined text-error">priority_high</span>
            </div>
            <div>
              <h2 className="font-display-lg text-display-lg text-on-surface">{overdueTasks < 10 ? `0${overdueTasks}` : overdueTasks}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Immediate attention required</p>
            </div>
          </div>
        </section>

        {/* Filters & Task List */}
        <section className="space-y-stack-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-headline-lg text-headline-lg text-on-surface">Current Tasks</h3>
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

          {loading ? (
            <div className="grid gap-3" aria-live="polite">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
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
          )}
        </section>

        {/* FAB (Contextual for Dashboard) */}
        <button 
          onClick={() => setTaskModalOpen(true)}
          className="fixed bottom-10 right-10 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
        >
          <span className="material-symbols-outlined font-bold text-3xl">add</span>
        </button>

        {/* Create Task Modal */}
        {isTaskModalOpen && (
          <TaskForm 
            onClose={() => setTaskModalOpen(false)}
            onSubmit={async (payload) => {
              await addTask(payload);
              setTaskModalOpen(false);
            }} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};
