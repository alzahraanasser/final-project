import React, { useState } from 'react';
import {
  Container,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Multiply from "../Images/multiply.jpg";
import VideoThumb from "../Images/multiply-video-thumb.jpg";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaMicrophone } from "react-icons/fa";
import { useSelector } from 'react-redux';

function MathMultiply() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);

  const [modal, setModal] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [updatedContent, setUpdatedContent] = useState({
    title: 'الضرب',
    description: 'الضرب هو جمع متكرر، أي ٢ + ٢ + ٢ = ٦.',
    example: '٢ × ٣ = ٦',
    videoUrl: 'https://www.youtube.com/watch?v=PjWVYQLPU_U'
  });

  const toggleModal = () => setModal(!modal);
  const toggleVideoModal = () => setVideoModalOpen(!videoModalOpen);

  const handleUpdate = () => {
    toggleModal();
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      navigate('/mathlesson');
    }
  };

  const handleSaveUpdate = () => {
    toggleModal();
  };

  // تحويل رابط يوتيوب للصيغة embed
  const getEmbedUrl = (url) => {
    if (!url) return '';

    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes('youtube.com/embed')) {
      return url;
    }

    return '';
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
      <h2 className="text-warning mb-4">✖️ الضرب</h2>
      <Card className="shadow p-3">
        <CardBody>
          <img src={Multiply} alt="ضرب" className="img-fluid mb-4" style={{ maxWidth: "300px" }} />
          <div className="mt-4 d-flex flex-column align-items-center gap-3">
            <h4 className="mb-3">{updatedContent.example}</h4>
            <button
              onClick={() => {
                const utterance = new window.SpeechSynthesisUtterance(updatedContent.description);
                utterance.lang = "ar-SA";
                window.speechSynthesis.speak(utterance);
              }}
              style={{
                padding: "8px",
                backgroundColor: "transparent",
                color: "black",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center"
              }}
              aria-label="تشغيل الصوت"
            >
              <FaMicrophone size={24} />
            </button>
            <p style={{ fontSize: '1.2rem' }}>{updatedContent.description}</p>
            <Button color="warning" onClick={() => navigate("/mathmultiplyexercise")}>ابدأ التمرين</Button>
            {user?.role === "teacher" && (
              <>
                <Button color="info" onClick={handleUpdate}>
                  <FaEdit />
                </Button>
                <Button color="danger" onClick={handleDelete}>
                  <FaTrash />
                </Button>
              </>
            )}
            <img
              src={VideoThumb}
              alt="اضغط لمشاهدة الفيديو"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "500px", cursor: "pointer" }}
              onClick={toggleVideoModal}
            />
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>تحديث درس الضرب</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">عنوان الدرس</Label>
              <Input
                type="text"
                id="title"
                value={updatedContent.title}
                onChange={(e) => setUpdatedContent({ ...updatedContent, title: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">وصف الدرس</Label>
              <Input
                type="textarea"
                id="description"
                value={updatedContent.description}
                onChange={(e) => setUpdatedContent({ ...updatedContent, description: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="example">المثال</Label>
              <Input
                type="text"
                id="example"
                value={updatedContent.example}
                onChange={(e) => setUpdatedContent({ ...updatedContent, example: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="videoUrl">رابط الفيديو</Label>
              <Input
                type="text"
                id="videoUrl"
                value={updatedContent.videoUrl}
                onChange={(e) => setUpdatedContent({ ...updatedContent, videoUrl: e.target.value })}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveUpdate}>حفظ</Button>
          <Button color="secondary" onClick={toggleModal}>إلغاء</Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={videoModalOpen} toggle={toggleVideoModal} size="lg" centered>
        <ModalHeader toggle={toggleVideoModal}>فيديو الدرس</ModalHeader>
        <ModalBody className="p-0">
          <div className="video-responsive">
            <iframe
              width="100%"
              height="400"
              src={getEmbedUrl(updatedContent.videoUrl)}
              title="Video Lesson"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </ModalBody>
      </Modal>

      <style>{`
        .video-responsive {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 */
          padding-top: 25px;
          height: 0;
        }
        .video-responsive iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </Container>
  );
}

export default MathMultiply;
