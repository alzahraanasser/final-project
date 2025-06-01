// توليد كلمة مرور بسيطة (للطلبة)
function generateSimplePassword() {
    return "123456"; // كلمة مرور بسيطة وسهلة للتذكر
  }
  
  // توليد الإيميل بناءً على الدور (معلمين أو طلاب)
  function generateEmail(role, name, phone) {
    // إذا كان المستخدم معلمًا، سيتم استخدام صيغة مختلفة للإيميل
    const domain = role === "teacher" ? "name@teacher.com" : "name@student.com"; 
    // إذا كان يوجد رقم هاتف للمستخدم، يمكننا استخدامه كإيميل
    // وإذا لم يكن رقم الهاتف موجودًا، سيتم استخدام الاسم بشكل مبسط (مثال: "ahmed.ali@school.com")
    return phone ? phone + "@" + domain : name.toLowerCase().replace(/\s+/g, ".") + "@" + domain;
  }
  
  // إضافة مستخدم جديد (مع معلمة للدور مثل "teacher" أو "student" ورقم الهاتف)
  export async function createUser(name, role, phone) {
    try {
      const password = generateSimplePassword(); // توليد كلمة مرور بسيطة
      const email = generateEmail(role, name, phone); // توليد الإيميل بناءً على الدور ورقم الهاتف (إذا كان موجودًا)
  
      const hashedPassword = await bcrypt.hash(password, 10); // تشفير كلمة المرور قبل حفظها
  
      const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        role,
      });
  
      await user.save(); // حفظ المستخدم في قاعدة البيانات
      console.log("User created successfully:", user);
  
      return user;
    } catch (error) {
      console.error("Error creating user:", error); // التعامل مع الأخطاء
    }
  }
  