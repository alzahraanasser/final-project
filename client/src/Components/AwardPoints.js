import axios from "axios";

export const awardPoints = async (pointsToAdd, questionId) => {
  const token = localStorage.getItem("token");
  if (!token) return;
  try {
    await axios.post(
      "http://localhost:5000/add-points",
      { pointsToAdd, questionId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    // Optionally handle error
    console.error("Failed to award points:", err);
  }
};