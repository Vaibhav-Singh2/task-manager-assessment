import { DashboardLayout } from '@/layouts/DashboardLayout';

export const CalendarPage = () => {
  return (
    <DashboardLayout>
      <div className="p-gutter max-w-7xl w-full mx-auto space-y-stack-lg relative min-h-screen pt-10">
        <h2 className="font-display-lg text-display-lg text-on-surface">Editorial Calendar</h2>
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-10 flex flex-col items-center justify-center text-center opacity-70 min-h-[400px]">
          <span className="material-symbols-outlined text-[48px] text-primary mb-4">calendar_month</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Calendar View Coming Soon</p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mt-2">Visualize deadlines, publication schedules, and workload distribution across your editorial team.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};
