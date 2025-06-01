import mongoose from "mongoose";

const ArabicAnswerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  lessonId: {
    type: Number,
    required: true,
  },
  selectedAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ArabicAnswer = mongoose.model("ArabicAnswer", ArabicAnswerSchema);

export default ArabicAnswer; 