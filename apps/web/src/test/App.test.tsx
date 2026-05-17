import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import taskReducer from '@/store/slices/taskSlice';
import { App } from '@/App';

const createTestStore = (token: string | null) =>
  configureStore({
    reducer: { auth: authReducer, tasks: taskReducer },
    preloadedState: {
      auth: { token, user: token ? { id: '1', name: 'Jane', email: 'jane@example.com' } : null },
      tasks: { tasks: [], totalTasks: 0, loading: false }
    }
  });

describe('App routing', () => {
  it('redirects unauthenticated users to login content', () => {
    const store = createTestStore(null);

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('allows authenticated users to view dashboard content', () => {
    const store = createTestStore('token');

    const { getByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(getByText(/current tasks/i)).toBeInTheDocument();
  });
});
