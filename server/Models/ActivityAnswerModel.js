import mongoose from "mongoose";

const ActivityAnswerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  activityId: { type: String, required: true },
  activityType: { type: String, required: true },
  selectedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ActivityAnswer = mongoose.model("ActivityAnswer", ActivityAnswerSchema);

export default ActivityAnswer; 