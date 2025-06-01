import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "reactstrap";
import lessonData from "../lessonData";

const Lessons = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const baseLessons = lessonData;
    const savedLessons = JSON.parse(localStorage.getItem("englishLessons")) || [];

    const newLessons = savedLessons.filter(
      (newL) => !baseLessons.some((baseL) => baseL.letter === newL.letter)
    );

    setLessons([...baseLessons, ...newLessons]);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const savedLessons = JSON.parse(localStorage.getItem("englishLessons")) || [];
      const updatedLessons = savedLessons.filter((lesson) => lesson.id !== id);
      localStorage.setItem("englishLessons", JSON.stringify(updatedLessons));

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
          title="Back to Home"
          aria-label="Go back"
        >
          <FaArrowLeft size={24} />
        </Button>
      </div>

      <h1 className="text-4xl font-bold text-gray-800 mb-10">English Lessons</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 flex flex-col justify-center items-center text-center relative"
          >
            <div
              onClick={() => navigate(`/viewlessoncontentenglish/${lesson.id}`)}
              className="cursor-pointer w-full"
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  navigate(`/lesson/${lesson.id}`, { state: { lesson } });
                }
              }}
              aria-label={`Lesson ${lesson.title}`}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h2>
              <p className="text-6xl font-bold text-gray-800">{lesson.letter}</p>
            </div>

            {!lessonData.some((baseL) => baseL.id === lesson.id) && (
              <Button
                color="danger"
                size="sm"
                className="mt-4"
                onClick={() => handleDelete(lesson.id)}
                aria-label={`Delete lesson ${lesson.title}`}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Button
          color="primary"
          className="px-6 py-3 text-lg"
          onClick={() => navigate("/addlessonenglish")}
        >
          Add Lesson
        </Button>
      </div>
    </div>
  );
};

export default Lessons;
