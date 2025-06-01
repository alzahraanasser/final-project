import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const ProtectedStudentRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!user?.token) {
          throw new Error("No token");
        }

        const response = await axios.get("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (response.data.user.role !== "student") {
          throw new Error("Unauthorized");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        return <Navigate to="/unauthorized" />;
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "student") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedStudentRoute; 