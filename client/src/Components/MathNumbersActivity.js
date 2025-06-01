import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaVolumeUp } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { setUserFromToken } from '../Features/UserSlice';
import axios from 'axios';

function MathNumbersActivity() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAwarded, setHasAwarded] = useState(false);

  const questions = [
    {
      image: '⭐️⭐️⭐️',
      count: 3,
      arabicNumeral: '٣',
      color: 'info'
    },
    {
      image: '✏️✏️✏️✏️✏️✏️✏️✏️',
      count: 8,
      arabicNumeral: '٨',
      color: 'primary'
    },
    {
      image: '🌳',
      count: 1,
      arabicNumeral: '١',
      color: 'success'
    },
    {
      image: '🍎🍎🍎🍎',
      count: 4,
      arabicNumeral: '٤',
      color: 'danger'
    },
    {
      image: '📚📚📚📚📚',
      count: 5,
      arabicNumeral: '٥',
      color: 'warning'
    },
    {
      image: '🎨🎨🎨🎨🎨🎨',
      count: 6,
      arabicNumeral: '٦',
      color: 'info'
    },
    {
      image: '🎵🎵🎵🎵🎵🎵🎵',
      count: 7,
      arabicNumeral: '٧',
      color: 'success'
    },
    {
      image: '🎪🎪',
      count: 2,
      arabicNumeral: '٢',
      color: 'primary'
    },
    {
      image: '🎨🎨🎨🎨🎨🎨🎨🎨🎨',
      count: 9,
      arabicNumeral: '٩',
      color: 'warning'
    },
    {
      image: '⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️',
      count: 10,
      arabicNumeral: '١٠',
      color: 'danger'
    }
  ];

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

  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];
    
    // Generate 3 random options excluding the correct answer
    let options = [...numbers];
    const correctIndex = numbers.findIndex(n => n.arabicNumeral === question.arabicNumeral);
    options.splice(correctIndex, 1);
    options = options.sort(() => Math.random() - 0.5).slice(0, 3);
    options.push(numbers[correctIndex]);
    options = options.sort(() => Math.random() - 0.5);

    setCurrentQuestion(question);
    setOptions(options);
    setFeedback(null);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

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
    }
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("كم عدد الأشياء في الصورة؟");
      utterance.lang = 'ar-SA';
      utterance.rate = 0.8;
      
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      utterance.onend = () => {
        setIsPlaying(false);
      };
    }
  };

  const handleAnswer = async (selectedOption) => {
    if (selectedOption.arabicNumeral === currentQuestion.arabicNumeral) {
      setFeedback({ type: 'success', message: 'إجابة صحيحة! 🎉' });
      
      if (!hasAwarded && user) {
        try {
          const token = localStorage.getItem("token");
          
          // Save activity to MongoDB
          await axios.post(
            "http://localhost:5000/math-numbers-activity",
            {
              question: currentQuestion,
              selectedAnswer: selectedOption,
              isCorrect: true
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          // Update user state
          dispatch(setUserFromToken(token));
          setHasAwarded(true);
        } catch (error) {
          console.error("Error saving activity:", error);
        }
      }
    } else {
      setFeedback({ type: 'danger', message: 'إجابة خاطئة! حاول مرة أخرى ❌' });
      
      if (user) {
        try {
          const token = localStorage.getItem("token");
          
          // Save incorrect answer to MongoDB
          await axios.post(
            "http://localhost:5000/math-numbers-activity",
            {
              question: currentQuestion,
              selectedAnswer: selectedOption,
              isCorrect: false
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Error saving activity:", error);
        }
      }
    }
    
    setTimeout(() => {
      generateQuestion();
    }, 1500);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-start mb-4">
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

      <h2 className="mb-4 text-primary text-center">🎮 نشاط العد</h2>
      
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow mb-4">
            <CardBody className="text-center">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <h3 className="mb-0">كم عدد الأشياء في الصورة؟</h3>
                <Button
                  color="link"
                  className="p-0"
                  onClick={speakQuestion}
                  disabled={isPlaying}
                  style={{ color: 'var(--bs-primary)' }}
                >
                  <FaVolumeUp size={20} />
                </Button>
              </div>
              <div 
                className="mb-4 display-4"
                style={{ 
                  letterSpacing: '10px',
                  lineHeight: '1.5'
                }}
              >
                {currentQuestion?.image}
              </div>
            </CardBody>
          </Card>

          {feedback && (
            <Alert color={feedback.type} className="text-center">
              {feedback.message}
            </Alert>
          )}

          <Row className="g-3">
            {options.map((option, index) => (
              <Col key={index} xs={6}>
                <Button
                  color="light"
                  className="w-100 p-3 h-100"
                  style={{ 
                    border: '2px solid var(--bs-light)',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: `var(--bs-${option.color})`
                  }}
                  onClick={() => handleAnswer(option)}
                  disabled={isPlaying}
                >
                  {option.arabicNumeral}
                </Button>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button
          color="primary"
          size="lg"
          className="px-5"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="me-2" />
          العودة
        </Button>
      </div>
    </Container>
  );
}

export default MathNumbersActivity; 