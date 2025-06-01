import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Card, CardBody } from "reactstrap";

const AddLessonContentEnglish = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(""); // base64 image
  const [description, setDescription] = useState("");
  const [exampleWord, setExampleWord] = useState("");

  useEffect(() => {
    const existingContent = localStorage.getItem(`lessonContentEnglish_${id}`);
    if (existingContent) {
      const content = JSON.parse(existingContent);
      setImage(content.image || "");
      setDescription(content.description || "");
      setExampleWord(content.exampleWord || "");
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

    const newContent = {
      image,
      description,
      exampleWord,
    };

    localStorage.setItem(`lessonContentEnglish_${id}`, JSON.stringify(newContent));

    navigate("/englishlessons");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this lesson's content?")) {
      localStorage.removeItem(`lessonContentEnglish_${id}`);
      navigate("/englishlesson");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add / Edit Lesson Content</h1>

      <Form onSubmit={handleSave}>
        {/* Image Selection */}
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>Select Image from your device</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
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

        {/* Letter Description */}
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>Letter Description</Label>
              <Input
                type="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a description for the letter"
              />
            </FormGroup>
          </CardBody>
        </Card>

        {/* Example Word */}
        <Card className="mb-4">
          <CardBody>
            <FormGroup>
              <Label>Example Word</Label>
              <Input
                type="text"
                value={exampleWord}
                onChange={(e) => setExampleWord(e.target.value)}
                placeholder="Example: Apple"
              />
            </FormGroup>
          </CardBody>
        </Card>

        <Button color="primary" block type="submit">
          Save Content
        </Button>

        {localStorage.getItem(`lessonContentEnglish_${id}`) && (
          <Button color="danger" block className="mt-3" onClick={handleDelete}>
            Delete Content
          </Button>
        )}
      </Form>
    </div>
  );
};

export default AddLessonContentEnglish;
