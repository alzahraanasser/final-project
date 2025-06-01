import React from 'react';
import { Link } from 'react-router-dom';

// Inside your navigation menu, add these links based on user role:
{user?.role === "teacher" && (
  <Link to="/teacher/lessons" style={{ textDecoration: 'none', color: 'inherit' }}>
    <li>My Lessons</li>
  </Link>
)}

{user?.role === "student" && (
  <Link to="/student/lessons" style={{ textDecoration: 'none', color: 'inherit' }}>
    <li>Lessons</li>
  </Link>
)} 