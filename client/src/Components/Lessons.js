import React, { useEffect, useState } from "react";
import { Spinner, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import lessonData from "../lessonData";

const EnglishLessonsStudent = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    try {
      const baseLessons = lessonData;
      const savedLessons = JSON.parse(localStorage.getItem("englishLessons")) || [];

      // نضيف الدروس الجديدة فقط لو ما موجودة ضمن الدروس الأساسية
      const newLessons = savedLessons.filter(
        (newL) => !baseLessons.some((baseL) => baseL.letter === newL.letter)
      );

      const combinedLessons = [...baseLessons, ...newLessons];
      setLessons(combinedLessons);
      setStatus("succeeded");
    } catch (err) {
      setStatus("failed");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="mt-20 flex justify-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mt-20 text-center text-red-500 text-lg">
        حدث خطأ أثناء تحميل الدروس.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-center">
      <div className="text-left mb-6">
        <Button
          color="link"
          style={{ color: "black", padding: 0 }}
          onClick={() => navigate("/")}
          title="عودة للصفحة الرئيسية"
          aria-label="Go back"
        >
          <FaArrowLeft size={24} />
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-10">الدروس الإنجليزية</h1>

      {lessons.length === 0 ? (
        <p className="text-gray-500">لا توجد دروس متاحة.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col justify-center items-center text-center"
              onClick={() => navigate(`/viewlessoncontentenglish/${lesson.id}`)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigate(`/viewlessoncontentenglish/${lesson.id}`);
                }
              }}
              aria-label={`Lesson ${lesson.title}`}
              style={{ cursor: "pointer" }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h2>
              <p className="text-6xl font-bold text-gray-800">{lesson.letter}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnglishLessonsStudent;
