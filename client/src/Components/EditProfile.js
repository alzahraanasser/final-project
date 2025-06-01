import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Container, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";



const EditProfile = () => {
  const user = useSelector((state) => state.users.user);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Update profile info (name and email)
      await axios.put(
        "http://localhost:5000/update-profile",
        { name, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If password fields are filled, update password
      if (oldPassword && newPassword && confirmNewPassword) {
        await axios.put(
          "http://localhost:5000/update-password",
          { oldPassword, newPassword, confirmNewPassword },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setMsg("✅ Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.msg || "❌ Failed to update profile. Please try again.");
    }
  };

  return (
    <Container>
      <div>
        <Button
          type="button"
          color="link"
          style={{ color: "black", padding: 0 }}
          onClick={() => navigate("/")}
          title="Go back"
          aria-label="Go back"
        >
          <FaArrowLeft size={24} color="black" />
        </Button>
      </div>
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Profile</h2>

      {msg && <p style={{ color: "green", textAlign: "center" }}>{msg}</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
          />
        </div>

        <h4>Change Password</h4>

        <div style={{ marginBottom: "15px" }}>
          <label>Old Password:</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Confirm New Password:</label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Update
        </button>
      </form>
    </div>
    </Container>
  );
};

export default EditProfile;
