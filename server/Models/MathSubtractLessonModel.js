import mongoose from "mongoose";

const MathSubtractLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MathSubtractLesson = mongoose.model("MathSubtractLesson", MathSubtractLessonSchema);

export default MathSubtractLesson; 