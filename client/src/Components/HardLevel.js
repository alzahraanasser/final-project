import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaArrowLeft, FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import pic1 from "../Images/pic1.jpg"
//import { awardPoints } from "./AwardPoints";

const HardLevel = () => {
  const [sentence, setSentence] = useState("");
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  // Function for Text-to-Speech
  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;
    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance("اكتبي جملة تصف هذه الصورة");
    utterance.lang = "ar-SA"; // Arabic language
    utterance.rate = 1.0; // Normal speed
    synth.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sentence.trim()) {
      setMessage("يرجى إدخال إجابة.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/add-points",
        { pointsToAdd: 1, activityId: "hard-level-answer" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // حفظ الإجابة في النموذج الموحد
      await axios.post(
        "http://localhost:5000/activity-answers",
        {
          email: user?.email || "anonymous",
          activityId: "hard-level-answer",
          activityType: "hard",
          selectedAnswer: sentence,
          isCorrect: true
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("تم إرسال الإجابة بنجاح!");
      setSentence("");
    } catch (error) {
      console.error("حدث خطأ أثناء الإرسال:", error);
      setMessage("حدث خطأ أثناء الإرسال.");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Back Arrow */}
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
          اكتبي جملة تصف هذه الصورة
        </p>
        
        {/* Text-to-Speech Button */}
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

        {/* Image */}
        <img 
          src={pic1} 
          alt="صورة النشاط" 
          style={{ 
            maxWidth: "100%", 
            height: "auto", 
            marginBottom: "20px",
            borderRadius: "8px"
          }} 
        />
      </div>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="sentence" style={{ fontSize: "1.2rem" }}>الإجابة:</Label>
          <Input
            type="textarea"
            name="sentence"
            id="sentence"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="اكتب الجملة هنا..."
            rows="4"
            style={{ 
              resize: "none", 
              fontSize: "1.2rem",
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />
        </FormGroup>

        {message && (
          <div className="alert alert-info mt-3">{message}</div>
        )}

        <Button
          type="submit"
          style={{
            backgroundColor: "#111184",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "10px 32px",
            fontSize: "1.5rem",
            width: "auto",
            display: "block",
            margin: "24px auto 0 auto"
          }}
        >
          ارسال
        </Button>
      </Form>
    </div>
  );
};

export default HardLevel;
