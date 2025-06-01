import { configureStore } from '@reduxjs/toolkit'
import usersReducer from "../Features/UserSlice"
import lessonReducer from "../Features/LessonSlice";
import arabicLessonsReducer from "../Features/ArabicLessonSlice";
import englishLessonsReducer from "../Features/EnglishLessonSlice";



export const store = configureStore({
  reducer: {
    users:usersReducer,
    lessons: lessonReducer,
    arabicLessons: arabicLessonsReducer,
    englishLessons: englishLessonsReducer,
  },
})
