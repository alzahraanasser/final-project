import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const EditEnglishLessonContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [letter, setLetter] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    // جلب محتوى الدرس الحالي من localStorage
    const savedContent = localStorage.getItem(`lessonContent_${id}`);
    if (savedContent) {
      const lesson = JSON.parse(savedContent);
      setTitle(lesson.description || "");
      setLetter(lesson.letter || "");
      setImage(lesson.image || "");
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContent = () => {
    if (!title || !letter) {
      alert("يجب إدخال عنوان والحرف.");
      return;
    }

    const updatedContent = {
      description: title,
      letter,
      image,
    };

    localStorage.setItem(`lessonContent_${id}`, JSON.stringify(updatedContent));

    // تحديث بيانات الدرس في customLessons بنفس الـ id
    const savedLessons = JSON.parse(localStorage.getItem("customLessons")) || [];

    const updatedLessons = savedLessons.map((lesson) =>
      lesson.id === id ? { ...lesson, title, image } : lesson
    );

    localStorage.setItem("customLessons", JSON.stringify(updatedLessons));

    navigate(`/viewenglishcontent/${id}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">تعديل درس إنجليزي</h1>

      <Form>
        <FormGroup>
          <Label for="lessonTitle">عنوان الدرس:</Label>
          <Input
            type="text"
            id="lessonTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="lessonLetter">الحرف:</Label>
          <Input
            type="text"
            id="lessonLetter"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label for="lessonImage">صورة الدرس (اختياري):</Label>
          <Input type="file" id="lessonImage" onChange={handleImageChange} />
          {image && (
            <img
              src={image}
              alt="lesson"
              className="mt-3 rounded"
              style={{ width: 80, height: 80 }}
            />
          )}
        </FormGroup>

        <Button color="primary" onClick={handleSaveContent}>
          حفظ التعديلات
        </Button>
      </Form>
    </div>
  );
};

export default EditEnglishLessonContent;
