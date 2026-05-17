import { fireEvent, render } from '@testing-library/react';
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
    const onEdit = vi.fn().mockResolvedValue(undefined);
    const onPageChange = vi.fn();

    const { getByText, getByRole } = render(
      <TaskList 
        tasks={[sampleTask]} 
        totalTasks={1} 
        page={1} 
        limit={10} 
        onPageChange={onPageChange} 
        onToggleComplete={onToggleComplete} 
        onDelete={onDelete} 
        onEdit={onEdit} 
      />
    );

    // Open slide-over panel by clicking the row or "more_vert" button
    const row = getByText('Write tests');
    fireEvent.click(row);

    // Now click the buttons in the details panel
    const completeBtn = getByText('Complete Task');
    fireEvent.click(completeBtn);

    // Re-open pane to test delete
    fireEvent.click(row);
    const deleteBtn = getByText('Delete Task');
    fireEvent.click(deleteBtn);

    expect(onToggleComplete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith('task-1');
  });
});
