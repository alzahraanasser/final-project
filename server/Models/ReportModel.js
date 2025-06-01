import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ReportModel = mongoose.model("Report", reportSchema);

export default ReportModel; 