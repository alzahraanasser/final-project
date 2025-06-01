import React, { useState } from 'react';
import { Container, Row, Col, Card, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaVolumeUp, FaGamepad } from 'react-icons/fa';

function MathNumbers() {
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const numbers = [
    { arabic: 'واحد', arabicNumeral: '١', color: 'primary' },
    { arabic: 'اثنان', arabicNumeral: '٢', color: 'success' },
    { arabic: 'ثلاثة', arabicNumeral: '٣', color: 'info' },
    { arabic: 'أربعة', arabicNumeral: '٤', color: 'warning' },
    { arabic: 'خمسة', arabicNumeral: '٥', color: 'danger' },
    { arabic: 'ستة', arabicNumeral: '٦', color: 'primary' },
    { arabic: 'سبعة', arabicNumeral: '٧', color: 'success' },
    { arabic: 'ثمانية', arabicNumeral: '٨', color: 'info' },
    { arabic: 'تسعة', arabicNumeral: '٩', color: 'warning' },
    { arabic: 'عشرة', arabicNumeral: '١٠', color: 'danger' }
  ];

  const speakNumber = (number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(number.arabic);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      utterance.onend = () => {
        setIsPlaying(false);
      };
    } else {
      alert('Text-to-speech is not supported in your browser.');
    }
  };

  return (
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

      <h2 className="mb-4 text-primary text-center">🔢 تعلم الأرقام من ١ إلى ١٠</h2>
      
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow">
            <CardBody>
              <ListGroup flush>
                {numbers.map((number, index) => (
                  <ListGroupItem 
                    key={index}
                    className={`d-flex justify-content-between align-items-center p-3 ${
                      selectedNumber === number.arabicNumeral ? 'bg-light' : ''
                    }`}
                    style={{ 
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      borderLeft: `4px solid var(--bs-${number.color})`
                    }}
                    onClick={() => setSelectedNumber(number.arabicNumeral)}
                  >
                    <div className="d-flex align-items-center">
                      <span 
                        className="me-3" 
                        style={{ 
                          fontSize: '2rem', 
                          fontWeight: 'bold',
                          color: `var(--bs-${number.color})`
                        }}
                      >
                        {number.arabicNumeral}
                      </span>
                      <span style={{ fontSize: '1.2rem' }}>{number.arabic}</span>
                    </div>
                    <Button
                      color="link"
                      className="p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakNumber(number);
                      }}
                      disabled={isPlaying}
                    >
                      <FaVolumeUp size={20} color={`var(--bs-${number.color})`} />
                    </Button>
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>

          <div className="text-center mt-5">
            <Button
              color="success"
              size="lg"
              className="px-5 py-3 d-flex align-items-center gap-2 mx-auto"
              onClick={() => navigate('/mathnumbersactivity')}
              style={{ 
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <FaGamepad size={24} />
              ابدأ النشاط
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default MathNumbers; 