import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormGroup, Label, Input } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  //const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' });
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reportText, setReportText] = useState("");
  const [assignTeacherModalOpen, setAssignTeacherModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const navigate = useNavigate();

  // جلب المستخدمين
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setMessage("Unauthorized or server error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // تعطيل المستخدم
  const handleDeactivate = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `http://localhost:5000/admin/deactivate-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.msg) {
        setMessage(response.data.msg);
        // Wait a bit before refreshing to show the message
        setTimeout(() => {
          fetchUsers();
        }, 1000);
      }
    } catch (err) {
      console.error("Deactivate error:", err);
      setMessage(err.response?.data?.msg || "Failed to deactivate user");
    }
  };

  // تفعيل المستخدم
  const handleActivate = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/admin/activate-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      alert("Failed to activate user");
    }
  };

  

  // Open modal to write report
  const openReportModal = (student) => {
    setSelectedStudent(student);
    setReportText("");
    setModalOpen(true);
  };

  // Submit report (send to backend)
  const handleSubmitReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/admin/report",
        { studentEmail: selectedStudent.email, text: reportText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg || "Report submitted successfully");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to submit report");
    }
    setModalOpen(false);
    setReportText("");
    setSelectedStudent(null);
  };

  // Open modal to assign teacher
  const openAssignTeacherModal = (student) => {
    setSelectedStudent(student);
    setSelectedTeacher("");
    setAssignTeacherModalOpen(true);
  };

  // Submit teacher assignment
  const handleAssignTeacher = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/admin/assign-teacher",
        { 
          studentEmail: selectedStudent.email, 
          teacherEmail: selectedTeacher 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg || "Teacher assigned successfully");
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to assign teacher");
    }
    setAssignTeacherModalOpen(false);
    setSelectedTeacher("");
    setSelectedStudent(null);
  };

  // Get list of teachers for the dropdown
  const teachers = users.filter(u => u.role === "teacher" && u.isActive);

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Arrow Button */}
      <div>
        <Button
          type="button"
          color="link"
          style={{ color: "black", padding: 0 }}
          onClick={() => navigate(-1)}
          title="Go back"
          aria-label="Go back"
        >
          <FaArrowLeft size={24} color="black" />
        </Button>
      </div>
      <h2>👨‍💼 Admin Dashboard</h2>
      {message && (
        <div style={{ 
          padding: "10px", 
          marginBottom: "20px", 
          backgroundColor: message.includes("success") ? "#d4edda" : "#f8d7da",
          color: message.includes("success") ? "#155724" : "#721c24",
          borderRadius: "4px",
          border: `1px solid ${message.includes("success") ? "#c3e6cb" : "#f5c6cb"}`
        }}>
          {message}
        </div>
      )}

      {/* Create User Form 
      <div style={{ marginBottom: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
        <h4>Create New User</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            style={{ padding: "5px", borderRadius: "4px", border: "1px solid #ddd" }}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleCreateUser}
            style={{ backgroundColor: "#2ecc71", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px" }}
          >
            Create User
          </button>
        </div>
      </div>
*/}
      <h4>Registered Users:</h4>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td style={{ color: u.isActive ? "green" : "red", fontWeight: "bold" }}>
                {u.isActive ? "Active" : "Deactivated"}
              </td>
              <td>
                {u.isActive ? (
                  <>
                    <button onClick={() => handleDeactivate(u._id)} style={{ backgroundColor: "#e74c3c", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px", marginRight: 5 }}>
                      Deactivate
                    </button>
                    {u.role === "student" && (
                      <>
                        <button onClick={() => openReportModal(u)} style={{ backgroundColor: "#3498db", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px", marginRight: 5 }}>
                          Write Report
                        </button>
                        <button onClick={() => openAssignTeacherModal(u)} style={{ backgroundColor: "#2ecc71", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px" }}>
                          Assign Teacher
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <button onClick={() => handleActivate(u._id)} style={{ backgroundColor: "#2ecc71", color: "#fff", padding: "5px 10px", border: "none", borderRadius: "4px" }}>
                    Activate
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Report Modal */}
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
        <ModalHeader toggle={() => setModalOpen(false)}>
          Write Report for {selectedStudent?.name}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="reportText">Report</Label>
            <Input
              id="reportText"
              type="textarea"
              value={reportText}
              onChange={e => setReportText(e.target.value)}
              rows={6}
              placeholder="Write your report here..."
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmitReport} disabled={!reportText.trim()}>
            Submit Report
          </Button>
          <Button color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Assign Teacher Modal */}
      <Modal isOpen={assignTeacherModalOpen} toggle={() => setAssignTeacherModalOpen(false)}>
        <ModalHeader toggle={() => setAssignTeacherModalOpen(false)}>
          Assign Teacher to {selectedStudent?.name}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="teacherSelect">Select Teacher</Label>
            <Input
              id="teacherSelect"
              type="select"
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
            >
              <option value="">Select a teacher...</option>
              {teachers.map(teacher => (
                <option key={teacher._id} value={teacher.email}>
                  {teacher.name} ({teacher.email})
                </option>
              ))}
            </Input>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleAssignTeacher} disabled={!selectedTeacher}>
            Assign Teacher
          </Button>
          <Button color="secondary" onClick={() => setAssignTeacherModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default AdminDashboard;