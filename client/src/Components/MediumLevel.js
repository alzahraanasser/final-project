import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaMicrophone } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
//import { awardPoints } from "./AwardPoints";

const MediumLevel = () => {
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance("اكتبي 3 كلمات تحتوي على حرف الهاء بحيث يكون حرف الهاء في الكلمة الاولى في بداية الكلمة , الكلمة الثانية يكون حرف الهاء في وسطها , و الكلمة الثالثة يكون حرف الهاء في نهاية الكلمة.");
    utterance.lang = "ar-SA"; // Arabic language
    utterance.rate = 1.0; // Normal speed
    synth.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        setError("يجب تسجيل الدخول أولاً");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/medium-level-answers",
        {
          email: user.email,
          answers: {
            firstWord: answer1,
            secondWord: answer2,
            thirdWord: answer3
          }
        }
      );

      if (response.data.success) {
        setSuccess("تم حفظ الإجابة بنجاح");
        setAnswer1("");
        setAnswer2("");
        setAnswer3("");
        
        // Award points for submitting the answer
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: "medium-level-answer" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        // حفظ الإجابة في النموذج الموحد
        await axios.post(
          "http://localhost:5000/activity-answers",
          {
            email: user.email,
            activityId: "medium-level-answer",
            activityType: "medium",
            selectedAnswer: `${answer1}|${answer2}|${answer3}`,
            isCorrect: true
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setError(error.response?.data?.message || "حدث خطأ أثناء حفظ الإجابة");
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            padding: "8px", 
            backgroundColor: "transparent", 
            color: "black", 
            border: "none", 
            borderRadius: "6px", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            marginRight: "auto"
          }}
        >
          <FaArrowLeft size={24} />
        </button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ marginBottom: "10px", fontSize: "1.5rem", fontWeight: "bold" }}>
          اكتبي 3 كلمات تحتوي على حرف الهاء بحيث يكون حرف الهاء في الكلمة الاولى في بداية الكلمة , الكلمة الثانية يكون حرف الهاء في وسطها , و الكلمة الثالثة يكون حرف الهاء في نهاية الكلمة.
        </p>
        <button 
          onClick={handleTextToSpeech} 
          style={{ 
            padding: "8px", 
            backgroundColor: "transparent", 
            color: "black", 
            border: "none", 
            borderRadius: "6px", 
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto"
          }}
        >
          <FaMicrophone size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <div>
          <label>الكلمة الأولى:</label>
          <input
            type="text"
            value={answer1}
            onChange={(e) => setAnswer1(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>
        <div>
          <label>الكلمة الثانية:</label>
          <input
            type="text"
            value={answer2}
            onChange={(e) => setAnswer2(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>
        <div>
          <label>الكلمة الثالثة:</label>
          <input
            type="text"
            value={answer3}
            onChange={(e) => setAnswer3(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
        </div>
        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "12px 24px",
            backgroundColor: "#111184",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ارسال
        </button>
      </form>
      {success && <p style={{ color: "green", marginTop: "15px" }}>{success}</p>}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
};

export default MediumLevel;
