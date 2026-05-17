import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '@/api/taskApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setTasks } from '@/store/slices/taskSlice';
import { Task, TaskPriority, TaskStatusFilter } from '@/types/task';
import { useSearchParams } from 'react-router-dom';

const mergeTask = (tasks: Task[], updated: Task): Task[] => tasks.map((task) => (task.id === updated.id ? updated : task));

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, totalTasks } = useAppSelector((state) => state.tasks);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const status = (searchParams.get('status') as TaskStatusFilter) || 'all';
  const priority = (searchParams.get('priority') as TaskPriority | '') || '';
  const sortBy = (searchParams.get('sortBy') as 'dueDate' | 'createdAt') || 'dueDate';
  const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 10;

  const [error, setError] = useState<string>('');

  const updateParams = (updates: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || (key === 'status' && value === 'all') || (key === 'page' && value === '1')) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const setSearch = (s: string) => updateParams({ search: s, page: '1' });
  const setStatus = (s: TaskStatusFilter) => updateParams({ status: s, page: '1' });
  const setPriority = (p: TaskPriority | '') => updateParams({ priority: p, page: '1' });
  const setSortBy = (s: 'dueDate' | 'createdAt') => updateParams({ sortBy: s, page: '1' });
  const setSortOrder = (o: 'asc' | 'desc') => updateParams({ sortOrder: o, page: '1' });
  const setPage = (p: number) => updateParams({ page: p.toString() });

  const fetchTasks = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await getTasks({ search, status, priority, sortBy, sortOrder, page, limit });
      setError('');
      dispatch(setTasks({ tasks: response.data, total: response.total }));
    } catch {
      setError('Unable to load tasks. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, search, status, priority, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const addTask = async (payload: { title: string; description?: string; priority: TaskPriority; dueDate: string }) => {
    const previous = tasks;
    const optimistic: Task = {
      id: `tmp-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      dueDate: payload.dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch(setTasks({ tasks: [optimistic, ...tasks], total: totalTasks + 1 }));
    try {
      const created = await createTask(payload);
      dispatch(setTasks({ tasks: [created, ...tasks], total: totalTasks + 1 }));
      setError('');
    } catch {
      dispatch(setTasks({ tasks: previous, total: totalTasks }));
      setError('Unable to create task.');
    }
  };

  const editTask = async (taskId: string, payload: Partial<Task>) => {
    const previous = tasks;
    const current = tasks.find((task) => task.id === taskId);
    if (!current) return;

    const optimisticTask: Task = { ...current, ...payload, updatedAt: new Date().toISOString() };
    dispatch(setTasks({ tasks: mergeTask(tasks, optimisticTask), total: totalTasks }));

    try {
      const updated = await updateTask(taskId, payload);
      dispatch(setTasks({ tasks: mergeTask(previous, updated), total: totalTasks }));
      setError('');
    } catch {
      dispatch(setTasks({ tasks: previous, total: totalTasks }));
      setError('Unable to update task.');
    }
  };

  const removeTask = async (taskId: string) => {
    const previous = tasks;
    dispatch(setTasks({ tasks: tasks.filter((task) => task.id !== taskId), total: totalTasks - 1 }));

    try {
      await deleteTask(taskId);
      setError('');
    } catch {
      dispatch(setTasks({ tasks: previous, total: totalTasks }));
      setError('Unable to delete task.');
    }
  };

  return {
    tasks,
    totalTasks,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    limit,
    setPage,
    addTask,
    editTask,
    removeTask
  };
};
