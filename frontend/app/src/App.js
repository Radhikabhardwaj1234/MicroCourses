import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useContext } from 'react';
import { UserContext } from './context/UserContext';

import Navbar from './components/Navbar';

//auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Learner Pages
import Courses from './pages/learner/Courses';
import CourseDetail from './pages/learner/CourseDetail';
import LearnLesson from './pages/learner/LearnLesson';
import Progress from './pages/learner/Progress';
// Creator Pages
import CreatorApply from './pages/creator/CreatorApply';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CourseCreate from './pages/creator/CourseCreate';
import CourseManage from './pages/creator/CourseManage';

// Admin Pages
import AdminReviewCourses from './pages/admin/AdminReviewCourses';

function App() {
  const { user, loading } = useContext(UserContext);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login/>}/>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Learner / Creator / Admin Shared */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute role={['learner', 'creator', 'admin']} user={user} loading={loading}>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute role={['learner', 'creator', 'admin']} user={user} loading={loading}>
              <CourseDetail />
            </ProtectedRoute>
          }
        />

        {/* Learner Routes */}
        <Route
          path="/learn/:lessonId"
          element={
            <ProtectedRoute role={['learner']} user={user} loading={loading}>
              <LearnLesson />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute role={['learner']} user={user} loading={loading}>
              <Progress />
            </ProtectedRoute>
          }
        />

        {/* Creator Routes */}
        <Route
          path="/creator/apply"
          element={
            <ProtectedRoute role={['learner', 'creator']} user={user} loading={loading}>
              <CreatorApply />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/dashboard"
          element={
            <ProtectedRoute role={['creator']} user={user} loading={loading}>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/course/new"
          element={
            <ProtectedRoute role={['creator']} user={user} loading={loading}>
              <CourseCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/course/:courseId"
          element={
            <ProtectedRoute role={['creator']} user={user} loading={loading}>
              <CourseManage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/review/courses"
          element={
            <ProtectedRoute role={['admin']} user={user} loading={loading}>
              <AdminReviewCourses />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
