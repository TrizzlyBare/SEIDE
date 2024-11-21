import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { UserProvider } from "./components/Context/UserContext";
import NavBar from "./components/navBar/NavBar";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import TopicsManager from "./components/Admin/topics_manager";
import QuestionManager from "./components/Admin/question_manager";
import TopicDashboard from "./components/Dashboard/topic_dashboard";
import Dashboard from "./components/Dashboard/Dashboard";
import QuestionDashboard from "./components/Dashboard/question_dashboard";
import ProtectedRoute from "./components/ProtectedRoute/protectedRouting";
import DashCodeEditorPage from "./pages/DashCodeEditorPage";
import "./App.css";
import QuestionCodeEditor from "./components/CodeEditor/CodeEditor";
import Footer from "./components/Footer/Footer";
import Curriculum from "./components/Curriculum/Curriculum";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminUsers from "./components/Admin/AdminUsers";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideNavBar = location.pathname === "/";
  const hideFooter = location.pathname === "/";
  const hideFooterAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="app-container">
      {!hideNavBar && <NavBar />}
      <div className="content-container">
        {isAdminRoute && <Sidebar />}
        <Routes>
          {/* Public route */}
          <Route path="/" element={<AuthPage />} />

          {/* Protected student/admin routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculum"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <Curriculum />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <DashCodeEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:subject_id/topics"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <TopicDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects/:subject_id/topics/:topic_id/questions"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <QuestionDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/:subject_id/:topic_id/:question_id"
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN", "YEAR1", "YEAR2", "YEAR3", "YEAR4"]}
              >
                <QuestionCodeEditor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/:subject_id/create"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <TopicsManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/:subject_id/topics/:topic_id/questions"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <QuestionManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!hideFooter && !hideFooterAdmin && <Footer />}
    </div>
  );
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
