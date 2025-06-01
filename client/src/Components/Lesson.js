import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, CardBody, Alert, Button } from "reactstrap";
import lessonData from "../lessonData"; // Import lessonData.js
import { FaArrowLeft,FaMicrophone } from "react-icons/fa";

const Lesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [lessons, setLessons] = useState(lessonData); // Local state for lessons

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Find lesson by ID
  const lesson = lessons.find((item) => item.id === parseInt(id));

  if (!lesson) {
    return (
      <Container className="mt-5 text-center">
        <Alert color="danger">Lesson not found</Alert>
        <Button color="link" style={{ color: "black", padding: 0 }} onClick={() => navigate(-1)}>
          <FaArrowLeft size={24} color="black" />
        </Button>
      </Container>
    );
  }

  // Text-to-Speech function for description
  const handleTextToSpeech = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(lesson.description);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  // Text-to-Speech function for the letter
  const handleLetterToSpeech = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(lesson.image2);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  // Delete lesson function
  // eslint-disable-next-line no-unused-vars
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const updatedLessons = lessons.filter((item) => item.id !== parseInt(id));
      setLessons(updatedLessons);
      setMessage({ type: "success", text: "Lesson deleted successfully!" });

      setTimeout(() => {
        navigate("/lessons"); // Redirect after deletion
      }, 1000);
    }
  };

  return (
    <div className="main-container">
      <Container className="mt-5">
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
        <h1 className="text-center text-primary">Lesson Details</h1>

        {/* Display message alert if needed */}
        {message && (
          <Alert 
            color={message.type === "error" ? "danger" : "success"}
            className="text-center"
            aria-live="polite"
          >
            {message.text}
          </Alert>
        )}

        <Row className="g-4 justify-content-center">
          {/* First Card - Image 2 */}
          <Col md={4}>
            <Card className="shadow h-100">
              <CardBody className="text-center d-flex flex-column align-items-center justify-content-center">
                <h1 style={{ fontSize: "6rem", fontWeight: "bold", color: "#333" }}>
                  {lesson.image2}
                </h1>
                <button
                  onClick={handleLetterToSpeech}
                  style={{
                  padding: "8px",
                  backgroundColor: "transparent",
                  color: "black",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "16px"
                  }}
                  >
                <FaMicrophone size={24} />
                </button>
              </CardBody>
            </Card>
          </Col>

          {/* Second Card - Description with Text-to-Speech */}
          <Col md={4}>
            <Card className="shadow h-100">
              <CardBody className="text-center d-flex flex-column align-items-center justify-content-center">
                <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#333" }}>
                  {lesson.description}
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
                  marginTop: "16px"
                  }}
                  >
                <FaMicrophone size={24} />
                </button>
              </CardBody>
            </Card>
          </Col>

          {/* Third Card - Image 3 */}
          <Col md={4}>
            <Card className="shadow h-100">
              <CardBody className="text-center d-flex flex-column align-items-center justify-content-center">
                <img
                  src={lesson.image3}
                  alt={lesson.title || "Lesson content"}
                  className="img-fluid mb-3"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-4 gap-3">
          {/*
          <Button
            type="button"
            color="warning"
            className="px-4 py-2"
            onClick={() => navigate(/update-lesson/${id})}
          >
            ✏ Edit
          </Button>

          <Button
            type="button"
            color="danger"
            className="px-4 py-2"
            onClick={handleDelete} // Delete Function
          >
            🗑 Delete
          </Button>
          */}
          {/* New Activity Button */}
          <Button
            type="button"
            color="success"
            className="px-4 py-2"
            onClick={() => navigate(`/activity/${id}`)}
          >
            Start Activity 🏆
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Lesson;