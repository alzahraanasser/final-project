import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';

function MathLesson() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const [modal, setModal] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    icon: '',
    color: 'primary',
    route: ''
  });

  const defaultOperations = [
    {
      title: 'الأرقام',
      icon: '🔢',
      color: 'info',
      route: '/mathnumbers'
    },
    {
      title: 'الجمع',
      icon: '➕',
      color: 'primary',
      route: '/mathadd'
    },
    {
      title: 'الطرح',
      icon: '➖',
      color: 'danger',
      route: '/mathsubtract'
    },
    {
      title: 'الضرب',
      icon: '✖️',
      color: 'warning',
      route: '/mathmultiply'
    },
    {
      title: 'القسمة',
      icon: '➗',
      color: 'success',
      route: '/mathdivide'
    }
  ];

  const [operations, setOperations] = useState(defaultOperations);

  const colorOptions = [
    { value: 'primary', label: 'أزرق' },
    { value: 'success', label: 'أخضر' },
    { value: 'danger', label: 'أحمر' },
    { value: 'warning', label: 'أصفر' },
    { value: 'info', label: 'أزرق فاتح' }
  ];

  const toggleModal = () => {
    setModal(!modal);
    if (!modal) {
      setFormData({
        title: '',
        icon: '',
        color: 'primary',
        route: ''
      });
      setSelectedOperation(null);
    }
  };

  const handleUpdate = (operation) => {
    setSelectedOperation(operation);
    setFormData({
      title: operation.title,
      icon: operation.icon,
      color: operation.color,
      route: operation.route
    });
    toggleModal();
  };

  const handleCreate = () => {
    setSelectedOperation(null);
    setFormData({
      title: '',
      icon: '',
      color: 'primary',
      route: ''
    });
    toggleModal();
  };

  const handleDelete = async (operation) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
      setOperations(operations.filter(op => op.title !== operation.title));
    }
  };

  const handleSave = async () => {
    try {
      if (selectedOperation) {
        // Update existing lesson
        setOperations(operations.map(op => 
          op.title === selectedOperation.title 
            ? { ...op, ...formData }
            : op
        ));
      } else {
        // Create new lesson
        setOperations([...operations, formData]);
      }
      toggleModal();
    } catch (error) {
      console.error('Error saving lesson:', error);
      alert('حدث خطأ أثناء حفظ الدرس');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
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
        
        {user?.role === "teacher" && (
          <Button
            color="success"
            onClick={handleCreate}
            className="d-flex align-items-center gap-2"
          >
            <FaPlus /> إضافة درس جديد
          </Button>
        )}
      </div>
      
      <h2 className="mb-4 text-primary text-center">🧮 العمليات الحسابية</h2>
      <Row className="justify-content-center g-4">
        {operations.map((op, index) => (
          <Col key={index} xs={12} md={6} lg={3}>
            <Card className="shadow-sm h-100">
              <CardBody className="d-flex flex-column align-items-center justify-content-center">
                <div style={{ fontSize: '3rem' }}>{op.icon}</div>
                <h4 className="mt-3">{op.title}</h4>
                <div className="mt-3 d-flex gap-2">
                  <Button
                    color={op.color}
                    className="px-4 py-2"
                    onClick={() => navigate(op.route)}
                  >
                    Start
                  </Button>
                  {user?.role === "teacher" && (
                    <>
                      <Button
                        color="info"
                        className="px-3 py-2"
                        onClick={() => handleUpdate(op)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        color="danger"
                        className="px-3 py-2"
                        onClick={() => handleDelete(op)}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal isOpen={modal} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          {selectedOperation ? 'تحديث الدرس' : 'إضافة درس جديد'}
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">عنوان الدرس</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="icon">الأيقونة (رموز تعبيرية)</Label>
              <Input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="color">اللون</Label>
              <Input
                type="select"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
              >
                {colorOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="route">مسار الدرس</Label>
              <Input
                type="text"
                id="route"
                name="route"
                value={formData.route}
                onChange={handleInputChange}
                required
                placeholder="/mathnumbers"
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSave}>
            {selectedOperation ? 'تحديث' : 'إضافة'}
          </Button>
          <Button color="secondary" onClick={toggleModal}>
            إلغاء
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default MathLesson;
