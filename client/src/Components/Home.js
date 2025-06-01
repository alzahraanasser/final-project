import React, { useEffect } from "react";
import hello from "../Images/hello.png";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { setUserFromToken } from "../Features/UserSlice";
import "./Home.css"; // Import the CSS file
import { FaStar, FaTrophy } from "react-icons/fa";

function Home() {
  const { isAuthenticated } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setUserFromToken(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const getRank = (points) => {
    if (points >= 100) return "خبير";
    if (points >= 50) return "متقدم";
    return "مبتدئ";
  };

  console.log("user from redux:", user);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#b3e0fc"
      }}
    >
      {/* Show points/rank card for students only */}
      {user?.role === "student" && (
        <div
          style={{
            background: "#fff",
            border: "2px solid #fff",
            borderRadius: "10px",
            padding: "12px 18px",
            margin: "48px auto 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: "220px",
            zIndex: 10,
            maxWidth: "350px"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", color: "#FFD700" }}>
              <FaStar />
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#333" }}>
              {user.points}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#888" }}>النقاط</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", color: "#cd7f32" }}>
              <FaTrophy />
            </div>
            <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}>
              {getRank(user.points)}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#888" }}>الرتبة</div>
          </div>
        </div>
      )}
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div className="relative">
            <img
              src={hello}
              className="logo"
              alt="Website Logo"
              style={{ width: "200px", height: "300px", padding: "3px", margin: "3px" }}
            />
          </div>
          <div className="animated-text hello-text">
            مرحباً، هيا لنتعلم معاً
          </div>
          <div style={{ marginTop: "30px" }}>
            <Button
              color="primary"
              onClick={() => navigate("/lessontype")}
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                padding: "12px 30px",
                borderRadius: "8px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease"
              }}
            >
              ابدأ التعلم
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;