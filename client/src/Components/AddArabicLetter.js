import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const AddArabicLetter = () => {
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

    // قراءة القديم من localStorage
    const savedLetters = JSON.parse(localStorage.getItem("arabicLetters")) || [];

    // إضافة الجديد
    const updatedLetters = [...savedLetters, newLetter];

    // حفظ الجديد في localStorage
    localStorage.setItem("arabicLetters", JSON.stringify(updatedLetters));

    // الرجوع للصفحة السابقة
    navigate(`/addlessoncontent/${newLetter.id}`);

  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">إضافة حرف جديد</h1>
      <Form onSubmit={handleAddLetter}>
        <FormGroup>
          <Label>عنوان الحرف</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label>الحرف</Label>
          <Input
            type="text"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" block>
          إضافة
        </Button>
      </Form>
    </div>
  );
};

export default AddArabicLetter;
