import mongoose from 'mongoose';

const arabicLessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  image2: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'arabic'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ArabicLesson', arabicLessonSchema); 