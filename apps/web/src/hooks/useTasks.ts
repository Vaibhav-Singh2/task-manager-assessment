import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '@/api/taskApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setTasks } from '@/store/slices/taskSlice';
import { Task, TaskPriority, TaskStatusFilter } from '@/types/task';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatusFilter>('all');
  const [priority, setPriority] = useState<'' | TaskPriority>('');
  const [error, setError] = useState<string>('');

  const fetchTasks = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const taskList = await getTasks({ search, status, priority });
      setError('');
      dispatch(setTasks(taskList));
    } catch {
      setError('Unable to load tasks. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, search, status, priority]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const addTask = async (payload: { title: string; description?: string; priority: TaskPriority; dueDate: string }) => {
    try {
      await createTask(payload);
      setError('');
      await fetchTasks();
    } catch {
      setError('Unable to create task.');
    }
  };

  const editTask = async (taskId: string, payload: Partial<Task>) => {
    try {
      await updateTask(taskId, payload);
      setError('');
      await fetchTasks();
    } catch {
      setError('Unable to update task.');
    }
  };

  const removeTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setError('');
      await fetchTasks();
    } catch {
      setError('Unable to delete task.');
    }
  };

  return {
    tasks,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    addTask,
    editTask,
    removeTask
  };
};
