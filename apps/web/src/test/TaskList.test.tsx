import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskList } from '@/components/tasks/TaskList';
import { Task } from '@/types/task';

const sampleTask: Task = {
  id: 'task-1',
  title: 'Write tests',
  description: 'Cover task interactions',
  priority: 'high',
  dueDate: new Date().toISOString(),
  completed: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

describe('TaskList', () => {
  it('triggers toggle and delete callbacks', () => {
    const onToggleComplete = vi.fn().mockResolvedValue(undefined);
    const onDelete = vi.fn().mockResolvedValue(undefined);

    const { getByRole, getByText } = render(
      <TaskList tasks={[sampleTask]} onToggleComplete={onToggleComplete} onDelete={onDelete} />
    );

    getByRole('button', { name: /mark complete/i }).click();
    getByRole('button', { name: /delete/i }).click();

    expect(getByText(/write tests/i)).toBeInTheDocument();
    expect(onToggleComplete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('task-1');
  });
});
