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
import "./App.css";
import QuestionCodeEditor from "./components/CodeEditor/CodeEditor";
import Footer from "./components/Footer/Footer";
import Curriculum from "./components/Curriculum/Curriculum";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminUsers from "./components/Admin/AdminUsers";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const hideNavBar = location.pathname === "/";
  const hideFooter = location.pathname === "/";
  const hideFooterAdmin = location.pathname.startsWith("/admin");

  return (
    <UserProvider>
      <div className="app-container">
        {!hideNavBar && <NavBar />}
        <div className="content-container">
          {isAdminRoute && <Sidebar />}{" "}
          {/* Show sidebar only for admin routes */}
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/editor" element={<CodeEditorPage />} />

            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subjects" element={<Dashboard />} />
            <Route
              path="/subjects/:subject_id/topics"
              element={<TopicDashboard />}
            />
            <Route
              path="/subjects/:subject_id/topics/:topic_id/questions"
              element={<QuestionDashboard />}
            />
            <Route
              caseSensitive
              path="/admin"
              element={<ProtectedRoute element={<AdminPage />} />}
            />
            <Route
              path="/admin/:subject_id/create"
              element={<ProtectedRoute element={<TopicsManager />} />}
            />
            <Route
              path="/admin/:subject_id/topics/:topic_id/questions"
              element={<ProtectedRoute element={<QuestionManager />} />}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute element={<AdminUsers />} />}
            />
            <Route
              path="/editor/:subject_id/:topic_id/:question_id"
              element={<QuestionCodeEditor />}
            />
          </Routes>
        </div>
        {!hideFooter && !hideFooterAdmin && <Footer />}
      </div>
    </UserProvider>
  );
}

export default App;
