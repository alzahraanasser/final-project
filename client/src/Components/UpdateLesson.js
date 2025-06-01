import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { updateLesson } from "../Features/LessonSlice";

const UpdateLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessonTitle, setLessonTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();
  const lessons = useSelector((state) => state.lessons?.lessons || []);

  useEffect(() => {
    const lesson = lessons.find((item) => item.id === parseInt(id));
    if (lesson) {
      setLessonTitle(lesson.lessonTitle);
      setDescription(lesson.description);
      setImage2(lesson.image2);
      setImage3(lesson.image3);
    } else {
      setMessage({ type: "error", text: "Unavailable Lesson" });
    }
  }, [id, lessons]);

  // Auto-dismiss message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lessonTitle || !description || !image2 || !image3) {
      setMessage({ type: "error", text: "All details needed." });
      return;
    }

    try {
      await dispatch(
        updateLesson({
          id: parseInt(id),
          lessonTitle,
          description,
          image2,
          image3,
        })
      );
      setMessage({ type: "success", text: "Updated lesson successfully!" });
      navigate(`/lesson/${id}`);
    } catch (error) {
      setMessage({ type: "error", text: "Wrong in update lesson. Try again" });
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#B8E3E9" }}
    >
      <Container
        className="p-4 shadow rounded-3 text-dark"
        style={{ maxWidth: "480px", backgroundColor: "#fff" }}
      >
        <h2 className="text-center mb-4" style={{ fontSize: "1.8rem", fontWeight: "600" }}>
          Update Lesson
        </h2>

        {message && (
          <Alert color={message.type === "error" ? "danger" : "success"} className="text-center">
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}
            />
          </FormGroup>

          <FormGroup>
            <Label for="image2">Image 1</Label>
            <div style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}>
              {image2 && <p>Current Image 1: {image2.name || "File Selected"}</p>}
              <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage2)} />
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="image3">Image 2</Label>
            <div style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "4px" }}>
              {image3 && <p>Current Image 2: {image3.name || "File Selected"}</p>}
              <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setImage3)} />
            </div>
          </FormGroup>

          <div className="d-flex justify-content-center"> {/* تغيير هنا */}
            <Button
              type="submit"
              color="primary"
              style={{ marginRight: "10px", padding: "8px 20px" }}
            >
              Update Lesson
            </Button>
            <Button
              color="danger"
              onClick={() => navigate(`/lesson/${id}`)}
              style={{ padding: "8px 20px" }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
};

export default UpdateLesson;