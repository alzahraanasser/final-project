import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, CardBody, Button, Alert } from "reactstrap";
//import { awardPoints } from './AwardPoints';
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

function MathDivideExercise() {
    const navigate=useNavigate();
    const user = useSelector((state) => state.users.user);
  const [message, setMessage] = useState(null);
  const [hasAwarded, setHasAwarded] = useState(false);

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleCheck = async (answer) => {
    if (answer === 2) {
      setMessage({ text: "✔️ إجابة صحيحة!", type: "success" });
      if (!hasAwarded) {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: 'math-divide-1' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await axios.post(
          "http://localhost:5000/activity-answers",
          {
            email: user?.email || "anonymous",
            activityId: 'math-divide-1',
            activityType: 'math-divide',
            selectedAnswer: answer.toString(),
            isCorrect: true
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasAwarded(true);
      }
    } else {
      setMessage({ text: "❌ حاول مرة أخرى", type: "danger" });
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/activity-answers",
        {
          email: user?.email || "anonymous",
          activityId: 'math-divide-1',
          activityType: 'math-divide',
          selectedAnswer: answer.toString(),
          isCorrect: false
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance("٤ تقسيم ٢ يساوي كم؟");
    utterance.lang = "ar-SA";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Container className="mt-5 text-center">
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
      <h2 className="text-success mb-4">➗ تمرين القسمة</h2>
      <Card className="shadow p-4">
        <CardBody>
          <h4 className="mb-3">٤ ÷ ٢ = ؟</h4>
          <Button color="info" onClick={handleSpeak} className="mb-4">🔊 استمع</Button>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {[1, 2, 3].map((num, idx) => (
              <Button key={idx} color="secondary" onClick={() => handleCheck(num)}>
                {num}
              </Button>
            ))}
          </div>
          {message && (
            <Alert 
              color={message.type} className="mt-4"
              aria-live="polite"  
            >
              {message.text}
            </Alert>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

export default MathDivideExercise;
