import { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <header className="mx-auto mb-6 flex w-full max-w-6xl items-center justify-between rounded-xl bg-white p-4 shadow-sm">
        <div>
          <p className="text-sm text-slate-500">Signed in as</p>
          <p className="font-semibold text-slate-900">{user?.name}</p>
        </div>
        <button
          type="button"
          onClick={() => dispatch(logout())}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Logout
        </button>
      </header>
      <section className="mx-auto w-full max-w-6xl">{children}</section>
    </main>
  );
};
