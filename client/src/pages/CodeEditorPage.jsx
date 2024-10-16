// CodeEditorPage.jsx
import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import "../styles/CodeEditorPage.css"; // Import the CSS file
import Sidebar from "../components/Sidebar/Sidebar";

const CodeEditorPage = () => (
  <div className="code-editor-page">
    <Sidebar />
    <div className="code-editor-content">
      <CodeEditor />
    </div>
  </div>
);

export default CodeEditorPage;
