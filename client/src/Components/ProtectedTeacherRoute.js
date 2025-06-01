import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedTeacherRoute = ({ user, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // إرسال التوكن للمخدم للتحقق من صحته
        const response = await axios.get("/user", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (response.data.user.role !== "teacher") {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        // في حال التوكن غير صالح أو لم يكن معلم
        return <Navigate to="/unauthorized" />;
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      verifyToken();
    } else {
      setLoading(false); // حالة loading انتهت
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // أو عرض شاشة تحميل
  }

  if (!user || user.role !== "teacher") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedTeacherRoute;
