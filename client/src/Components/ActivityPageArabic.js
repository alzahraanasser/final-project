import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardBody, Button } from "reactstrap";
import { FaArrowLeft, FaMicrophone } from "react-icons/fa";
import LetterData from "../LetterData";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserFromToken } from "../Features/UserSlice";

const ActivityPageArabic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = LetterData.find(item => item.id === parseInt(id));
  const user = useSelector((state) => state.users.user);

  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState(null);
  const correctOption = lesson?.correctText;

  const dispatch = useDispatch();

  useEffect(() => {
    if (lesson) {
      const allOptions = [correctOption];

      // مشتتات ثابتة
      const distractors = ["بَ", "س", "دِ", "و", "خُ", "ي", "تُ", "جِ", "رُ"];
      while (allOptions.length < 4) {
        const random = distractors[Math.floor(Math.random() * distractors.length)];
        if (!allOptions.includes(random)) {
          allOptions.push(random);
        }
      }

      // خلط الخيارات
      setOptions(allOptions.sort(() => Math.random() - 0.5));
    }
  }, [lesson, correctOption]);

  const handleAnswerClick = async (text) => {
    if (text === correctOption) {
      setMessage({ text: "✅ أحسنت! الإجابة صحيحة", type: "success" });
      
      try {
        // حفظ الإجابة
        await axios.post(
          "http://localhost:5000/arabic-answers",
          {
            email: user.email,
            lessonId: parseInt(id),
            selectedAnswer: text,
            isCorrect: true
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // زيادة النقاط
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(setUserFromToken(token));
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    } else {
      setMessage({ text: "❌ حاول مرة أخرى", type: "danger" });
      
      // حفظ الإجابة الخاطئة
      try {
        await axios.post(
          "http://localhost:5000/arabic-answers",
          {
            email: user.email,
            lessonId: parseInt(id),
            selectedAnswer: text,
            isCorrect: false
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    }
  };

  const speakQuestion = () => {
    const utter = new SpeechSynthesisUtterance(`اختر الشكل الصحيح للحرف ${lesson.title}`);
    utter.lang = "ar-SA";
    window.speechSynthesis.speak(utter);
  };

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    window.speechSynthesis.speak(utter);
  };

  if (!lesson) {
    return <div className="text-center mt-5 text-danger">لم يتم العثور على الدرس</div>;
  }

  return (
    <Container className="mt-5 text-center">
      <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginBottom: '12px' }}>
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
      <Card className="shadow p-4 bg-light">
        <CardBody>
          <div className="d-flex align-items-center justify-content-center mb-4 gap-3">
            <h3 className="mb-0">اختر الشكل الصحيح للحرف {lesson.title}</h3>
            <button
              onClick={speakQuestion}
              style={{
                padding: "8px",
                backgroundColor: "transparent",
                color: "#111184",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <FaMicrophone size={24} />
            </button>
          </div>
          <div className="d-flex justify-content-center flex-wrap gap-3 mb-4">
            {options.map((opt, idx) => (
              <Button
                key={idx}
                color="secondary"
                className="px-4 py-2"
                onClick={() => handleAnswerClick(opt)}
                onDoubleClick={() => speak(opt)}
                style={{ fontSize: "1.5rem" }}
              >
                {opt}
              </Button>
            ))}
          </div>
          {message && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default ActivityPageArabic;
