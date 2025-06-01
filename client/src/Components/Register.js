import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../Features/UserSlice";
import back1 from "../Images/back1.jpg"; // Corrected import
import { Container } from "reactstrap";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Change state.auth to state.users
  const { isLogin, error } = useSelector((state) => state.users);

  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    // If the user is already logged in, navigate to home
    if (isLogin) {
      navigate("/");
    } else {
      navigate("/register");
    }
  }, [isLogin, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
    // Navigate to login page after successful registration
    navigate("/login");
  };

  return (
    <div 
      className="register-container" 
      style={{
        backgroundImage: `url(${back1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container 
        fluid 
        className="p-6 rounded shadow" 
        style={{ maxWidth: "500px", background: "rgba(255, 255, 255, 0.8)", padding: "20px" }}
      >
        <form className="div-form w-100" onSubmit={handleSubmit(onSubmit)}>
          <div className="appTitle">
            <h1 className="text-center">Register</h1>
          </div>

          {/* Display error message if there is any */}
          {error && <p className="error" style={{ color: "red", textAlign: "center" }}>{error}</p>}
          
          <div className="form-group">
            <h6>Name</h6>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter name..."
              {...register("name")}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <p className="error" style={{ color: "red" }}>{errors.name?.message}</p>
          </div>

          <div className="form-group">
            <h6>Email</h6>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email..."
              {...register("email")}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <p className="error" style={{ color: "red" }}>{errors.email?.message}</p>
          </div>

          <div className="form-group">
            <h6>Password</h6>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password..."
              {...register("password")}
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "15px",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <p className="error" style={{ color: "red" }}>{errors.password?.message}</p>
          </div>

          <button
            type="submit"
            className="button"
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#111184",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Register
          </button>

          <p className="hhh" style={{ textAlign: "center" }}>
            Already a Member? <a href="/login" style={{ color: "#111184" }}>Login</a>
          </p>
        </form>
      </Container>
    </div>
  );
};

export default Register;