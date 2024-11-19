import React from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/Homepage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import CreateTopic from "./components/Admin/create_topic";
import AdminQuestion from "./components/Admin/create_question";
import QuestionPage from "./pages/QuestionsPage";
import AnswersPage from "./pages/AdminAnswers";
import Dashboard from "./components/Dashboard/Dashboard";
import "./App.css"; // Import the CSS file

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
          <Route path="/admin/create_topic" element={<CreateTopic />} />
          <Route path="/admin/create_question" element={<AdminQuestion />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questions" element={<QuestionPage />} />
          <Route path="/answers" element={<AnswersPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
