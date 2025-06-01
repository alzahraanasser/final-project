import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { FaArrowLeft } from "react-icons/fa";

const EditLessonContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState({
    image: "",
    description: "",
    letterWithTashkeel: "",
  });

  const [message, setMessage] = useState(null);

  useEffect(() => {
    const savedContent = localStorage.getItem(`lessonContent_${id}`);
    if (savedContent) {
      setContent(JSON.parse(savedContent));
    } else {
      setMessage({ type: "danger", text: "لا يوجد محتوى لتعديله." });
    }
  }, [id]);

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // تحقق بسيط
    if (!content.description.trim() || !content.letterWithTashkeel.trim()) {
      setMessage({ type: "danger", text: "الرجاء تعبئة جميع الحقول المطلوبة." });
      return;
    }
    // تحديث المحتوى في localStorage
    localStorage.setItem(`lessonContent_${id}`, JSON.stringify(content));
    setMessage({ type: "success", text: "تم تحديث المحتوى بنجاح." });

    // الرجوع بعد ثانيتين
    setTimeout(() => {
      navigate(`/viewlessoncontent/${id}`);
    }, 2000);
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
        <Button
          color="link"
          style={{ padding: 0, color: "black" }}
          onClick={() => navigate(-1)}
          title="عودة"
          aria-label="عودة"
        >
          <FaArrowLeft size={24} />
        </Button>
      </div>

      <h2 className="mb-4 text-center">تعديل محتوى الدرس</h2>

      {message && (
        <Alert color={message.type === "danger" ? "danger" : "success"}>{message.text}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="image">رابط الصورة (اختياري)</Label>
          <Input
            type="text"
            id="image"
            name="image"
            placeholder="أدخل رابط الصورة"
            value={content.image}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label for="description">الوصف</Label>
          <Input
            type="textarea"
            id="description"
            name="description"
            rows="4"
            placeholder="أدخل وصف الدرس"
            value={content.description}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label for="letterWithTashkeel">الحرف مع التشكيل</Label>
          <Input
            type="text"
            id="letterWithTashkeel"
            name="letterWithTashkeel"
            placeholder="أدخل الحرف مع التشكيل"
            value={content.letterWithTashkeel}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button color="primary" type="submit">
            حفظ التعديلات
          </Button>
          <Button color="secondary" onClick={() => navigate(-1)}>
            إلغاء
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditLessonContent;
