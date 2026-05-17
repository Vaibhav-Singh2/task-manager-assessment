import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api/taskApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setLoading, setTasks } from '../store/slices/taskSlice';
import { Task, TaskPriority, TaskStatusFilter } from '../types/task';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TaskStatusFilter>('all');
  const [priority, setPriority] = useState<'' | TaskPriority>('');

  const fetchTasks = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const taskList = await getTasks({ search, status, priority });
      dispatch(setTasks(taskList));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, search, status, priority]);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const addTask = async (payload: { title: string; description?: string; priority: TaskPriority; dueDate: string }) => {
    await createTask(payload);
    await fetchTasks();
  };

  const editTask = async (taskId: string, payload: Partial<Task>) => {
    await updateTask(taskId, payload);
    await fetchTasks();
  };

  const removeTask = async (taskId: string) => {
    await deleteTask(taskId);
    await fetchTasks();
  };

  return {
    tasks,
    loading,
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
