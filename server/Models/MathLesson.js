import mongoose from 'mongoose';

const mathLessonSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['mathadd', 'mathsubtract', 'mathmultiply', 'mathdivide'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('MathLesson', mathLessonSchema); 