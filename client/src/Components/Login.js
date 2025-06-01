import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../Features/UserSlice";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
import logo from "../Images/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "فشل تسجيل الدخول");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-end">
        <Col xs="auto">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "150px",
              height: "80px",
              marginBottom: "20px"
            }}
          />
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="6">
          <div className="div-form1">
            <h2 className="text-center mb-4">تسجيل الدخول</h2>
            {error && (
              <Alert
                color="danger"
                isOpen={!!error}
                toggle={() => setError("")}
                fade={true}
              >
                {error}
              </Alert>
            )}
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">كلمة المرور</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </FormGroup>
              <Button color="primary" type="submit" className="w-100 mt-3">
                تسجيل الدخول
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
