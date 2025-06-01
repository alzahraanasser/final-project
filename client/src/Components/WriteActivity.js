import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardBody, Button, Input, Label } from "reactstrap";
import { FaArrowLeft, FaMicrophone } from "react-icons/fa";
import lessonData from "../lessonData";
import { useSelector } from "react-redux";
import axios from "axios";

const WriteActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user); // جلب المستخدم من الـ Redux store

  const lesson = lessonData.find((item) => item.id === parseInt(id));

  const [capitalLetter, setCapitalLetter] = useState("");
  const [smallLetter, setSmallLetter] = useState("");
  const [result, setResult] = useState("");

  if (!lesson) {
    return (
      <Container className="mt-5 text-center">
        <h2 className="text-danger">Activity not found</h2>
        <Button color="primary" onClick={() => navigate("/lessons")}>
          Go Back
        </Button>
      </Container>
    );
  }

  const correctLetter = lesson.activityLetter;

  const handleSubmit = async () => {
    if (!user) {
      setResult("❌ يجب تسجيل الدخول أولاً");
      return;
    }

    if (
      capitalLetter === correctLetter.toUpperCase() &&
      smallLetter === correctLetter.toLowerCase()
    ) {
      setResult("✅ Correct! Well done!");
      const token = localStorage.getItem("token");

      try {
        // إضافة نقاط
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // حفظ إجابة النشاط
        await axios.post(
          "http://localhost:5000/activity-answers",
          {
            email: user.email,
            activityId: id,
            activityType: "write",
            selectedAnswer: capitalLetter + smallLetter,
            isCorrect: true,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // تحديث بيانات المستخدم (اختياري حسب تطبيقك)
        // يمكنك هنا إما إعادة جلب بيانات المستخدم أو تحديث النقاط في الـ Redux store
      } catch (error) {
        console.error("Error updating points:", error);
        setResult("❌ Error updating points. Please try again.");
      }
    } else {
      setResult("❌ Try again!");
      const token = localStorage.getItem("token");

      try {
        await axios.post(
          "http://localhost:5000/activity-answers",
          {
            email: user.email,
            activityId: id,
            activityType: "write",
            selectedAnswer: capitalLetter + smallLetter,
            isCorrect: false,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Error saving answer:", error);
      }
    }
  };

  const handleTextToSpeech = () => {
  const utterance = new window.SpeechSynthesisUtterance(
    `Write the letter ${correctLetter} in both capital and small form.`
  );
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
};


  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <div className="d-flex mb-3" style={{ justifyContent: "flex-start", direction: "ltr" }}>
        <Button
          type="button"
          color="link"
          style={{ color: "black", padding: 0 }}
          onClick={() => navigate(-2)}
          title="Go back"
          aria-label="Go back"
        >
        <FaArrowLeft size={24} color="black" />
        </Button>
      </div>
      <Card className="p-4 shadow" style={{ backgroundColor: "#cce7f0", width: "320px" }}>
        <CardBody className="text-center">
          <div
            style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}
          >
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
              }}
            >
              <FaMicrophone size={24} />
            </button>
          </div>
          <h4 className="mb-3">Write the Letter {correctLetter}</h4>

          <Label className="fw-bold">Write in CAPITAL</Label>
          <Input
            type="text"
            maxLength="1"
            className="mb-2 text-center"
            value={capitalLetter}
            onChange={(e) => setCapitalLetter(e.target.value)}
          />

          <Label className="fw-bold">Write in small</Label>
          <Input
            type="text"
            maxLength="1"
            className="mb-2 text-center"
            value={smallLetter}
            onChange={(e) => setSmallLetter(e.target.value)}
          />

          <Button color="success" className="mt-3" onClick={handleSubmit}>
            Submit
          </Button>
          {result && (
            <div className="mt-4">
              <h5>{result}</h5>
            </div>
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default WriteActivity;
