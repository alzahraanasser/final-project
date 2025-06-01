import mongoose from "mongoose";

const MediumLevelAnswerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  answers: {
    firstWord: {
      type: String,
      required: true,
    },
    secondWord: {
      type: String,
      required: true,
    },
    thirdWord: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MediumLevelAnswer = mongoose.model("MediumLevelAnswer", MediumLevelAnswerSchema);

export default MediumLevelAnswer; 