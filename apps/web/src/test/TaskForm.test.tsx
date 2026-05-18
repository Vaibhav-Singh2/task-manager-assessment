import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskForm } from '@/components/tasks/TaskForm';

describe('TaskForm', () => {
  it('renders all form fields', () => {
    render(<TaskForm onSubmit={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/define the objective/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
    expect(screen.getByText(/low/i)).toBeInTheDocument();
    expect(screen.getByText(/medium/i)).toBeInTheDocument();
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const onClose = vi.fn();
    render(<TaskForm onSubmit={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with correct payload when form is submitted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/define the objective/i), {
      target: { value: 'New Task Title' }
    });
    fireEvent.change(screen.getByLabelText(/deadline/i), {
      target: { value: '2026-12-31' }
    });
    // Select High priority
    fireEvent.click(screen.getByText('high'));

    fireEvent.click(screen.getByText('Save Task'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'New Task Title',
        description: undefined,
        priority: 'high',
        dueDate: '2026-12-31',
        tags: []
      });
    });
  });

  it('submits tags correctly when comma-separated tags are entered', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/define the objective/i), {
      target: { value: 'Tags Task' }
    });
    fireEvent.change(screen.getByLabelText(/deadline/i), {
      target: { value: '2026-12-31' }
    });
    fireEvent.change(screen.getByPlaceholderText(/e.g. backend, frontend, bug/i), {
      target: { value: '   feature,  design, frontend   ' }
    });

    fireEvent.click(screen.getByText('Save Task'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Tags Task',
        description: undefined,
        priority: 'medium',
        dueDate: '2026-12-31',
        tags: ['feature', 'design', 'frontend']
      });
    });
  });

  it('shows saving state while submitting', async () => {
    let resolve: () => void;
    const onSubmit = vi.fn().mockImplementation(
      () => new Promise<void>((res) => { resolve = res; })
    );
    render(<TaskForm onSubmit={onSubmit} onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText(/define the objective/i), {
      target: { value: 'Task' }
    });
    fireEvent.change(screen.getByLabelText(/deadline/i), {
      target: { value: '2026-12-31' }
    });
    fireEvent.click(screen.getByText('Save Task'));

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    resolve!();
  });
});
