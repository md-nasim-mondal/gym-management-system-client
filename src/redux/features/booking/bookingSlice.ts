import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Schedule {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  trainer: {
    _id: string;
    name: string;
  };
  classType: string;
}

interface Booking {
  _id: string;
  schedule: Schedule;
  trainee: string;
  bookedAt: string;
  status: "confirmed" | "cancelled" | "completed";
}

interface BookingState {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  isLoading: false,
  error: null,
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const fetchMyBookings = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/bookings/my-bookings`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to fetch bookings"
        );
      }
      return rejectWithValue("Failed to fetch bookings");
    }
  }
);

export const bookClass = createAsyncThunk(
  "booking/bookClass",
  async (scheduleId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/bookings/book`,
        { scheduleId },
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
          axiosError.response?.data?.message || "Failed to book class"
        );
      }
      return rejectWithValue("Failed to book class");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "booking/cancelBooking",
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${API_URL}/bookings/cancel/${bookingId}`,
        {},
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
          axiosError.response?.data?.message || "Failed to cancel booking"
        );
      }
      return rejectWithValue("Failed to cancel booking");
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch my bookings
    builder.addCase(fetchMyBookings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyBookings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookings = action.payload.data;
    });
    builder.addCase(fetchMyBookings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Book class
    builder.addCase(bookClass.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(bookClass.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bookings.push(action.payload.data);
    });
    builder.addCase(bookClass.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Cancel booking
    builder.addCase(cancelBooking.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(cancelBooking.fulfilled, (state, action) => {
      state.isLoading = false;
      const cancelledBooking = action.payload.data;
      state.bookings = state.bookings.map((booking) =>
        booking._id === cancelledBooking._id ? cancelledBooking : booking
      );
    });
    builder.addCase(cancelBooking.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export default bookingSlice.reducer;
