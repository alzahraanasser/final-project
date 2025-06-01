import mongoose from "mongoose";

const EnglishLessonSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  description: { type: String, required: true },
  image: { type: String, required: true },
  image2: { type: String, required: true },
  type: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const EnglishLesson = mongoose.model("EnglishLesson", EnglishLessonSchema);

export default EnglishLesson;
