import { FormEvent, useState } from 'react';
import { Task, TaskPriority } from '@/types/task';
import { CustomSelect } from '@/components/common/CustomSelect';

interface TaskListProps {
  tasks: Task[];
  totalTasks: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onToggleComplete: (task: Task) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onEdit: (taskId: string, payload: Partial<Task>) => Promise<void>;
}

export const TaskList = ({ tasks, totalTasks, page, limit, onPageChange, onToggleComplete, onDelete, onEdit }: TaskListProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Edit State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');

  const openDetails = (task: Task): void => {
    setActiveTask(task);
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPriority(task.priority);
    setDueDate(task.dueDate.slice(0, 10));
  };

  const submitEdit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    if (!activeTask) return;

    await onEdit(activeTask.id, {
      title,
      description: description || undefined,
      priority,
      dueDate
    });

    setActiveTask(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden p-6 text-center">
        <p className="text-on-surface-variant font-body-md">No tasks found. Create one now.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/10 bg-surface-container/50">
                <th className="px-6 py-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Task Title</th>
                <th className="px-6 py-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-right font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-surface-container-high transition-colors group cursor-pointer" onClick={() => openDetails(task)}>
                  <td className="px-6 py-5">
                    {task.completed ? (
                      <div className="flex items-center gap-2 text-on-surface-variant opacity-60">
                        <span className="material-symbols-outlined text-[20px]">check_circle</span>
                        <span className="font-body-md text-body-md">Done</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-error' : task.priority === 'low' ? 'bg-outline' : 'bg-primary'}`}></div>
                        <span className={`font-body-md text-body-md ${task.priority === 'high' ? 'text-error' : 'text-on-surface'}`}>
                          {new Date(task.dueDate) < new Date() ? 'Overdue' : 'In Progress'}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <p className={`font-headline-md text-headline-md ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{task.title}</p>
                      {task.description && <p className="font-body-md text-body-md text-on-surface-variant text-sm truncate max-w-xs">{task.description}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full font-label-sm text-label-sm uppercase ${
                      task.priority === 'high' ? 'bg-error-container/30 text-error' : 
                      task.priority === 'low' ? 'bg-surface-container-high text-on-surface-variant' : 
                      'bg-secondary-container/50 text-secondary'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 ${task.completed ? 'text-on-surface-variant opacity-60' : new Date(task.dueDate) < new Date() ? 'text-error' : 'text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[18px]">
                        {task.completed ? 'event_available' : new Date(task.dueDate) < new Date() ? 'warning' : 'event'}
                      </span>
                      <span className="font-body-md text-body-md">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openDetails(task); }} 
                      className="p-2 hover:bg-surface-container-highest rounded-lg transition-colors text-on-surface-variant group-hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Task List Footer */}
        <div className="px-6 py-4 bg-surface-container/30 border-t border-outline-variant/10 flex items-center justify-between">
          <p className="font-body-md text-body-md text-on-surface-variant">Showing {Math.min((page - 1) * limit + 1, totalTasks)} to {Math.min(page * limit, totalTasks)} of {totalTasks} tasks</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onPageChange(page - 1)} 
              disabled={page === 1}
              className={`p-2 rounded-lg transition-colors ${page === 1 ? 'text-on-surface-variant/30 cursor-not-allowed' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={() => onPageChange(page + 1)} 
              disabled={page * limit >= totalTasks}
              className={`p-2 rounded-lg transition-colors ${page * limit >= totalTasks ? 'text-on-surface-variant/30 cursor-not-allowed' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'}`}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Detail Panel */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Overlay Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setActiveTask(null)}></div>
          
          {/* Panel Content */}
          <div className="relative w-full max-w-2xl bg-surface border-l border-outline-variant/20 shadow-2xl h-full flex flex-col overflow-hidden">
            {/* Panel Header */}
            <header className="px-stack-lg py-stack-md flex items-center justify-between border-b border-outline-variant/10 bg-surface">
              <div className="flex items-center gap-stack-sm">
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm uppercase">
                  {activeTask.completed ? 'COMPLETED' : 'IN PROGRESS'}
                </span>
                <span className="text-on-surface-variant text-label-sm font-label-sm">• {activeTask.id.slice(0, 8)}</span>
              </div>
              <div className="flex items-center gap-stack-sm">
                <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface-variant">
                  <span className="material-symbols-outlined">share</span>
                </button>
                <button onClick={() => setActiveTask(null)} className="ml-2 p-2 hover:bg-surface-container-high rounded-full transition-colors text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </header>

            {/* Panel Body Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-stack-lg custom-scrollbar space-y-stack-lg">
              <form id="edit-task-form" onSubmit={submitEdit} className="space-y-stack-lg">
                <section className="space-y-stack-sm">
                  <h4 className="font-label-sm text-label-sm text-outline tracking-widest uppercase">Task Title</h4>
                  <input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-stack-md py-stack-md text-headline-md font-headline-md focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary/20 outline-none text-on-surface"
                    required
                  />
                </section>

                <div className="flex flex-wrap gap-gutter text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    <input 
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="bg-transparent border-b border-outline-variant/30 text-on-surface font-body-md focus:border-inverse-primary focus:ring-0 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 relative z-50">
                    <CustomSelect
                      value={priority}
                      onChange={(val) => setPriority(val as TaskPriority)}
                      options={[
                        { value: 'low', label: 'Low' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'high', label: 'High' }
                      ]}
                      icon="flag"
                      className="w-40"
                      buttonClassName="bg-transparent border-0 border-b border-outline-variant/30 rounded-none px-0 pl-8"
                    />
                  </div>
                </div>

                <section className="space-y-stack-sm">
                  <h4 className="font-label-sm text-label-sm text-outline tracking-widest uppercase">Description</h4>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full h-32 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-stack-md py-stack-md text-body-lg font-body-lg focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary/20 outline-none resize-none text-on-surface"
                    placeholder="Task details..."
                  ></textarea>
                </section>
                
                <div className="flex justify-end gap-2">
                  <button type="submit" className="px-6 py-2 bg-primary-container text-on-primary-container rounded-lg font-medium hover:bg-primary transition-colors">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Panel Footer Sticky Actions */}
            <footer className="p-stack-lg border-t border-outline-variant/10 bg-surface flex items-center justify-between">
              <button 
                onClick={async () => {
                  await onDelete(activeTask.id);
                  setActiveTask(null);
                }}
                className="flex items-center gap-2 text-error font-medium px-4 py-3 hover:bg-error-container/10 rounded-xl transition-all active:scale-[0.97]"
              >
                <span className="material-symbols-outlined">delete</span>
                Delete Task
              </button>
              
              <button 
                onClick={async () => {
                  await onToggleComplete(activeTask);
                  setActiveTask(null);
                }}
                className={`flex-1 max-w-50 flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all ${activeTask.completed ? 'bg-surface-container-high text-on-surface' : 'bg-inverse-primary text-white shadow-inverse-primary/20'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {activeTask.completed ? 'undo' : 'check_circle'}
                </span>
                {activeTask.completed ? 'Mark Pending' : 'Complete Task'}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};
