import mongoose from "mongoose";

const MathMultiplyLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MathMultiplyLesson = mongoose.model("MathMultiplyLesson", MathMultiplyLessonSchema);

export default MathMultiplyLesson;