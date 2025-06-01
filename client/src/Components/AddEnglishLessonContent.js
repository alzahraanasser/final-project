import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Card, CardBody } from "reactstrap";

const AddEnglishLessonContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [letter, setLetter] = useState("");

  useEffect(() => {
    const existingContent = localStorage.getItem(`lessonContent_${id}`);
    if (existingContent) {
      const content = JSON.parse(existingContent);
      setImage(content.image || "");
      setDescription(content.description || "");
      setLetter(content.letter || "");
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result.toString());
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    // بناء كائن الدرس الجديد
    const newContent = {
      id, // مهم جداً
      title: letter || `درس ${id}`, // عنوان الدرس، يمكن تخصيصه
      image,
      description,
      letter,
    };

    // حفظ محتوى الدرس بالتفصيل في lessonContent_id
    localStorage.setItem(`lessonContent_${id}`, JSON.stringify(newContent));

    // تحديث أو إضافة الدرس في قائمة customLessons
    const savedLessons = JSON.parse(localStorage.getItem("customLessons")) || [];

    const lessonExists = savedLessons.some((lesson) => lesson.id === id);

    if (!lessonExists) {
      savedLessons.push(newContent);
      localStorage.setItem("customLessons", JSON.stringify(savedLessons));
    } else {
      const updatedLessons = savedLessons.map((lesson) =>
        lesson.id === id ? newContent : lesson
      );
      localStorage.setItem("customLessons", JSON.stringify(updatedLessons));
    }

    // العودة لقائمة الدروس
    navigate("/englishlessont");

  };

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف محتوى هذا الدرس؟")) {
      // حذف المحتوى المفصل
      localStorage.removeItem(`lessonContent_${id}`);

      // حذف الدرس من customLessons
      const savedLessons = JSON.parse(localStorage.getItem("customLessons")) || [];
      const updatedLessons = savedLessons.filter((lesson) => lesson.id !== id);
      localStorage.setItem("customLessons", JSON.stringify(updatedLessons));

      navigate("/lessons");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">إضافة / تعديل محتوى درس اللغة الإنجليزية</h1>

      <Form onSubmit={handleSave}>
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>اختر صورة</Label>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  style={{ marginTop: 10, maxWidth: "100%", height: "auto", borderRadius: 5 }}
                />
              )}
            </FormGroup>
          </CardBody>
        </Card>

        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>وصف الدرس</Label>
              <Input
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أدخل وصف الدرس هنا"
              />
            </FormGroup>
          </CardBody>
        </Card>

        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>الحرف</Label>
              <Input
                type="text"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder="مثال: A, B, C"
              />
            </FormGroup>
          </CardBody>
        </Card>

        <Button color="primary" block type="submit">
          حفظ المحتوى
        </Button>

        {localStorage.getItem(`lessonContent_${id}`) && (
          <Button color="danger" block className="mt-3" onClick={handleDelete}>
            حذف المحتوى
          </Button>
        )}
      </Form>
    </div>
  );
};

export default AddEnglishLessonContent;
