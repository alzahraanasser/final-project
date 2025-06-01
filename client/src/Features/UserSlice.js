import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// تسجيل الدخول
export const loginUser = createAsyncThunk("users/loginUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, userData);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userRole", response.data.user.role);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.msg || "Login failed");
  }
});

// تسجيل مستخدم جديد
export const registerUser = createAsyncThunk("users/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/registerUser`, userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.msg || "Registration failed");
  }
});

// تسجيل الخروج
export const logout = createAsyncThunk("users/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${process.env.REACT_APP_API_URL}/logout`);
    return null;
  } catch (error) {
    return rejectWithValue("Logout failed");
  }
});

// تحميل المستخدم من token
export const setUserFromToken = createAsyncThunk("users/setUserFromToken", async (token) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return null;
  }
});

const userSlice = createSlice({
  name: "users",
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isError: false,
    error: "",
  },
  reducers: {
    clearError: (state) => {
      state.isError = false;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("token");
      })
      .addCase(setUserFromToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
