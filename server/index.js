import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "./Models/UserModel.js";
import authMiddleware from "./Middleware/authMiddleware.js";
import { createUser } from "./Utils/UserUtils.js";
import HardLevelAnswer from "./Models/HardLevelAnswer.js"; // تم حذف التكرار
import nodemailer from "nodemailer";
import crypto from "crypto";
import EasyLevelAnswer from "./Models/EasyLevelAnswerModel.js";
import MediumLevelAnswer from "./Models/MediumLevelAnswerModel.js";
import ReportModel from "./Models/ReportModel.js";
import Lesson from "./Models/LessonModel.js";
import multer from "multer";
import ArabicAnswer from "./Models/ArabicAnswerModel.js";
import ActivityAnswer from "./Models/ActivityAnswerModel.js";
import ArabicLesson from "./Models/ArabicLessonModel.js";
import MathAddLesson from "./Models/MathAddLessonModel.js";
import MathDivideLesson from "./Models/MathDivideLessonModel.js";
import MathMultiplyLesson from "./Models/MathMultiplyLessonModel.js";
import MathSubtractLesson from "./Models/MathSubtractLessonModel.js";


dotenv.config();
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    msg: "حدث خطأ في الخادم" 
  });
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-actual-email@gmail.com', // Replace with your actual Gmail email
    pass: 'your-actual-password', // Replace with your actual Gmail password or App Password
  },
});

// Connect to MongoDB
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@studentcal.btrkf.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority&appName=StudentCal`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ✅ Register User Route
app.post("/registerUser", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Enforce email domain standard
    if (role === "teacher" && !email.endsWith("@teacher.com")) {
      return res.status(400).json({ msg: "this standard not accepted!" });
    }
    if (role === "student" && !email.endsWith("@student.com")) {
      return res.status(400).json({ msg: "this standard not accepted!" });
    }
    if (role === "admin" && !email.endsWith("@admin.com")) {
      return res.status(400).json({ msg: "this standard not accepted!" });
    }
    if (!["teacher", "student", "admin"].includes(role)) return res.status(400).json({ msg: "Invalid role" });

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword, role: role || "student" });
    await user.save();

    res.status(201).json({ user, msg: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Login User Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // ⛔ تحقق إذا الحساب موقوف
    if (!user.isActive) {
      return res.status(403).json({ msg: "This account has been deactivated." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

    // ✅ نضيف الدور والايميل داخل التوكن
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ user, token, msg: "Login successful" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Protected Route Example
app.get("/profile", authMiddleware, (req, res) => {
  res.json({ msg: "Protected route accessed", user: req.user });
});

// Admin Route
app.post("/admin/createUser", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized" });

    const { name, email, password, role } = req.body;
    // Enforce email domain standard
    if (role === "teacher" && !email.endsWith("@teacher.com")) {
      return res.status(400).json({ msg: "this standard not accepted!" });
    }
    if (role === "student" && !email.endsWith("@student.com")) {
      return res.status(400).json({ msg: "this standard not accepted!" });
    }
    if (role === "admin" && !email.endsWith("@admin.com")) {
      return res.status(400).json({ msg: "this standard not accepted!" });
    }
    if (!["teacher", "student", "admin"].includes(role)) return res.status(400).json({ msg: "Invalid role" });

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ msg: "User created by admin", user: { name, email, role } });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// show all users for admin route
app.get("/admin/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Access denied" });

    const users = await UserModel.find({}, "-password"); // استثني الباسورد
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ Route لتعطيل المستخدم
app.patch("/admin/deactivate-user/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized" });

    const userId = req.params.id;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "User deactivated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// تحديث بيانات المستخدم
app.put("/update-profile", authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user.id,
    { name, email },
    { new: true, runValidators: true }
  ).select("-password"); // لا نرجّع الباسورد

  res.json({ msg: "Profile updated", user: updatedUser });
});

// تحديث كلمة المرور
app.put("/update-password", authMiddleware, async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user.id; // الحصول على ID المستخدم من التوكن

  try {
    const user = await UserModel.findById(userId);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // تحقق من كلمة المرور القديمة
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password is incorrect" });

    // تحقق من تطابق كلمة المرور الجديدة
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ msg: "Passwords don't match" });
    }

    // تحديث كلمة المرور الجديدة
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;

    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// مسار لتحميل معلومات المستخدم بناءً على الـ token
app.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Backend API route for logout
app.post("/logout", (req, res) => {
  res.status(200).json({ msg: "Logged out successfully" });
});

// Route لحفظ إجابة مستوى صعب
app.post("/hardlevel-answers", authMiddleware, async (req, res) => {
  try {
    console.log("Received request from user:", req.user);
    
    if (!req.user || !req.user.email) {
      return res.status(403).json({ 
        success: false,
        msg: "يجب تسجيل الدخول أولاً" 
      });
    }

    const { sentence } = req.body;

    if (!sentence) {
      return res.status(400).json({ 
        success: false,
        msg: "يرجى كتابة الجملة" 
      });
    }

    const newAnswer = new HardLevelAnswer({
      email: req.user.email,
      sentence,
      submittedAt: new Date()
    });

    await newAnswer.save();

    res.status(201).json({ 
      success: true,
      msg: "تم حفظ إجابتك بنجاح" 
    });
  } catch (error) {
    console.error("Error saving hard level answer:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        msg: "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      msg: "حدث خطأ أثناء الحفظ" 
    });
  }
});

// عرض جميع إجابات مستوى صعب (للمعلم)
app.get("/hardlevel-answers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const answers = await HardLevelAnswer.find().sort({ submittedAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ msg: "حدث خطأ أثناء التحميل" });
  }
});


// عرض جميع إجابات مستوى المتوسط (للمعلم)
app.get("/api/medium-level-answers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const answers = await MediumLevelAnswer.find().sort({ submittedAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ msg: "حدث خطأ أثناء التحميل" });
  }
});


// عرض جميع إجابات مستوى السهل (للمعلم)
app.get("/easylevel-answers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const answers = await EasyLevelAnswer.find().sort({ submittedAt: -1 });

    res.json(answers);
  } catch (error) {
    res.status(500).json({ msg: "حدث خطأ أثناء التحميل" });
  }
});

// Reset Password Endpoint
app.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: 'your-email@gmail.com', // Replace with your email
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset link sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Easy Level Answers endpoint
app.post("/easylevel-answers", async (req, res) => {
  try {
    const { email, selectedLetter, isCorrect } = req.body;

    // Create new answer
    const newAnswer = new EasyLevelAnswer({
      email,
      selectedLetter,
      isCorrect,
    });

    // Save to database
    await newAnswer.save();

    res.status(200).json({ message: "Answer saved successfully" });
  } catch (error) {
    console.error("Error saving easy level answer:", error);
    res.status(500).json({ message: "Error saving answer" });
  }
});

// Medium Level Answers endpoint
app.post("/api/medium-level-answers", async (req, res) => {
  try {
    const { email, answers } = req.body;

    if (!email || !answers || !answers.firstWord || !answers.secondWord || !answers.thirdWord) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة" });
    }

    const newAnswer = new MediumLevelAnswer({
      email,
      answers,
    });

    await newAnswer.save();

    res.status(201).json({
      success: true,
      message: "تم حفظ الإجابة بنجاح",
    });
  } catch (error) {
    console.error("Error saving medium level answer:", error);
    res.status(500).json({
      message: "حدث خطأ أثناء حفظ الإجابة",
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Admin submits a report for a student
app.post("/admin/report", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized" });
    const { studentEmail, text } = req.body;
    if (!studentEmail || !text) return res.status(400).json({ msg: "Student email and text are required" });
    const student = await UserModel.findOne({ email: studentEmail, role: "student" });
    if (!student) return res.status(404).json({ msg: "Student not found" });
    if (!student.teacher) return res.status(400).json({ msg: "Student has no assigned teacher" });
    const report = new ReportModel({
      student: student._id,
      teacher: student.teacher,
      text,
    });
    await report.save();
    res.status(201).json({ msg: "Report submitted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Teacher fetches all reports for their students
app.get("/teacher/reports", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      console.log("Unauthorized access attempt:", req.user);
      return res.status(403).json({ msg: "Unauthorized" });
    }

    console.log("Fetching reports for teacher:", req.user.id);

    const reports = await ReportModel.find({ teacher: req.user.id })
      .populate({
        path: "student",
        select: "name email points",
        model: "User"
      })
      .sort({ createdAt: -1 });

    console.log("Found reports:", reports);

    if (!reports || reports.length === 0) {
      return res.json([]);
    }

    res.json(reports);
  } catch (error) {
    console.error("Error fetching teacher reports:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Teacher fetch all the students answers
// مثال لجلب بيانات الطلاب مع الأجوبة (تعديل من الكود السابق)
app.get("/teacher/answers", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const teacherId = req.user.id;

    // استيراد موديلات الأجوبة التي أرسلتها مسبقاً
    const easyAnswers = await EasyLevelAnswer.find({});
    const mediumAnswers = await MediumLevelAnswer.find({});
    const hardAnswers = await HardLevelAnswer.find({});

    // لجلب بيانات الطلاب بناءً على الإيميل
    const emails = [
      ...new Set([
        ...easyAnswers.map((a) => a.email),
        ...mediumAnswers.map((a) => a.email),
        ...hardAnswers.map((a) => a.email),
      ]),
    ];

    const students = await UserModel.find({ email: { $in: emails }, teacher: teacherId }).select("name email");

    // جمع البيانات بشكل منظم
    const combined = students.map((student) => {
      return {
        email: student.email,
        name: student.name,
        easyAnswer: easyAnswers.find((a) => a.email === student.email)?.selectedLetter || "",
        mediumAnswer: mediumAnswers.find((a) => a.email === student.email)?.answers || {},
        hardAnswer: hardAnswers.find((a) => a.email === student.email)?.sentence || "",
      };
    });

    res.json(combined);
  } catch (error) {
    console.error("Error fetching combined answers:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});




// Admin assigns a teacher to a student
app.post("/admin/assign-teacher", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ msg: "Unauthorized" });
    const { studentEmail, teacherEmail } = req.body;
    if (!studentEmail || !teacherEmail) return res.status(400).json({ msg: "Student email and teacher email are required" });
    
    const student = await UserModel.findOne({ email: studentEmail, role: "student" });
    if (!student) return res.status(404).json({ msg: "Student not found" });
    
    const teacher = await UserModel.findOne({ email: teacherEmail, role: "teacher" });
    if (!teacher) return res.status(404).json({ msg: "Teacher not found" });
    
    student.teacher = teacher._id;
    await student.save();
    
    res.json({ msg: "Teacher assigned successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// مسار جديد لجلب الطلاب مع نقاطهم
app.get("/teacher/students-with-points", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    
    const studentsWithPoints = await UserModel.find({ teacher: req.user.id, role: "student" })
      .select("name email points");  // هنا نجيب النقاط مع الاسم والإيميل
    
    res.json(studentsWithPoints);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to create a lesson with image upload
app.post("/lesson", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    // Only teachers and admins can create lessons
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    console.log('POST /lesson received data:', req.body);
    console.log('User creating lesson (req.user): ', req.user);

    const { title, description } = req.body;
    const image = req.file;

    if (!title || !description || !image) {
      return res.status(400).json({ msg: "Title, description and image are required" });
    }

    // Convert image buffer to base64 string
    const imageBase64 = image.buffer.toString('base64');
    const imageData = `data:${image.mimetype};base64,${imageBase64}`;

    const lessonData = {
      title,
      description,
      image2: imageData, // Using image2 field as per the schema
      image3: imageData, // Using image3 field as per the schema
      type: 'general',
      createdBy: req.user.id
    };

    // If the user is a teacher, also set the teacher field
    if (req.user.role === 'teacher') {
      lessonData.teacher = req.user.id;
    }

    console.log('Lesson data to be saved:', lessonData);

    const lesson = new Lesson(lessonData);
    await lesson.save();

    res.status(201).json({ msg: "Lesson created successfully", lesson });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});


// Get all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find()
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get teacher's lessons
app.get("/teacher/lessons", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    console.log('GET /teacher/lessons user (req.user):', req.user);
    console.log('Fetching lessons for teacher ID:', req.user.id);

    const lessons = await Lesson.find({ teacher: req.user.id })
      .sort({ createdAt: -1 });

    console.log('Backend query result for /teacher/lessons:', lessons);

    res.json(lessons);
  } catch (error) {
    console.error("Error fetching teacher's lessons:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Update a lesson
app.put("/lesson/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teachers can update lessons" });
    }

    const { title, description, content } = req.body;
    const lesson = await Lesson.findOne({ _id: req.params.id, teacher: req.user.id });

    if (!lesson) {
      return res.status(404).json({ msg: "Lesson not found" });
    }

    if (title) lesson.title = title;
    if (description) lesson.description = description;
    if (content) lesson.content = content;

    await lesson.save();
    res.json({ msg: "Lesson updated successfully", lesson });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Delete a lesson (soft delete)
app.delete("/lesson/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ msg: "Only teachers can delete lessons" });
    }

    const lesson = await Lesson.findOne({ _id: req.params.id, teacher: req.user.id });

    if (!lesson) {
      return res.status(404).json({ msg: "Lesson not found" });
    }

    lesson.isActive = false;
    await lesson.save();
    res.json({ msg: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// إضافة نقاط للمستخدم (مثال)
app.post("/add-points", authMiddleware, async (req, res) => {
  try {
    const { pointsToAdd, activityId } = req.body;
    if (!pointsToAdd || !activityId) return res.status(400).json({ msg: "عدد النقاط ومعرف النشاط مطلوبان" });

    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "المستخدم غير موجود" });

    // تحقق إذا كان النشاط مجاب عليه من قبل
    if (user.answeredActivities && user.answeredActivities.includes(activityId)) {
      return res.status(200).json({ msg: "تمت الإجابة على هذا النشاط من قبل", points: user.points });
    }

    // أضف النشاط إلى قائمة المجاب عنها
    user.answeredActivities = user.answeredActivities || [];
    user.answeredActivities.push(activityId);

    // أضف النقاط
    user.points = (user.points || 0) + Number(pointsToAdd);
    await user.save();

    res.status(200).json({ msg: "تمت إضافة النقاط بنجاح", points: user.points });
  } catch (error) {
    res.status(500).json({ msg: "حدث خطأ أثناء إضافة النقاط" });
  }
});

// Route لحفظ إجابة النشاط العربي
app.post("/arabic-answers", authMiddleware, async (req, res) => {
  try {
    const { email, lessonId, selectedAnswer, isCorrect } = req.body;

    if (!email || !lessonId || !selectedAnswer) {
      return res.status(400).json({ 
        success: false,
        msg: "جميع الحقول مطلوبة" 
      });
    }

    const newAnswer = new ArabicAnswer({
      email,
      lessonId,
      selectedAnswer,
      isCorrect
    });

    await newAnswer.save();

    res.status(201).json({
      success: true,
      msg: "تم حفظ الإجابة بنجاح"
    });
  } catch (error) {
    console.error("Error saving Arabic answer:", error);
    res.status(500).json({
      success: false,
      msg: "حدث خطأ أثناء حفظ الإجابة"
    });
  }
});

// Endpoint موحد لحفظ جميع إجابات الأنشطة
app.post("/activity-answers", authMiddleware, async (req, res) => {
  try {
    const { email, activityId, activityType, selectedAnswer, isCorrect } = req.body;
    if (!email || !activityId || !activityType || !selectedAnswer) {
      return res.status(400).json({ msg: "جميع الحقول مطلوبة" });
    }
    const newAnswer = new ActivityAnswer({
      email,
      activityId,
      activityType,
      selectedAnswer,
      isCorrect
    });
    await newAnswer.save();
    res.status(201).json({ msg: "تم حفظ الإجابة بنجاح" });
  } catch (error) {
    res.status(500).json({ msg: "حدث خطأ أثناء حفظ الإجابة" });
  }
});


// Endpoint to save Arabic lessons
app.post("/arabic-lessons", async (req, res) => {
  try {
    const { title, description, image, image2 } = req.body;
    const newLesson = new ArabicLesson({ title, description, image, image2 });
    await newLesson.save();
    res.status(201).json({ msg: "Arabic lesson saved successfully", lesson: newLesson });
  } catch (error) {
    console.error("Error saving Arabic lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Endpoint to save general lessons
app.post("/lessons", async (req, res) => {
  try {
    const { title, description, image2, image3 } = req.body;
    const newLesson = new Lesson({ title, description, image2, image3 });
    await newLesson.save();
    res.status(201).json({ msg: "Lesson saved successfully", lesson: newLesson });
  } catch (error) {
    console.error("Error saving lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Endpoint to save MathAdd lessons
app.post("/mathadd-lessons", async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newLesson = new MathAddLesson({ title, description, image });
    await newLesson.save();
    res.status(201).json({ msg: "MathAdd lesson saved successfully", lesson: newLesson });
  } catch (error) {
    console.error("Error saving MathAdd lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Endpoint to save MathDivide lessons
app.post("/mathdivide-lessons", async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newLesson = new MathDivideLesson({ title, description, image });
    await newLesson.save();
    res.status(201).json({ msg: "MathDivide lesson saved successfully", lesson: newLesson });
  } catch (error) {
    console.error("Error saving MathDivide lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Endpoint to save MathMultiply lessons
app.post("/mathmultiply-lessons", async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newLesson = new MathMultiplyLesson({ title, description, image });
    await newLesson.save();
    res.status(201).json({ msg: "MathMultiply lesson saved successfully", lesson: newLesson });
  } catch (error) {
    console.error("Error saving MathMultiply lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Endpoint to save MathSubtract lessons
app.post("/mathsubtract-lessons", async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const newLesson = new MathSubtractLesson({ title, description, image });
    await newLesson.save();
    res.status(201).json({ msg: "MathSubtract lesson saved successfully", lesson: newLesson });
  } catch (error) {
    console.error("Error saving MathSubtract lesson:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all lessons by type
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/arabic-lessons", async (req, res) => {
  try {
    const lessons = await ArabicLesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/mathadd-lessons", async (req, res) => {
  try {
    const lessons = await MathAddLesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/mathsubtract-lessons", async (req, res) => {
  try {
    const lessons = await MathSubtractLesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/mathmultiply-lessons", async (req, res) => {
  try {
    const lessons = await MathMultiplyLesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/mathdivide-lessons", async (req, res) => {
  try {
    const lessons = await MathDivideLesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//-------------------------------------------------------------------------------------------------
app.post('/addArabicLesson', async (req, res) => {
  try {
    const { lessonTitle, lessonCode } = req.body;

    if (!lessonTitle || !lessonCode) {
      return res.status(400).json({ message: 'كل الحقول مطلوبة' });
    }

    const newLesson = new ArabicLesson({ lessonTitle, lessonCode });
    await newLesson.save();

    res.status(201).json({ message: 'تمت إضافة الدرس بنجاح', lesson: newLesson });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في السيرفر', error: error.message });
  }
});

app.get('/getArabicLessons', async (req, res) => {
  try {
    const lessons = await ArabicLesson.find();
    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ', error: error.message });
  }
});

// تحديث درس عربي
app.put('/updateArabicLesson/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { lessonTitle, lessonCode } = req.body;

    if (!lessonTitle || !lessonCode) {
      return res.status(400).json({ message: 'كل الحقول مطلوبة' });
    }

    const updatedLesson = await ArabicLesson.findByIdAndUpdate(
      lessonId,
      { lessonTitle, lessonCode },
      { new: true } // عشان يرجع الدرس بعد التحديث
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }

    res.status(200).json({ message: 'تم تحديث الدرس بنجاح', lesson: updatedLesson });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في السيرفر', error: error.message });
  }
});

// حذف درس عربي
app.delete('/arabicLessons/:id', async (req, res) => {
  try {
    const lessonId = req.params.id;

    const deletedLesson = await ArabicLesson.findByIdAndDelete(lessonId);

    if (!deletedLesson) {
      return res.status(404).json({ message: 'الدرس غير موجود' });
    }

    res.status(200).json({ message: 'تم حذف الدرس بنجاح', success: true });
  } catch (error) {
    res.status(500).json({ message: 'حدث خطأ في السيرفر', error: error.message });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));
