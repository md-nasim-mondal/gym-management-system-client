import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Trainer {
  _id: string;
  name: string;
}

interface Trainee {
  _id: string;
  name: string;
}

interface Schedule {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  trainer: Trainer;
  maxTrainees: number;
  trainees: Trainee[];
  classType: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface ScheduleState {
  schedules: Schedule[];
  selectedSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ScheduleState = {
  schedules: [],
  selectedSchedule: null,
  isLoading: false,
  error: null,
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const fetchSchedules = createAsyncThunk(
  "schedule/fetchSchedules",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/schedules`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to fetch schedules"
        );
      }
      return rejectWithValue("Failed to fetch schedules");
    }
  }
);

export const fetchScheduleById = createAsyncThunk(
  "schedule/fetchScheduleById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/schedules/${id}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to fetch schedule"
        );
      }
      return rejectWithValue("Failed to fetch schedule");
    }
  }
);

export const createSchedule = createAsyncThunk(
  "schedule/createSchedule",
  async (scheduleData: Omit<Schedule, "_id">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/schedules/create`,
        scheduleData,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to create schedule"
        );
      }
      return rejectWithValue("Failed to create schedule");
    }
  }
);

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSelectedSchedule: (state, action: PayloadAction<Schedule>) => {
      state.selectedSchedule = action.payload;
    },
    clearSelectedSchedule: (state) => {
      state.selectedSchedule = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all schedules
    builder.addCase(fetchSchedules.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSchedules.fulfilled, (state, action) => {
      state.isLoading = false;
      state.schedules = action.payload.data;
    });
    builder.addCase(fetchSchedules.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch schedule by ID
    builder.addCase(fetchScheduleById.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchScheduleById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedSchedule = action.payload.data;
    });
    builder.addCase(fetchScheduleById.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Create schedule
    builder.addCase(createSchedule.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createSchedule.fulfilled, (state, action) => {
      state.isLoading = false;
      state.schedules.push(action.payload.data);
    });
    builder.addCase(createSchedule.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setSelectedSchedule, clearSelectedSchedule } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;
