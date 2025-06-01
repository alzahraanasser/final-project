import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["teacher", "student", "admin"], required: true },
    isActive: { type: Boolean, default: true }, // إذا كان الحساب مفعل
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // teacher assigned to student
    points: { type: Number, default: 0 },
    answeredActivities: [{ type: String }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;