import { Navbar, Nav, NavItem } from "reactstrap";
import logo from "../Images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../Features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar className="header" expand="md" style={{ padding: "10px", direction: "rtl" }}>
      <div className="d-flex w-100 align-items-center" style={{ justifyContent: "flex-start" }}>
        <Link to="/" className="ms-3">
          <img
            src={logo}
            className="logo"
            alt="Website Logo"
            style={{
              width: "150px",
              height: "80px",
              padding: "5px",
              margin: "10px",
            }}
          />
        </Link>
        <Nav className="nav" style={{ direction: "rtl" }}>
          <NavItem>
            <Link to="/" className="nav-link text-white">الصفحة الرئيسية</Link>
          </NavItem>
          <NavItem>
            <Link to="/englishlessons" className="nav-link text-white">انجليزي</Link>
          </NavItem>
          <NavItem>
            <Link to="/arabiclesson" className="nav-link text-white">عربي</Link>
          </NavItem>
          <NavItem>
            <Link to="/mathlesson" className="nav-link text-white">رياضيات</Link>
          </NavItem>
          <NavItem>
            <Link to="/activitylevel" className="nav-link text-white">أنشطة</Link>
          </NavItem>
          {user?.role === "admin" && (
            <>
              <NavItem>
                <Link to="/admin-dashboard" className="nav-link text-white">لوحة التحكم</Link>
              </NavItem>
              <NavItem>
                <Link to="/create-user" className="nav-link text-white">إضافة مستخدم</Link>
              </NavItem>
            </>
          )}
          {user?.role === "teacher" && (
            <>
              <NavItem>
                <Link to="/teacher-dashboard" className="nav-link text-white">لوحة المعلم</Link>
              </NavItem>
              {/* 
              <NavItem>
                <Link to="/teacher/lessons" className="nav-link text-white">الدروس</Link>
              </NavItem>
              
              <NavItem>
                <Link to="/teacher/view-hardlevel-answers" className="nav-link text-white">إجابات المستوى الصعب</Link>
              </NavItem>
              */}
            </>
          )}
        </Nav>
        {user && (
          <div className="profile-menu-container ms-auto" style={{ marginRight: "auto" }}>
            <div className="profile-circle" onClick={toggleMenu}>
              <FaUserCircle size={40} color="white" />
            </div>
            {isOpen && (
              <div className="profile-dropdown" style={{ direction: "rtl" }}>
                <div className="profile-info">
                  <span className="user-name">👋 مرحبًا، {user.name}</span>
                </div>
                <div className="profile-links">
                  <Link to="/edit-profile" className="profile-link">
                    تعديل الملف الشخصي
                  </Link>
                  <button onClick={handleLogout} className="profile-link">
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Navbar>
  );
};

export default Header;
