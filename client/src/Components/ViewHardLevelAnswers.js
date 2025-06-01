import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from "reactstrap";
import { useNavigate } from 'react-router-dom';


const ViewHardLevelAnswers = () => {
  const [answers, setAnswers] = useState([]);
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/hardlevel-answers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAnswers(response.data);
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    if (user?.role === "teacher") {
      fetchAnswers();
    }
  }, [user]);

  if (!user || user.role !== "teacher") {
    return <Navigate to="/login" />;
  }

  return (
    <div style={{ padding: "20px" }}>
      <div className="d-flex justify-content-start mb-3">
        <Button
          type="button"
          color="link"
          style={{ color: "black", padding: 0 }}
          onClick={() => navigate(-1)}
          title="Go back"
          aria-label="Go back"
        >
          <FaArrowLeft size={24} color="black" />
        </Button>
      </div>
      <h2>إجابات الطلاب لمستوى الصعوبة (Hard Level)</h2>

      {answers.length === 0 ? (
        <p>لا توجد إجابات حتى الآن.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>#</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>إيميل الطالب</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>الإجابة</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>تاريخ الإرسال</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((ans, index) => (
              <tr key={ans._id}>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{index + 1}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ans.email}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>{ans.sentence}</td>
                <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                  {new Date(ans.submittedAt).toLocaleString("ar-EG")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewHardLevelAnswers;
