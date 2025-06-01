import mongoose from "mongoose";

const MathAddLessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const MathAddLesson = mongoose.model("MathAddLesson", MathAddLessonSchema);

export default MathAddLesson; 