import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import taskReducer from '@/store/slices/taskSlice';
import { CalendarPage } from '@/pages/CalendarPage';

// Mock useTasks so CalendarPage doesn't make real API calls
vi.mock('@/hooks/useTasks', () => ({
  useTasks: () => ({
    tasks: [
      {
        id: 'cal-1',
        title: 'Calendar Task',
        priority: 'high',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    loading: false
  })
}));

const store = configureStore({
  reducer: { auth: authReducer, tasks: taskReducer },
  preloadedState: {
    auth: { token: 'tok', user: { id: '1', name: 'Jane', email: 'jane@example.com' } },
    tasks: { tasks: [], totalTasks: 0, loading: false }
  }
});

const renderCalendar = () =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    </Provider>
  );

describe('CalendarPage', () => {
  it('renders the page heading', () => {
    renderCalendar();
    expect(screen.getByText('Editorial Calendar')).toBeInTheDocument();
  });

  it('renders day-of-week headers', () => {
    renderCalendar();
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders current month task on correct day', () => {
    renderCalendar();
    expect(screen.getByText('Calendar Task')).toBeInTheDocument();
  });

  it('renders month navigation buttons', () => {
    renderCalendar();
    expect(screen.getByText('chevron_left')).toBeInTheDocument();
    expect(screen.getByText('chevron_right')).toBeInTheDocument();
  });
});
