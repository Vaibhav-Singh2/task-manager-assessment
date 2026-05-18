import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types/task';

interface TaskState {
  tasks: Task[];
  totalTasks: number;
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  totalTasks: 0,
  loading: false
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTasks: (state, action: PayloadAction<{ tasks: Task[]; total?: number }>) => {
      state.tasks = action.payload.tasks;
      if (action.payload.total !== undefined) {
        state.totalTasks = action.payload.total;
      }
    }
  }
});

export const { setLoading, setTasks } = taskSlice.actions;
export default taskSlice.reducer;
