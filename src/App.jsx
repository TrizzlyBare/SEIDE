import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import styled from "styled-components";

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
`;

function App() {
  return (
    <Router>
      <Header />
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/editor" element={<CodeEditorPage />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}
export default App;
