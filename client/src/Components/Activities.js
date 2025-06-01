import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, CardBody, Button } from "reactstrap";
import { FaArrowLeft, FaMicrophone } from "react-icons/fa";
import lessonData from "../lessonData"; // Import lesson data
//import { awardPoints } from './AwardPoints';
import { useDispatch, useSelector } from "react-redux";
import { setUserFromToken } from "../Features/UserSlice";
import axios from "axios";

const ActivityPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  
  // Declare hooks first, before any conditions
  const [message, setMessage] = useState(null);
  const [options, setOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(false); // Track correct answer
  const [hasAwarded, setHasAwarded] = useState(false);

  // Get lesson data (no hooks inside conditions)
  const lesson = lessonData.find((item) => item.id === parseInt(id));

  const correctLetter = lesson?.activityLetter || null; // Safe access even if lesson is undefined

useEffect(() => {
  if (correctLetter) {
    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let choices = new Set([correctLetter]); // Add correct letter first

    while (choices.size < 6) {
      const randomLetter = allLetters[Math.floor(Math.random() * allLetters.length)];
      choices.add(randomLetter);
    }

    setOptions([...choices].sort(() => Math.random() - 0.5)); // Shuffle options
  }
}, [correctLetter]);

// Now it's safe to return early without affecting hooks
if (!lesson) {
  return (
    <Container className="mt-5 text-center">
      <h2 className="text-danger">Activity not found</h2>
      <div>
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
    </Container>
  );
}

  // Handle user selection
  const handleAnswerClick = async (letter) => {
    if (letter === correctLetter) {
      setMessage({ type: "success", text: `✅ Correct! The letter is ${correctLetter}` });
      setIsCorrect(true); // Allow navigation
      if (!hasAwarded) {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:5000/add-points",
          { pointsToAdd: 1, activityId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        await axios.post(
          "http://localhost:5000/activity-answers",
          {
            email: user?.email || "anonymous",
            activityId: id,
            activityType: "activity",
            selectedAnswer: letter,
            isCorrect: true
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(setUserFromToken(token));
        setHasAwarded(true);
      }
    } else {
      setMessage({ type: "error", text: "❌ Try again!" });
      setIsCorrect(false); // Prevent navigation
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/activity-answers",
        {
          email: user?.email || "anonymous",
          activityId: id,
          activityType: "activity",
          selectedAnswer: letter,
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

  // Text-to-Speech
  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(
      `Choose the letter ${correctLetter} from the following`
    );
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      {/* Back Arrow Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', marginBottom: '12px' }}>
        <Button color="link" style={{ color: 'black', padding: 0 }} onClick={() => navigate(-1)}>
          <FaArrowLeft size={24} />
        </Button>
      </div>
      <Card className="p-4 shadow" style={{ backgroundColor: "#cce7f0", width: "320px" }}>
        <CardBody className="text-center">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-3">Activity {id}</h4>
            <Button
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
            </Button>
          </div>

          {/* Question */}
          <p className="fw-bold">Choose the letter {correctLetter} from the following</p>

          {/* Answer Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {options.map((letter, index) => (
              <Button
                key={index}
                color="light"
                className="px-4 py-3 border"
                onClick={() => handleAnswerClick(letter)}
                style={{ fontSize: "1.5rem" }}
              >
                {letter}
              </Button>
            ))}
          </div>

          {/* Feedback Message */}
          {message && (
            <div
              className={`mt-3 p-2 text-white ${message.type === "success" ? "bg-success" : "bg-danger"}`}
            >
              {message.text}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button
              color="primary"
              onClick={() => navigate(`/write-activity/${id}`)}
              disabled={!isCorrect}
              style={{
                padding: "12px 28px",
                fontSize: "1.2rem",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0056b3"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = ""}
            >
              Next ➡️
            </Button>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default ActivityPage;
