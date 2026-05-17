import { DashboardLayout } from '@/layouts/DashboardLayout';

export const TasksPage = () => {
  return (
    <DashboardLayout>
      <div className="p-gutter max-w-7xl w-full mx-auto space-y-stack-lg relative min-h-screen pt-10">
        <h2 className="font-display-lg text-display-lg text-on-surface">My Tasks</h2>
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-10 flex flex-col items-center justify-center text-center opacity-70 min-h-100">
          <span className="material-symbols-outlined text-[48px] text-primary mb-4">checklist</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Dedicated Task View Coming Soon</p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">Manage all your personalized tasks, bulk actions, and deep filtering here in a future update.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};
