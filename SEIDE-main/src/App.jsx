import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import Dashboard from "./components/Dashboard/Dashboard";
import styled from "styled-components";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminPage from "./pages/AdminPage";

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

function App() {
  const [subjects, setSubjects] = useState([]);

  const addSubject = (subject) => {
    setSubjects((prevSubjects) => {
      const updatedSubjects = [...prevSubjects, subject];
      console.log("Added subject:", subject); // Log added subjects
      console.log("Current subjects:", updatedSubjects); // Log current subjects
      return updatedSubjects;
    });
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/admin/*"
          element={<AdminPage addSubject={addSubject} />}
        />
        <Route
          path="/*"
          element={
            <AppContainer>
              <Sidebar />
              <ContentContainer>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/editor" element={<CodeEditorPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/dashboard"
                    element={<Dashboard subjects={subjects} />}
                  />
                </Routes>
              </ContentContainer>
            </AppContainer>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
