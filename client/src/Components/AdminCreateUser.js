import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, Form, FormGroup, Input, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminCreateUser = () => {
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'student' });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/admin/createUser', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('User created successfully!');
      setError("");
      setNewUser({ name: '', email: '', password: '', role: 'student' });
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create user');
      setMessage("");
    }
  };

  return (
    <div className="d-flex flex-column" style={{ minHeight: '80vh', background: '#b3d9e6' }}>
      {/* Back Arrow Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '16px 0 0 16px' }}>
        <Button 
            color="link" 
            style={{ color: 'black', padding: 0 }} 
            onClick={() => navigate('/') }
            title="Go back"
            aria-label="Go back"
            >
          <FaArrowLeft size={24} />
        </Button>
      </div>
      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <Card style={{ minWidth: 400, maxWidth: 600, width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
          <CardBody>
            <h2 className="mb-4" style={{ fontWeight: 700 }}>Create New User</h2>
            {message && (
              <div className="alert alert-success" role="alert">
                {message}
              </div>
            )}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <Form className="d-flex flex-column gap-3" onSubmit={handleCreateUser}>
              <FormGroup>
                <Input
                  type="text"
                  placeholder="Name"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Input
                  type="select"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                  required
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </Input>
              </FormGroup>
              <Button color="primary" type="submit">
                Create User
              </Button>
            </Form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminCreateUser;
