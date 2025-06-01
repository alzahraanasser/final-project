import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk for adding a lesson
export const addLesson = createAsyncThunk(
  "lessons/addLesson",
  async (lessonDetails, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addLesson`, lessonDetails);
      return response.data.lesson;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk for fetching lessons
export const getLessons = createAsyncThunk(
  "lessons/getLessons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getLessons`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch lessons");
    }
  }
);

// Thunk for updating a lesson
export const updateLesson = createAsyncThunk(
  "lessons/updateLesson",
  async ({ lessonId, updatedDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateLesson/${lessonId}`, updatedDetails);
      return response.data.lesson;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk for deleting a lesson
export const deleteLesson = createAsyncThunk(
  "lessons/deleteLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/deleteLesson/${lessonId}`);
      return lessonId;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Initial state
const initialState = {
  status: "idle",
  lessons: [],
  error: null,
};

// Slice definition
const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    addLesson: (state, action) => {
      state.lessons.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons.unshift(action.payload);
      })
      .addCase(addLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add the lesson.";
      })
      
      .addCase(getLessons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload.lessons;
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error fetching lessons";
      })
      
      .addCase(updateLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.lessons.findIndex((lesson) => lesson._id === action.payload._id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update the lesson.";
      })
      
      .addCase(deleteLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = state.lessons.filter((lesson) => lesson._id !== action.payload);
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete the lesson.";
      });
  },
});

//export const {addLesson} = lessonSlice.actions;
export default lessonSlice.reducer;
