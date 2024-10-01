import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import ProfilePage from "./pages/ProfilePage";
import styled from "styled-components";
import Sidebar from "./components/Sidebar/Sidebar";

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
  return (
    <Router>
      <AppContainer>
        <Sidebar />
        <ContentContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/editor" element={<CodeEditorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;
