import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App"; // Import App component
import AuthPage from "./pages/AuthPage"; // Import AuthPage
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/app" element={<App />} />
      <Route path="/editor" element={<CodeEditorPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
);
