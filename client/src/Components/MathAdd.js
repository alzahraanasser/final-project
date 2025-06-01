import React, { useState } from 'react';
import { Container, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import Add from "../Images/add.png"
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaMicrophone } from "react-icons/fa";
import { useSelector } from 'react-redux';

function MathAdd() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const [modal, setModal] = useState(false);
  const [updatedContent, setUpdatedContent] = useState({
    title: 'الجمع',
    description: 'عند جمع رقمين، نضعهم معًا لنحسبَ المجموع.',
    example: '٢ + ٣ = ٥'
  });

  const toggleModal = () => setModal(!modal);

  const handleUpdate = () => {
    toggleModal();
  };

  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      navigate('/mathlesson');
    }
  };

  const handleSaveUpdate = () => {
    // Here you would typically make an API call to update the lesson
    toggleModal();
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
      <h2 className="text-success mb-4">➕ الجمع</h2>
      <Card className="shadow p-3">
        <CardBody>
          <img
            src={Add}
            alt="جمع"
            className="img-fluid mb-4"
            style={{ maxWidth: "300px" }}
          />
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
            >
              <FaMicrophone size={24} />
            </button>
            <p style={{ fontSize: '1.2rem' }}>{updatedContent.description}</p>
          </div>
          <div className="mt-4 d-flex justify-content-center gap-3">
            <Button color="primary" onClick={() => navigate("/mathaddexercise")}>ابدأ التمرين</Button>
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
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>تحديث درس الجمع</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">عنوان الدرس</Label>
              <Input
                type="text"
                id="title"
                value={updatedContent.title}
                onChange={(e) => setUpdatedContent({...updatedContent, title: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">وصف الدرس</Label>
              <Input
                type="textarea"
                id="description"
                value={updatedContent.description}
                onChange={(e) => setUpdatedContent({...updatedContent, description: e.target.value})}
              />
            </FormGroup>
            <FormGroup>
              <Label for="example">المثال</Label>
              <Input
                type="text"
                id="example"
                value={updatedContent.example}
                onChange={(e) => setUpdatedContent({...updatedContent, example: e.target.value})}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveUpdate}>
            حفظ
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            إلغاء
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default MathAdd;
