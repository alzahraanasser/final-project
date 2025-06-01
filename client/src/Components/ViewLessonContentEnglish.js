import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Card, CardBody, CardImg, CardText } from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";

const ViewLessonContentEnglish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // جلب محتوى الدرس من localStorage
    const savedContent = localStorage.getItem(`lessonContentEnglish_${id}`);
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    }

    // جلب الدور من localStorage
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this lesson's content?")) {
      localStorage.removeItem(`lessonContentEnglish_${id}`);
      alert("Content deleted successfully");
      navigate(-1);
    }
  };

  if (!content) {
    return (
      <Container className="mt-5 text-center">
        <h2 className="mb-4">No content for this lesson.</h2>
        {userRole !== "student" && (
          <div className="d-flex justify-content-center mt-4">
            <Button color="success" onClick={() => navigate(`/addlessoncontentenglish/${id}`)}>
              Add Content
            </Button>
          </div>
        )}
      </Container>
    );
  }

  return (
    <Container className="mt-5">
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

      <Row className="g-4 justify-content-center">
        <Col md={4}>
          <Card className="shadow h-100 text-center">
            {content.image && <CardImg top src={content.image} alt="Lesson Image" />}
            <CardBody></CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow h-100">
            <CardBody className="d-flex flex-column justify-content-center">
              <CardText
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                {content.description}
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow h-100 text-center d-flex flex-column justify-content-center">
            <CardBody className="d-flex flex-grow-1">
              <CardText
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                {content.exampleWord}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* الأزرار — مخفية لو المستخدم طالب */}
      {userRole !== "student" && (
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button color="warning" onClick={() => navigate(`/addlessoncontentenglish/${id}`)}>
            ✏️ Edit
          </Button>
          <Button color="danger" onClick={handleDelete}>
            🗑️ Delete
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ViewLessonContentEnglish;
