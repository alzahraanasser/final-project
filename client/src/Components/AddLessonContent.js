import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Card, CardBody } from "reactstrap";

const AddLessonContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(""); // هنا نخزن base64
  const [description, setDescription] = useState("");
  const [letterWithTashkeel, setLetterWithTashkeel] = useState("");

  useEffect(() => {
    const existingContent = localStorage.getItem(`lessonContent_${id}`);
    if (existingContent) {
      const content = JSON.parse(existingContent);
      setImage(content.image || "");
      setDescription(content.description || "");
      setLetterWithTashkeel(content.letterWithTashkeel || "");
    }
  }, [id]);

  // تحويل الصورة إلى base64 وحفظها
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

    const newContent = {
      image,
      description,
      letterWithTashkeel,
    };

    localStorage.setItem(`lessonContent_${id}`, JSON.stringify(newContent));

    navigate("/arabiclesson");
  };

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف محتوى هذا الدرس؟")) {
      localStorage.removeItem(`lessonContent_${id}`);
      navigate("/arabiclesson");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">إضافة / تعديل محتوى للدرس</h1>

      <Form onSubmit={handleSave}>
        {/* اختيار الصورة */}
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>اختيار صورة من جهازك</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {/* عرض الصورة المصغرة */}
              {image && (
                <img
                  src={image}
                  alt="معاينة"
                  style={{ marginTop: 10, maxWidth: "100%", height: "auto", borderRadius: 5 }}
                />
              )}
            </FormGroup>
          </CardBody>
        </Card>

        {/* وصف الحرف */}
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>وصف الحرف</Label>
              <Input
                type="textarea"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصف الحرف هنا"
              />
            </FormGroup>
          </CardBody>
        </Card>

        {/* الحرف مع الحركات */}
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>الحرف مع الحركات</Label>
              <Input
                type="text"
                value={letterWithTashkeel || ""}
                onChange={(e) => setLetterWithTashkeel(e.target.value)}
                placeholder="مثال: بَ - بِ - بُ"
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

export default AddLessonContent;
