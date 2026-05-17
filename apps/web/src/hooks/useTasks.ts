import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '@/api/taskApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setLoading, setTasks } from '@/store/slices/taskSlice';
import { Task, TaskPriority, TaskStatusFilter } from '@/types/task';

const mergeTask = (tasks: Task[], updated: Task): Task[] => tasks.map((task) => (task.id === updated.id ? updated : task));

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

    dispatch(setTasks([optimistic, ...tasks]));
    try {
      const created = await createTask(payload);
      dispatch(setTasks([created, ...tasks]));
      setError('');
    } catch {
      dispatch(setTasks(previous));
      setError('Unable to create task.');
    }
  };

  const editTask = async (taskId: string, payload: Partial<Task>) => {
    const previous = tasks;
    const current = tasks.find((task) => task.id === taskId);
    if (!current) return;

    const optimisticTask: Task = { ...current, ...payload, updatedAt: new Date().toISOString() };
    dispatch(setTasks(mergeTask(tasks, optimisticTask)));

    try {
      const updated = await updateTask(taskId, payload);
      dispatch(setTasks(mergeTask(previous, updated)));
      setError('');
    } catch {
      dispatch(setTasks(previous));
      setError('Unable to update task.');
    }
  };

  const removeTask = async (taskId: string) => {
    const previous = tasks;
    dispatch(setTasks(tasks.filter((task) => task.id !== taskId)));

    try {
      await deleteTask(taskId);
      setError('');
    } catch {
      dispatch(setTasks(previous));
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
