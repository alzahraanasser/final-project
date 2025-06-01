import mongoose from "mongoose";

const EasyLevelAnswerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  selectedLetter: {
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

const EasyLevelAnswer = mongoose.model("EasyLevelAnswer", EasyLevelAnswerSchema);

export default EasyLevelAnswer; 