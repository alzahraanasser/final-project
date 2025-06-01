import mongoose from "mongoose";

const HardLevelAnswerSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sentence: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const HardLevelAnswer = mongoose.model("HardLevelAnswer", HardLevelAnswerSchema);

export default HardLevelAnswer;
