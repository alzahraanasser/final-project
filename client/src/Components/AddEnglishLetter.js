import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const AddEnglishLetter = () => {
  const [title, setTitle] = useState("");
  const [letter, setLetter] = useState("");
  const navigate = useNavigate();

  const handleAddLetter = (e) => {
    e.preventDefault();

    const newLetter = {
      id: Date.now(),
      title,
      letter,
    };

    // قراءة الموجود من localStorage
    const savedLetters = JSON.parse(localStorage.getItem("englishLessons")) || [];

    // إضافة الجديد
    const updatedLetters = [...savedLetters, newLetter];

    // حفظ في localStorage
    localStorage.setItem("englishLessons", JSON.stringify(updatedLetters));

    // الانتقال إلى صفحة محتوى الدرس الخاص بالإنجليزي
    navigate(`/addlessoncontentenglish/${newLetter.id}`);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Letter</h1>
      <Form onSubmit={handleAddLetter}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>Letter</Label>
          <Input
            type="text"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" block>
          Add
        </Button>
      </Form>
    </div>
  );
};

export default AddEnglishLetter;
