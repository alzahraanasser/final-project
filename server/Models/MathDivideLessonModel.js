import mongoose from "mongoose";

const MathDivideLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MathDivideLesson = mongoose.model("MathDivideLesson", MathDivideLessonSchema);

export default MathDivideLesson; 