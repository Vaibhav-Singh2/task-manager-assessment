import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../types/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
}

const initialState: TaskState = {
  tasks: [],
  loading: false
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
    }
  }
});

export const { setLoading, setTasks } = taskSlice.actions;
export default taskSlice.reducer;
