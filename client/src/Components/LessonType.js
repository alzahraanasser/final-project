import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { FaArrowLeft } from 'react-icons/fa';

// Import your lesson type images
import imgMath from '../Images/math.png';
import imgEnglish from '../Images/english.png';
import imgArabic from '../Images/arabic.png';

function LessonType() {
  const navigate = useNavigate();

  const lessonTypes = [
    {
      title: "رياضيات",
      subtitle: "Education Module",
      image: imgMath,
      onClick: () => navigate("/mathlesson"),
    },
    {
      title: "English",
      subtitle: "Education Module",
      image: imgEnglish,
      onClick: () => navigate("/lessons"),
    },
    {
      title: "اللغة العربية",
      subtitle: "Education Module",
      image: imgArabic,
      onClick: () => navigate("/arabiclesson"),
    },
  ];

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-start mb-3">
        <Button
          color="link"
          onClick={() => navigate(-1)}
          style={{ color: "black", padding: 0 }}
        >
          <FaArrowLeft size={24} />
        </Button>
      </div>
      <div className="text-center">
        <h2 className="mb-4">اختر مادة</h2>
        <div className="d-flex justify-content-center flex-wrap gap-4">
          {lessonTypes.map((type, index) => (
            <Card
              key={index}
              onClick={type.onClick}
              style={{
                width: "250px",
                cursor: "pointer",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <img
                src={type.image}
                alt={`${type.title} lesson`}
                style={{
                  height: "120px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
              <CardBody className="text-center">
                <h5>{type.title}</h5>
                <p className="text-muted" style={{ fontSize: "0.9rem" }}>{type.subtitle}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}

export default LessonType;
