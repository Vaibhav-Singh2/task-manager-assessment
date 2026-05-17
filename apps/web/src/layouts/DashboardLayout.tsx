import { ReactNode, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Link, useSearchParams } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };
  
  const currentSearch = searchParams.get('search') || '';

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* SideNavBar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-70 bg-surface-container-low border-r border-outline-variant/10 flex-col py-stack-lg z-50">
        <div className="px-6 mb-stack-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-inverse-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary">task_alt</span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md tracking-tight text-on-surface">Stitch Editorial</h1>
              <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 uppercase">Workspace</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-2">
          <Link to="/dashboard" className="border-l-4 border-inverse-primary bg-secondary-container text-on-secondary-container font-medium flex items-center px-4 py-3 active:scale-[0.97] transform transition-transform">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            <span className="font-body-md text-body-md">Dashboard</span>
          </Link>
          <Link to="/tasks" className="text-on-surface-variant flex items-center px-4 py-3 hover:text-on-surface hover:bg-surface-container-high transition-all duration-200">
            <span className="material-symbols-outlined mr-3">checklist</span>
            <span className="font-body-md text-body-md">My Tasks</span>
          </Link>
          <Link to="/calendar" className="text-on-surface-variant flex items-center px-4 py-3 hover:text-on-surface hover:bg-surface-container-high transition-all duration-200">
            <span className="material-symbols-outlined mr-3">calendar_today</span>
            <span className="font-body-md text-body-md">Calendar</span>
          </Link>
        </nav>

        <div className="border-t border-outline-variant/10 pt-stack-md flex flex-col gap-1 px-2">
          <button onClick={() => dispatch(logout())} className="text-error flex items-center px-4 py-3 hover:bg-surface-container-high transition-all duration-200">
            <span className="material-symbols-outlined mr-3">logout</span>
            <span className="font-body-md text-body-md">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:ml-70 min-h-screen flex flex-col relative pb-16 md:pb-0">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 flex justify-between items-center w-full px-gutter h-16 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg py-2 pl-10 pr-4 text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Search tasks..." 
                type="text"
                value={currentSearch}
                onChange={handleSearch}
              />
            </div>
            {/* Mobile Title */}
            <h1 className="md:hidden font-headline-md text-headline-md tracking-tight text-on-surface">Stitch</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:scale-[0.98] relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                  <div className="absolute top-12 right-0 w-80 bg-surface border border-outline-variant/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-outline-variant/10 bg-surface-container-lowest flex justify-between items-center">
                      <h4 className="font-headline-sm text-headline-sm">Notifications</h4>
                      <span className="font-label-sm text-label-sm bg-primary text-on-primary px-2 py-0.5 rounded-full">3 New</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {[1,2,3].map((i) => (
                        <div key={i} className="px-4 py-3 border-b border-outline-variant/5 hover:bg-surface-container-low transition-colors cursor-pointer">
                          <p className="font-body-sm text-body-sm text-on-surface">Task <span className="font-medium text-primary">Q3 Report</span> is approaching its deadline.</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">2 hours ago</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-2 text-center text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors">Mark all as read</button>
                  </div>
                </>
              )}
            </div>
            <div className="h-8 w-px bg-outline-variant/20 mx-2 hidden md:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="font-body-md text-body-md text-on-surface leading-none">{user?.name || 'User'}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">Editor</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-outline-variant/20 bg-surface-container-high flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-on-surface">person</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant/10 flex justify-around items-center h-16 z-40">
        <button className="flex flex-col items-center text-primary font-bold">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="text-[10px]">Dashboard</span>
        </button>
        <Link to="/tasks" className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">checklist</span>
          <span className="text-[10px]">Tasks</span>
        </Link>
        <button onClick={() => dispatch(logout())} className="flex flex-col items-center text-error">
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[10px]">Logout</span>
        </button>
      </nav>
    </div>
  );
};
