import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "reactstrap";
import LetterData from "../LetterData";

const ArabicLesson = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    // عرفنا baseLessons هنا داخل useEffect عشان ESLint ما يعطي تحذير
    const baseLessons = LetterData;

    const savedLetters = JSON.parse(localStorage.getItem("arabicLetters")) || [];

    const newLetters = savedLetters.filter(
      (newL) => !baseLessons.some((baseL) => baseL.letter === newL.letter)
    );

    setLessons([...baseLessons, ...newLetters]);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الحرف؟")) {
      const savedLetters = JSON.parse(localStorage.getItem("arabicLetters")) || [];
      const updatedLetters = savedLetters.filter((lesson) => lesson.id !== id);
      localStorage.setItem("arabicLetters", JSON.stringify(updatedLetters));

      setLessons((prevLessons) => prevLessons.filter((lesson) => lesson.id !== id));
    }
  };

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

      <h1 className="text-4xl font-bold text-gray-800 mb-10">الحروف العربية</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col justify-center items-center text-center relative"
          >
            <div
              onClick={() => navigate(`/viewlessoncontent/${lesson.id}`)}
              className="cursor-pointer w-full"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigate(`/arabic/${lesson.id}`, { state: { lesson } });
                }
              }}
              aria-label={`حرف ${lesson.title}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                حرف {lesson.letter}
              </h2>
              <p className="text-6xl font-bold text-gray-800">{lesson.letter}</p>
            </div>

            {!LetterData.some((baseL) => baseL.id === lesson.id) && (
              <Button
                color="danger"
                size="sm"
                className="mt-4"
                onClick={() => handleDelete(lesson.id)}
                aria-label={`حذف حرف ${lesson.title}`}
              >
                حذف
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button
          color="primary"
          className="px-6 py-3 text-lg"
          onClick={() => navigate("/addletter")}
        >
          إضافة حرف
        </Button>
      </div>
    </div>
  );
};

export default ArabicLesson;
