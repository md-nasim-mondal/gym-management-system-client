import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      role?: string;
      phone?: string;
      address?: string;
      picture?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true,
      });

      console.log("response", response);

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Registration failed"
        );
      }
      return rejectWithValue("Registration failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,
      });

      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Login failed"
        );
      }
      return rejectWithValue("Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/logout`,
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
          axiosError.response?.data?.message || "Logout failed"
        );
      }
      return rejectWithValue("Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        return rejectWithValue(
          axiosError.response?.data?.message || "Failed to get user"
        );
      }
      return rejectWithValue("Failed to get user");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    profileData: {
      name?: string;
      phone?: string;
      role?: string;
      address?: string;
      picture?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/update-profile`,
        profileData,
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
          axiosError.response?.data?.message || "Failed to update profile"
        );
      }
      return rejectWithValue("Failed to update profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data.user;
      state.isAuthenticated = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data.user;
      state.isAuthenticated = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });

    // Get current user
    builder.addCase(getCurrentUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data;
      state.isAuthenticated = true;
    });
    builder.addCase(getCurrentUser.rejected, (state) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    
    // Update profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.data;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
