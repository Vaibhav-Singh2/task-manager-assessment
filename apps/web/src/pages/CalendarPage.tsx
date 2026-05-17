import { useMemo, useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useTasks } from '@/hooks/useTasks';

export const CalendarPage = () => {
  const { tasks, loading } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay, year, month };
  }, [currentDate]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getTasksForDate = (day: number) => {
    const dateStr = `${daysInMonth.year}-${String(daysInMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.dueDate.startsWith(dateStr));
  };

  return (
    <DashboardLayout>
      <div className="p-gutter max-w-7xl w-full mx-auto space-y-stack-lg relative min-h-screen pt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display-lg text-display-lg text-on-surface">Editorial Calendar</h2>
          <div className="flex items-center gap-4 bg-surface-container-high rounded-full px-4 py-2 border border-outline-variant/10">
            <button onClick={prevMonth} className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="font-headline-sm font-medium w-32 text-center">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={nextMonth} className="hover:text-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="h-100 flex items-center justify-center opacity-50">
            <span className="material-symbols-outlined animate-spin text-4xl">sync</span>
          </div>
        ) : (
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-surface-container/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center font-label-md text-label-md uppercase text-on-surface-variant tracking-widest border-r border-outline-variant/10 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[120px]">
              {Array.from({ length: daysInMonth.firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="border-r border-b border-outline-variant/10 bg-surface-container-lowest/50"></div>
              ))}
              {Array.from({ length: daysInMonth.days }).map((_, i) => {
                const day = i + 1;
                const dayTasks = getTasksForDate(day);
                const isToday = new Date().toDateString() === new Date(daysInMonth.year, daysInMonth.month, day).toDateString();
                
                return (
                  <div key={day} className={`border-r border-b border-outline-variant/10 p-2 hover:bg-surface-container-highest transition-colors flex flex-col gap-1 overflow-hidden ${isToday ? 'bg-primary/5' : ''}`}>
                    <span className={`font-body-md text-sm w-8 h-8 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-on-primary font-bold' : 'text-on-surface-variant'}`}>
                      {day}
                    </span>
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                      {dayTasks.map(task => (
                        <div key={task.id} className={`text-xs px-2 py-1 rounded truncate border ${task.completed ? 'bg-surface-container text-on-surface-variant border-outline-variant/20 line-through' : task.priority === 'high' ? 'bg-error-container/30 text-error border-error/20' : task.priority === 'medium' ? 'bg-secondary-container/50 text-secondary border-secondary/20' : 'bg-surface-container-high text-on-surface border-outline-variant/20'}`}>
                          {task.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
