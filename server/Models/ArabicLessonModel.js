import mongoose from 'mongoose';

const arabicLessonSchema = new mongoose.Schema({
  lessonTitle: { type: String, required: true },
  lessonCode: { type: String, required: true },
});

const ArabicLesson = mongoose.model('ArabicLesson', arabicLessonSchema);
export default ArabicLesson;
