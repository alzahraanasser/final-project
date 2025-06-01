import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Container } from "reactstrap";

const ResetPassword = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/reset-password", { email: data.email });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No account found with this email. Please check your email and try again.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
      setMessage("");
    }
  };

  return (
    <Container className="mt-5">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email..."
            {...register("email", { required: "Email is required" })}
          />
          <p className="error" style={{ color: "red" }}>{errors.email?.message}</p>
        </div>
        <button type="submit" className="btn btn-primary">Request Reset Link</button>
      </form>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Container>
  );
};

export default ResetPassword; 