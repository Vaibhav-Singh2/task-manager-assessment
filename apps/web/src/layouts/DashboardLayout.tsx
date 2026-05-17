import { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <header className="mx-auto mb-6 flex w-full max-w-6xl items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm">
        <div>
          <p className="text-sm text-[var(--color-muted)]">Signed in as</p>
          <p className="font-semibold text-[var(--color-foreground)]">{user?.name}</p>
        </div>
        <Button variant="secondary" onClick={() => dispatch(logout())}>Logout</Button>
      </header>
      <section className="mx-auto w-full max-w-6xl">{children}</section>
    </main>
  );
};
