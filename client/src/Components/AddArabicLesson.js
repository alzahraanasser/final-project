import React, { useState, useEffect } from "react";
import { Button, Container, Alert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addArabicLesson, getArabicLessons } from "../Features/ArabicLessonSlice";

const AddArabicLesson = () => {
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonCode, setLessonCode] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lessons, status, error } = useSelector((state) => state.arabicLessons);
  const { isLogin } = useSelector((state) => state.users);

  useEffect(() => {
    if (!isLogin) {
      navigate("/login");
    } else {
      // جلب الدروس من السيرفر عند أول تحميل
      dispatch(getArabicLessons());
    }
  }, [isLogin, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!lessonTitle || !lessonCode) {
      setMessage({ type: "error", text: "الرجاء إدخال اسم وكود الدرس." });
      return;
    }

    const isDuplicate = lessons.some(
      (lesson) =>
        lesson.lessonTitle.toLowerCase() === lessonTitle.toLowerCase() ||
        lesson.lessonCode.toLowerCase() === lessonCode.toLowerCase()
    );

    if (isDuplicate) {
      setMessage({
        type: "error",
        text: "يوجد درس بنفس الاسم أو الكود مسبقاً.",
      });
      return;
    }

    try {
      await dispatch(addArabicLesson({ lessonTitle, lessonCode })).unwrap();
      setMessage({ type: "success", text: "تمت إضافة الدرس بنجاح!" });
      setLessonTitle("");
      setLessonCode("");

      setTimeout(() => navigate("/arabiclessons"), 1000);
    } catch (error) {
      setMessage({ type: "error", text: "حدث خطأ أثناء الإضافة." });
    }
  };

  return (
    <div className="main-container">
      <Container className="mt-5">
        <h1 className="text-center">إضافة درس عربي</h1>

        {message && (
          <Alert color={message.type === "error" ? "danger" : "success"}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="اسم الدرس"
            value={lessonTitle}
            onChange={(e) => setLessonTitle(e.target.value)}
            className="form-control mb-3"
          />
          <input
            type="text"
            placeholder="كود الدرس"
            value={lessonCode}
            onChange={(e) => setLessonCode(e.target.value)}
            className="form-control mb-3"
          />
          <Button type="submit" color="primary" className="w-100" disabled={status === "loading"}>
            {status === "loading" ? "جاري الإضافة..." : "إضافة درس"}
          </Button>
        </form>

        {error && <Alert color="danger" className="mt-3">{error}</Alert>}
      </Container>
    </div>
  );
};

export default AddArabicLesson;
