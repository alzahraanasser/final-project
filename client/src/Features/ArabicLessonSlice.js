import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk لإضافة درس
export const addArabicLesson = createAsyncThunk(
  "arabicLessons/addArabicLesson",
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/addArabicLesson`, {
        lessonTitle: lessonData.lessonTitle,
        lessonCode: lessonData.lessonCode,
      });
      return response.data.lesson;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk لجلب كل الدروس
export const getArabicLessons = createAsyncThunk(
  "arabicLessons/getArabicLessons",
  async () => {
    try {
      const response = await axios.get(`/getArabicLessons`);
      return response.data.lessons || [];
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch Arabic lessons';
    }
  }
);

// Thunk لتحديث درس
export const updateArabicLesson = createAsyncThunk(
  "arabicLessons/updateArabicLesson",
  async ({ lessonId, lessonTitle, lessonCode }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/updateArabicLesson/${lessonId}`,
        { lessonTitle, lessonCode }
      );
      return response.data.lesson;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk لحذف درس
export const deleteArabicLesson = createAsyncThunk(
  "arabicLessons/deleteArabicLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/arabicLessons/${lessonId}`);
      if (!response.data.success) {
        throw new Error("Failed to delete lesson");
      }
      return lessonId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// الحالة المبدئية
const initialState = {
  status: "idle",
  lessons: [],
  error: null,
};


// Slice
const arabicLessonSlice = createSlice({
  name: "arabicLessons",
  initialState,
  reducers: {
    // يمكن إضافة reducer محلي إن أردت
  },
  extraReducers: (builder) => {
    builder
      // Add Lesson
      .addCase(addArabicLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addArabicLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons.unshift(action.payload);
      })
      .addCase(addArabicLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add lesson.";
      })

      // Get Lessons
      .addCase(getArabicLessons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArabicLessons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload;
      })
      .addCase(getArabicLessons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch lessons.";
      })

      // Update Lesson
      .addCase(updateArabicLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateArabicLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.lessons.findIndex((lesson) => lesson._id === action.payload._id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(updateArabicLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update lesson.";
      })

      // Delete Lesson
      .addCase(deleteArabicLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteArabicLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = state.lessons.filter((lesson) => lesson._id !== action.payload);
      })
      .addCase(deleteArabicLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete lesson.";
      });
  },
});

export default arabicLessonSlice.reducer;
