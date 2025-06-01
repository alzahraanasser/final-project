import "./App.css";
// استيراد المكونات
import Header from "./Components/Header";
import Home from "./Components/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row } from "reactstrap"; // استيراد مكونات Reactstrap
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // استيراد مكتبة React Router
import Register from "./Components/Register";
import Login from "./Components/Login";
import { useSelector } from "react-redux";
import back1 from "./Images/back1.jpg";
import Lessons from './Components/Lessons';
import Activities from './Components/Activities';
import Lesson from "./Components/Lesson";
import UpdateLesson from "./Components/UpdateLesson";
import WriteActivity from "./Components/WriteActivity";
import LessonType from "./Components/LessonType";
import ArabicLesson from "./Components/ArabicLesson";
import Arabic from "./Components/Arabic";
import MathLesson from "./Components/MathLesson";
import Footer from "./Components/Footer";
import MathAdd from "./Components/MathAdd";
import MathSubtract from "./Components/MathSubtract";
import MathMultiply from "./Components/MathMultiply";
import MathDivide from "./Components/MathDivide";
import MathAddExercise from "./Components/MathAddExercise";
import MathDivideExercise from "./Components/MathDivideExercise";
import MathMultiplyExercise from "./Components/MathMultiplyExercise";
import MathSubtractExercise from "./Components/MathSubtractExercise";
import ActivityPageArabic from "./Components/ActivityPageArabic";
import ActivityLevel from "./Components/ActivityLevel";
import EasyLevel from "./Components/EasyLevel";
import MediumLevel from "./Components/MediumLevel";
import HardLevel from "./Components/HardLevel";
import AdminDashboard from "./Components/AdminDashboard";
import AdminCreateUser from "./Components/AdminCreateUser";
import ProtectedRoute from "./Components/ProtectedRoute";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserFromToken } from "./Features/UserSlice";
import EditProfile from "./Components/EditProfile";
import ViewHardLevelAnswers from "./Components/ViewHardLevelAnswers";
import ProtectedTeacherRoute from "./Components/ProtectedTeacherRoute";
import Unauthorized from "./Components/Unauthorized";
import TeacherDashboard from './Components/TeacherDashboard';
import LearnerDashboard from './Components/LearnerDashboard';
import ResetPassword from "./Components/ResetPassword";
import EnglishLessonT from "./Components/EnglishLessonT";
import EnglishLessonActivity from "./Components/EnglishLessonActivity";
import ArabicT from "./Components/ArabicT";
import ArabicLessonT from "./Components/ArabicLessonT";
import TeacherLessons from './Components/TeacherLessons';
import MathNumbers from "./Components/MathNumbers";
import MathNumbersActivity from "./Components/MathNumbersActivity";
import AddLessonContentEnglish from "./Components/AddLessonContentEnglish";
import AddEnglishLetter from "./Components/AddEnglishLetter";
import ViewLessonContentEnglish from "./Components/ViewLessonContentEnglish";
import AddArabicLetter from "./Components/AddArabicLetter";
import AddLessonContent from "./Components/AddLessonContent";
import ViewLessonContent from "./Components/ViewLessonContent";

const App = () => {
  const user = useSelector((state) => state.users.user);  // استرجاع المستخدم من Redux
  const dispatch = useDispatch();
  const location = useLocation();  // أخذ مسار الصفحة الحالي

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setUserFromToken(token)); // تعيين المستخدم من الـ token المخزن
    }
  }, [dispatch]);

  return (
    <div className='login-container' style={{
      backgroundImage: `url(${back1})`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      display: 'flex',
      paddingBottom: '100px',
    }}>
      <Container fluid>
        <Row>
          {/* إظهار الهيدر فقط إذا فيه مستخدم ومو في صفحة login */}
          {user && location.pathname !== "/login" && <Header />}
        </Row>
        <Row className="main">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            {user ? (
              <>
                <Route path="/" element={<Home />} />
                {/* English Lessons */}
                <Route 
                  path="/englishlessons" 
                  element={
                    (user.role === "teacher" || user.role === "admin")
                      ? <EnglishLessonT />
                      : user.role === "student"
                        ? <Lessons />
                        : <div>Unauthorized</div>
                  }
                />
                <Route path="/lesson/:id" 
                  element={
                    (user.role === "teacher" || user.role === "admin")
                    ? <EnglishLessonActivity /> 
                    : user.role === "student"
                    ? <Lesson />
                    : <div>Unauthorized</div>  
                  } />
                {/* Arabic Lessons */}
                <Route path="/arabiclesson" 
                  element={(user.role === "teacher" || user.role === "admin")
                   ? <ArabicLessonT /> 
                   : user.role === "student"
                   ? <ArabicLesson />
                   : <div>Unauthorized</div> 
                  } />
                <Route path="/arabiclesson/:id" element={user.role === "teacher" ? <ArabicT /> : <Arabic />} />
                <Route path="/activities" element={<Activities />} />
                <Route path="/activity/:id" element={<Activities />} />
                <Route path="/write-activity/:id" element={<WriteActivity />} />
                <Route path="/update-lesson/:id" element={<UpdateLesson />} />
                <Route path="/lessontype" element={<LessonType />} />
                <Route path="/mathlesson" element={<MathLesson />} />
                <Route path="/mathadd" element={<MathAdd />} />
                <Route path="/mathnumbers" element={<MathNumbers />} />
                <Route path="/mathnumbersactivity" element={<MathNumbersActivity />} />
                <Route path="/mathsubtract" element={<MathSubtract />} />
                <Route path="/mathmultiply" element={<MathMultiply />} />
                <Route path="/mathdivide" element={<MathDivide />} />
                <Route path="/mathaddexercise" element={<MathAddExercise />} />
                <Route path="/mathsubtractexercise" element={<MathSubtractExercise />} />
                <Route path="/mathmultiplyexercise" element={<MathMultiplyExercise />} />
                <Route path="/mathdivideexercise" element={<MathDivideExercise />} />
                <Route path="/arabicactivity/:id" element={<ActivityPageArabic />} />
                <Route path="/addletter" element={<AddArabicLetter />} />
                <Route path="/addlessoncontent/:id" element={<AddLessonContent />} />
                <Route path="/viewlessoncontent/:id" element={<ViewLessonContent />} />
                <Route path="/activitylevel" element={<ActivityLevel />} />
                <Route path="/easy-level" element={<EasyLevel />} />
                <Route path="/medium-level" element={<MediumLevel />} />
                <Route path="/hard-level" element={<HardLevel />} />
                <Route path="/edit-profile" element={<EditProfile />} />
               {/*//-------------------------------*/}
                <Route path="/addlessoncontentenglish/:id" element={<AddLessonContentEnglish />} />
                <Route path="/addlessonenglish" element={<AddEnglishLetter />} />
                <Route path="/viewlessoncontentenglish/:id" element={<ViewLessonContentEnglish />} />


                {/* Role-based Protected Routes */}
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/create-user" element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminCreateUser />
                  </ProtectedRoute>
                } />
                
                <Route path="/teacher/view-hardlevel-answers" element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <ViewHardLevelAnswers />
                  </ProtectedRoute>
                } />
                
                <Route path="/teacher-dashboard" element={
                  <ProtectedRoute allowedRoles={["teacher"]}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/learner-dashboard" element={
                  <ProtectedRoute allowedRoles={["learner"]}>
                    <LearnerDashboard />
                  </ProtectedRoute>
                } />

                <Route path="/teacher/lessons" element={<ProtectedTeacherRoute><TeacherLessons /></ProtectedTeacherRoute>} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}

            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </Row>
        <Row>
          <Footer />
        </Row>
      </Container>
    </div>
  );
};

export default App;
