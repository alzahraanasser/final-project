import React, { useState } from "react";
import { Container, Button, Card, CardBody } from "reactstrap";
import { FaMicrophone, FaArrowLeft } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import { awardPoints } from "./AwardPoints";

const EasyLevel = () => {
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const letters = ["ا", "ب", "ج", "د", "هـ", "و"];
  const correctLetter = "ب"; // Example correct letter
  const word = "بطة"; // The word in parentheses

  // Text-to-Speech function for the question
  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;
    // Cancel any ongoing speech
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance("هذه الكلمة تبدأ بأي حرف؟ (بطة)");
    utterance.lang = "ar-SA"; // Arabic language
    utterance.rate = 1.0; // Normal speed
    synth.speak(utterance);
  };

  const handleLetterClick = async (letter) => {
    if (!user) {
      alert("You need to be logged in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/easylevel-answers",
        {
          email: user.email,
          selectedLetter: letter,
          isCorrect: letter === correctLetter
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // حفظ الإجابة في النموذج الموحد
      await axios.post(
        "http://localhost:5000/activity-answers",
        {
          email: user.email,
          activityId: "easy-level-" + correctLetter,
          activityType: "easy",
          selectedAnswer: letter,
          isCorrect: letter === correctLetter
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccess(true);
      
      // Award points if the answer is correct
      if (letter === correctLetter) {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: "easy-level-answer" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }

    if (letter === correctLetter) {
      setMessage({ type: "success", text: `✅ الإجابة صحيحة! الكلمة تبدأ بالحرف: ${letter}` });
    } else {
      setMessage({ type: "error", text: "❌ الإجابة خاطئة! حاول مرة أخرى." });
    }
  };

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow" style={{ backgroundColor: "#cce7f0" }}>
        <CardBody className="text-center">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Button
              color="link"
              onClick={() => navigate(-1)}
              style={{ color: "black", padding: 0 }}
            >
              <FaArrowLeft size={24} />
            </Button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <p className="fw-bold" style={{ fontSize: "1.5rem", margin: 0 }}>
                هذه الكلمة تبدأ بأي حرف؟ ({word})
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
                  alignItems: "center"
                }}
              >
                <FaMicrophone size={24} />
              </button>
            </div>
            <div style={{ width: "24px" }}></div> {/* Empty div for balance */}
          </div>

          {/* Displaying the letter options */}
          <div className="mt-4 d-flex justify-content-center gap-3">
            {letters.map((letter, index) => (
              <Button
                key={index}
                color="light"
                className="px-4 py-3 border"
                style={{ fontSize: "1.5rem" }}
                onClick={() => handleLetterClick(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>

          {/* Displaying feedback message */}
          {message && (
            <div
              className={`mt-3 p-2 text-white ${message.type === "success" ? "bg-success" : "bg-danger"}`}
            >
              {message.text}
            </div>
          )}
          {success && <p style={{ color: "green", marginTop: "15px" }}>تم حفظ الإجابة بنجاح!</p>}
        </CardBody>
      </Card>
    </Container>
  );
};

export default EasyLevel;
