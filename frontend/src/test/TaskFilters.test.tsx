import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskFilters } from '@/components/tasks/TaskFilters';

const defaultProps = {
  search: '',
  status: 'all' as const,
  priority: '' as const,
  sortBy: 'dueDate' as const,
  sortOrder: 'asc' as const,
  onSearch: vi.fn(),
  onStatus: vi.fn(),
  onPriority: vi.fn(),
  onSortBy: vi.fn(),
  onSortOrder: vi.fn()
};

describe('TaskFilters', () => {
  it('renders filter dropdowns and sort button', () => {
    render(<TaskFilters {...defaultProps} />);
    expect(screen.getByText('All Statuses')).toBeInTheDocument();
    expect(screen.getByText('All Priorities')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
  });

  it('shows ascending sort icon by default', () => {
    render(<TaskFilters {...defaultProps} sortOrder="asc" />);
    expect(screen.getByText('arrow_upward')).toBeInTheDocument();
  });

  it('shows descending sort icon when sortOrder is desc', () => {
    render(<TaskFilters {...defaultProps} sortOrder="desc" />);
    expect(screen.getByText('arrow_downward')).toBeInTheDocument();
  });

  it('calls onSortOrder with toggled value when sort button is clicked', () => {
    const onSortOrder = vi.fn();
    render(<TaskFilters {...defaultProps} sortOrder="asc" onSortOrder={onSortOrder} />);
    fireEvent.click(screen.getByTitle(/sort/i));
    expect(onSortOrder).toHaveBeenCalledWith('desc');
  });
});
