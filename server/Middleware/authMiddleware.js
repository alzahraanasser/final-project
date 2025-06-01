import jwt from "jsonwebtoken";

// Middleware للتحقق من التوكن وصلاحية المستخدم
const authMiddleware = (req, res, next) => {
  // 1. التوكن عادةً يجي على شكل: Bearer <token>، فنفصل الكلمة عن التوكن الفعلي
  const token = req.header("Authorization")?.split(" ")[1]; // ناخذ التوكن فقط

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // 2. نفك التوكن ونستخرج بيانات المستخدم
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. نحفظ بيانات المستخدم في الطلب لاستخدامها لاحقًا
    req.user = decoded; // بيحتوي على: id و role

    // نتحقق من نوع الطلب
    if (req.method === 'GET' && req.path === '/hardlevel-answers') {
      // للـ GET نسمح فقط للمعلمين
      if (req.user.role !== "teacher") {
        return res.status(403).json({ msg: "Access denied. You are not a teacher." });
      }
    }
    // للـ POST نسمح للمعلمين والطلاب
    else if (req.method === 'POST' && req.path === '/hardlevel-answers') {
      if (!["teacher", "student"].includes(req.user.role)) {
        return res.status(403).json({ msg: "Access denied. You are not authorized." });
      }
    }

    next(); // Only call this if you did not send a response above!
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default authMiddleware;
