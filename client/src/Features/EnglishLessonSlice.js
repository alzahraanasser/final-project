import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk لإضافة درس إنجليزي
export const addEnglishLesson = createAsyncThunk(
  "englishLessons/addEnglishLesson",
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/addEnglishLesson`, {
        lessonTitle: lessonData.lessonTitle,
        lessonCode: lessonData.lessonCode,
      });
      return response.data.lesson;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk لجلب كل الدروس الإنجليزية
export const getEnglishLessons = createAsyncThunk(
  "englishLessons/getEnglishLessons",
  async () => {
    try {
      const response = await axios.get(`/getEnglishLessons`);
      return response.data.lessons || [];
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch English lessons';
    }
  }
);

// Thunk لتحديث درس إنجليزي
export const updateEnglishLesson = createAsyncThunk(
  "englishLessons/updateEnglishLesson",
  async ({ lessonId, lessonTitle, lessonCode }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `/updateEnglishLesson/${lessonId}`,
        { lessonTitle, lessonCode }
      );
      return response.data.lesson;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Thunk لحذف درس إنجليزي
export const deleteEnglishLesson = createAsyncThunk(
  "englishLessons/deleteEnglishLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/englishLessons/${lessonId}`);
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
const englishLessonSlice = createSlice({
  name: "englishLessons",
  initialState,
  reducers: {
    // يمكن إضافة reducer محلي إن أردت
  },
  extraReducers: (builder) => {
    builder
      // Add Lesson
      .addCase(addEnglishLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addEnglishLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons.unshift(action.payload);
      })
      .addCase(addEnglishLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add lesson.";
      })

      // Get Lessons
      .addCase(getEnglishLessons.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getEnglishLessons.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = action.payload;
      })
      .addCase(getEnglishLessons.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch lessons.";
      })

      // Update Lesson
      .addCase(updateEnglishLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateEnglishLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.lessons.findIndex((lesson) => lesson._id === action.payload._id);
        if (index !== -1) {
          state.lessons[index] = action.payload;
        }
      })
      .addCase(updateEnglishLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update lesson.";
      })

      // Delete Lesson
      .addCase(deleteEnglishLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteEnglishLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.lessons = state.lessons.filter((lesson) => lesson._id !== action.payload);
      })
      .addCase(deleteEnglishLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete lesson.";
      });
  },
});

export default englishLessonSlice.reducer;
