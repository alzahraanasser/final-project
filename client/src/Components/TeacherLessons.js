import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from 'reactstrap';

const TeacherLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: ''
  });

  // Fetch teacher's lessons
  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/teacher/lessons", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(response.data);
      setLoading(false);
      console.log('Fetched lessons data:', response.data);
    } catch (err) {
      setError("Failed to fetch lessons");
      setLoading(false);
      console.error('Error fetching lessons:', err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Open modal for creating/editing lesson
  const openModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        description: '',
        content: ''
      });
    }
    setModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit lesson (create or update)
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (editingLesson) {
        // Update existing lesson
        await axios.put(
          `http://localhost:5000/lesson/${editingLesson._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new lesson
        await axios.post(
          "http://localhost:5000/lesson",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setModalOpen(false);
      fetchLessons();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save lesson");
    }
  };

  // Delete lesson
  const handleDelete = async (lessonId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/lesson/${lessonId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLessons();
      } catch (err) {
        setError("Failed to delete lesson");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Lessons</h2>
        <button
          onClick={() => openModal()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create New Lesson
        </button>
      </div>

      {lessons.length === 0 ? (
        <p>No lessons created yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {lessons.map((lesson) => (
            <div
              key={lesson._id}
              style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{lesson.title}</h3>
              <p style={{ color: '#666', marginBottom: '10px' }}>{lesson.description}</p>
              <div style={{ marginBottom: '15px' }}>
                <strong>Content:</strong>
                <p style={{ whiteSpace: 'pre-wrap' }}>{lesson.content}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => openModal(lesson)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(lesson._id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Lesson Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="content">Content</Label>
            <Input
              type="textarea"
              name="content"
              id="content"
              value={formData.content}
              onChange={handleInputChange}
              style={{ minHeight: '200px' }}
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            {editingLesson ? 'Update' : 'Create'}
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default TeacherLessons; 