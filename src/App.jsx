import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import HomePage from "./pages/Homepage";
import AuthPage from "./pages/AuthPage";
<<<<<<< Updated upstream
=======
import EditorPage from "./pages/EditorPage";
import styled from "styled-components";

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Header />
<<<<<<< Updated upstream
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </div>
=======
      <AppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </AppContainer>
>>>>>>> Stashed changes
    </Router>
  );
}

export default App;
