import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Lesson = mongoose.model("Lesson", LessonSchema);

export default Lesson; 