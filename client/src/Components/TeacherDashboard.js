import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { Button } from 'reactstrap';

const REPORTS_PER_PAGE = 10;
const STUDENTS_PER_PAGE = 10;
const ANSWERS_PER_PAGE = 10;

const TeacherDashboard = () => {
  const [reports, setReports] = useState([]);
  const [students, setStudents] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("reports");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }
        const [reportsRes, studentsRes, answersRes] = await Promise.all([
          axios.get("http://localhost:5000/teacher/reports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/teacher/students-with-points", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/teacher/answers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setReports(reportsRes.data);
        setStudents(studentsRes.data);
        setAnswers(answersRes.data);
        console.log('Reports data:', reportsRes.data);
        console.log('Answers data:', answersRes.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch data");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredReports = reports.filter((r) => {
    const s = search.toLowerCase();
    return (
      r.student?.name?.toLowerCase().includes(s) ||
      r.student?.email?.toLowerCase().includes(s) ||
      r.text?.toLowerCase().includes(s) ||
      r.points?.toString().includes(s)
    );
  });

  const filteredStudents = students.filter((s) => {
    const sLower = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(sLower) ||
      s.email.toLowerCase().includes(sLower)
    );
  });

  const filteredAnswers = answers.filter((a) => {
    const sLower = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(sLower) ||
      a.email?.toLowerCase().includes(sLower)
    );
  });

  const totalPages = Math.ceil(
    activeTab === "reports"
      ? filteredReports.length / REPORTS_PER_PAGE
      : activeTab === "students"
      ? filteredStudents.length / STUDENTS_PER_PAGE
      : filteredAnswers.length / ANSWERS_PER_PAGE
  ) || 1;

  const paginatedData =
    activeTab === "reports"
      ? filteredReports.slice((page - 1) * REPORTS_PER_PAGE, page * REPORTS_PER_PAGE)
      : activeTab === "students"
      ? filteredStudents.slice((page - 1) * STUDENTS_PER_PAGE, page * STUDENTS_PER_PAGE)
      : filteredAnswers.slice((page - 1) * ANSWERS_PER_PAGE, page * ANSWERS_PER_PAGE);

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const exportToExcel = () => {
    let data = [];
    if (activeTab === "reports") {
      data = filteredReports.map(r => ({
        'Student Name': r.student?.name || 'N/A',
        'Email': r.student?.email || 'N/A',
        'Report': r.text || 'N/A',
        'Points': r.student?.points || 'N/A',
        'Date': r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A',
      }));
    } else if (activeTab === "students") {
      data = filteredStudents.map(s => ({
        'Student Name': s.name || 'N/A',
        'Email': s.email || 'N/A',
      }));
    } else if (activeTab === "answers") {
      data = filteredAnswers.map(a => ({
        'Student Email': a.email || 'N/A',
        'Student Name': a.name || 'N/A',
        'Easy Answer': a.easyAnswer || 'N/A',
        'Medium Answer': a.mediumAnswer || 'N/A',
        'Hard Answer': a.hardAnswer || 'N/A',
      }));
    }
    if (data.length === 0) {
      alert('No data to export!');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, activeTab === "reports" ? "Reports" : activeTab === "students" ? "Students" : "Answers");
    XLSX.writeFile(wb, `${activeTab}.xlsx`);
  };

  // Reset page on search or tab change
  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  useEffect(() => {
    if (activeTab === "answers") {
      console.log('Paginated answers data:', paginatedData);
    }
  }, [paginatedData, activeTab]);

  return (
    <div style={{ minHeight: '100vh', background: '#b3e0fc', width: '100%' }}>
      {/* Back Button */}
      <div className="d-flex justify-content-start mb-3">
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

      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32, minWidth: 350, maxWidth: 900, width: '100%', margin: '32px auto 0 auto' }}>
        <h1 style={{ fontWeight: 700, color: '#222', marginBottom: 8 }}>Teacher Dashboard</h1>
        <p style={{ color: '#444', marginBottom: 24 }}>Welcome, Teacher! Here you can view your students and their reports.</p>

        {/* Tabs */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
          <button
            onClick={() => setActiveTab("reports")}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: activeTab === "reports" ? '#111184' : '#f5f7fa',
              color: activeTab === "reports" ? 'white' : '#333',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Reports
          </button>
          <button
            onClick={() => setActiveTab("students")}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: activeTab === "students" ? '#111184' : '#f5f7fa',
              color: activeTab === "students" ? 'white' : '#333',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("answers")}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: activeTab === "answers" ? '#111184' : '#f5f7fa',
              color: activeTab === "answers" ? 'white' : '#333',
              border: 'none',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Answers
          </button>
        </div>

        {/* Search and Export */}
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder={`Search by ${activeTab === "reports" ? "student name, email, or report" : activeTab === "students" ? "student name or email" : "student name or email"}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '10px 16px', width: 320, borderRadius: 8, border: '1px solid #bdbdbd', fontSize: 16, outline: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          />
          <button
            onClick={exportToExcel}
            style={{ padding: '10px 24px', borderRadius: 8, background: '#111184', color: 'white', border: 'none', fontWeight: 600, fontSize: 16, boxShadow: '0 2px 8px rgba(17,17,132,0.08)', cursor: 'pointer' }}
          >
            Export to Excel
          </button>
        </div>

        {/* Content Tables */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', padding: 32 }}>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red', textAlign: 'center', padding: 32 }}>{error}</div>
        ) : activeTab === "reports" ? (
          filteredReports.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: 32 }}>No reports found.</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e0e0e0', marginBottom: 16 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 15 }}>
                  <thead style={{ backgroundColor: '#f5f7fa' }}>
                    <tr>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Student Name</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Email</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Report</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Points</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((r) => (
                      <tr key={r._id} style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 8px' }}>{r.student?.name}</td>
                        <td style={{ padding: '10px 8px' }}>{r.student?.email}</td>
                        <td style={{ padding: '10px 8px' }}>{r.text}</td>
                        <td style={{ padding: '10px 8px' }}>{r.student?.points || 'N/A'}</td>
                        <td style={{ padding: '10px 8px' }}>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <button onClick={() => goToPage(page - 1)} disabled={page === 1}>Prev</button>
                <span>Page {page} / {totalPages}</span>
                <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</button>
              </div>
            </>
          )
        ) : activeTab === "students" ? (
          filteredStudents.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: 32 }}>No students found.</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e0e0e0', marginBottom: 16 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 15 }}>
                  <thead style={{ backgroundColor: '#f5f7fa' }}>
                    <tr>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Student Name</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((s) => (
                      <tr key={s._id} style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '10px 8px' }}>{s.name}</td>
                        <td style={{ padding: '10px 8px' }}>{s.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                <button onClick={() => goToPage(page - 1)} disabled={page === 1}>Prev</button>
                <span>Page {page} / {totalPages}</span>
                <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</button>
              </div>
            </>
          )
        ) : (
          // Answers Tab
          filteredAnswers.length === 0 ? (
            <div style={{ color: '#888', textAlign: 'center', padding: 32 }}>No answers found.</div>
          ) : (
            <>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #e0e0e0', marginBottom: 16 }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 15 }}>
                  <thead style={{ backgroundColor: '#f5f7fa' }}>
                    <tr>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Student Email</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Student Name</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Easy Answer</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Medium Answer</th>
                      <th style={{ padding: '12px 8px', fontWeight: 600, color: '#333' }}>Hard Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                {paginatedData.map((a) => (
                  <tr key={a._id} style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 8px' }}>{a.email}</td>
                  <td style={{ padding: '10px 8px' }}>{a.name}</td>
                  <td style={{ padding: '10px 8px' }}>{a.easyAnswer}</td>
                  <td style={{ padding: '10px 8px' }}>
                    {a.mediumAnswer && typeof a.mediumAnswer === 'object'
                      ? Object.values(a.mediumAnswer).join(', ')
                      : 'N/A'}
                  </td>
                  <td style={{ padding: '10px 8px' }}>{a.hardAnswer}</td>
                  </tr>
                  ))}
                  </tbody>
                  </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
                    <button onClick={() => goToPage(page - 1)} disabled={page === 1}>Prev</button>
                    <span>Page {page} / {totalPages}</span>
                    <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</button>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      );
    };

export default TeacherDashboard;
