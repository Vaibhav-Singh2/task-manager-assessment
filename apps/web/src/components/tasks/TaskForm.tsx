import { FormEvent, useState } from 'react';
import { TaskPriority } from '@/types/task';

interface TaskFormProps {
  onSubmit: (payload: { title: string; description?: string; priority: TaskPriority; dueDate: string; tags?: string[] }) => Promise<void>;
  onClose?: () => void;
}

export const TaskForm = ({ onSubmit, onClose }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagsString, setTagsString] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const parsedTags = tagsString
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await onSubmit({ title, description: description || undefined, priority, dueDate, tags: parsedTags });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-margin-mobile">
      {/* Creation Modal */}
      <div className="w-full max-w-2xl bg-surface-container-low border border-outline-variant/20 rounded-xl shadow-2xl overflow-hidden flex flex-col relative z-10">
        {/* Modal Header */}
        <div className="px-gutter py-stack-md bg-surface border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="font-headline-md text-headline-md text-on-surface">Create New Task</h3>
          <button onClick={onClose} type="button" className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={submit} className="flex flex-col flex-1 max-h-[80vh]">
          <div className="p-gutter overflow-y-auto space-y-stack-lg">
            {/* Task Title */}
            <div className="space-y-base">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" htmlFor="task-title">Task Identity</label>
              <input 
                className="w-full bg-transparent border-b border-outline-variant/30 text-headline-lg font-headline-lg px-0 py-2 focus:border-inverse-primary focus:ring-0 placeholder:text-on-surface-variant/30 transition-all outline-none" 
                id="task-title" 
                placeholder="Define the objective..." 
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {/* Description */}
              <div className="space-y-base md:col-span-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" htmlFor="task-desc">Context & Requirements</label>
                <textarea 
                  className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-stack-md py-stack-md text-body-lg font-body-lg focus:border-inverse-primary focus:ring-1 focus:ring-inverse-primary/20 placeholder:text-on-surface-variant/40 outline-none resize-none" 
                  id="task-desc" 
                  placeholder="Elaborate on the task details, stakeholders, and desired outcomes..." 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              {/* Due Date */}
              <div className="space-y-base">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" htmlFor="task-due">Deadline</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-stack-md py-stack-md text-body-md font-body-md focus:border-inverse-primary focus:ring-0 outline-none text-on-surface" 
                    id="task-due" 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">calendar_today</span>
                </div>
              </div>

              {/* Tags Input */}
              <div className="space-y-base">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest" htmlFor="task-tags">Categorization (Tags)</label>
                <div className="relative">
                  <input 
                    className="w-full bg-surface-container-highest border border-outline-variant/20 rounded-lg px-stack-md py-stack-md text-body-md font-body-md focus:border-inverse-primary focus:ring-0 outline-none text-on-surface placeholder:text-on-surface-variant/40" 
                    id="task-tags" 
                    type="text"
                    placeholder="e.g. backend, frontend, bug"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">label</span>
                </div>
              </div>
            </div>

            {/* Priority Segmented Control */}
            <div className="space-y-base">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Urgency Profile</label>
              <div className="flex relative bg-surface-container-highest p-1 rounded-xl border border-outline-variant/10 z-0">
                <div 
                  className="absolute inset-y-1 bg-surface border border-outline-variant/20 rounded-lg shadow-sm transition-all duration-300 ease-out -z-10"
                  style={{
                    width: 'calc(33.333% - 2.66px)',
                    transform: `translateX(${priority === 'low' ? '0' : priority === 'medium' ? '100%' : '200%'})`,
                    left: '4px'
                  }}
                />
                {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                  <button 
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-stack-sm font-label-sm text-label-sm rounded-lg transition-colors uppercase ${priority === p ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-gutter py-stack-lg bg-surface-container border-t border-outline-variant/10 flex flex-col-reverse md:flex-row justify-end gap-stack-md">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-3 rounded-lg border border-outline-variant/30 text-on-surface font-body-md font-medium hover:bg-surface-container-high active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-lg bg-primary-container text-on-primary-container font-headline-md text-body-md font-semibold shadow-lg shadow-primary-container/20 hover:bg-primary transition-all active:scale-[0.98]"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>

      {/* Decorative Grain/Texture Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] contrast-125 brightness-100 z-0" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMveCjZHCil0Wrp2scRH74KX6AwjnD4OY73xPkguddbrGGU2npmUAUbsqaMexTlJwKRey7GJKzcLVEt0WZy9GKDe5YRmWmtMHJaVbo_6mdZzQ3q3kLHFmhX5pAMl7-XE-5J9rPtYMKNJFfjEDt0Y5Th_1OAUvcuYxv7RyduwIvvrW3iaMnqOKOIfAY-kLoI5YOtoB8l3Z_0TauwNFjqzZCFGyroJMXjf94SRQsdj5QGBat50FBEfpfF_09w9b9AdqA0GmukSsmXV8')" }}></div>
    </div>
  );
};
