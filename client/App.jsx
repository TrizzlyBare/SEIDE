import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar/NavBar";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import CreateTopic from "./components/Admin/create_topic";
import "./App.css"; // Import the CSS file

function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/editor" element={<CodeEditorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route
              path="/admin/:subjectName/topics/create"
              element={<CreateTopic />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
