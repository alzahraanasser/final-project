import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Button } from 'reactstrap';
//import { awardPoints } from './AwardPoints';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';
import { useSelector } from "react-redux";

function MathMultiplyExercise() {
    const navigate=useNavigate();
    const user = useSelector((state) => state.users.user);
  const question = {
    text: 'كم ناتج ٢ × ٤ ؟',
    options: ['٦', '٨', '٧', '٩'],
    correct: '٨'
  };

  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState('');
  const [hasAwarded, setHasAwarded] = useState(false);

  const handleAnswer = async (option) => {
    setSelected(option);
    if (option === question.correct) {
      setResult('✅ إجابة صحيحة!');
      if (!hasAwarded) {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: 'math-multiply-1' },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await axios.post(
          "http://localhost:5000/activity-answers",
          {
            email: user?.email || "anonymous",
            activityId: 'math-multiply-1',
            activityType: 'math-multiply',
            selectedAnswer: option,
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
      setResult('❌ حاول مرة أخرى.');
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/activity-answers",
        {
          email: user?.email || "anonymous",
          activityId: 'math-multiply-1',
          activityType: 'math-multiply',
          selectedAnswer: option,
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

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(question.text);
    utterance.lang = 'ar-SA'; // Arabic language
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
      <h2 className="text-warning mb-4">✖️ تمرين الضرب</h2>
      <Card className="shadow p-4">
        <CardBody>
          <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
            <h4>{question.text}</h4>
            <Button color="info" onClick={speakQuestion}>🔊 استمع</Button>
          </div>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {question.options.map((option, idx) => (
              <Button
                key={idx}
                color={selected === option ? 'secondary' : 'primary'}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
          {result && (
            <div className="mt-4">
              <h5>{result}</h5>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
}

export default MathMultiplyExercise;
