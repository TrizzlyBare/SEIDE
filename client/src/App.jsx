import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import TopicsManager from "./components/Admin/topics_manager";
import Dashboard from "./components/Dashboard/Dashboard"; // Updated path
import TopicDashboard from "./components/Dashboard/topic_dashboard"; // Updated path
import QuestionDashboard from "./components/Dashboard/question_dashboard"; // Updated path
import "./App.css";

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <div className="content-container">
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/editor" element={<CodeEditorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/:subject_id/create" element={<TopicsManager />} />
          <Route
            path="/admin/subjects/:subject_id/topics"
            element={<TopicsManager />}
          />

          {/* Dashboard routes */}
          <Route path="/subjects" element={<Dashboard />} />
          <Route
            path="/subjects/:subject_id/topics"
            element={<TopicDashboard />}
          />
          {/* <Route
            path="/subjects/:subject_id/topics/:topics_id/questions"
            element={<QuestionDashboard />}
          /> */}

          <Route path="/questions" element={<QuestionDashboard />} />
          {/* 404 route */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
