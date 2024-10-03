import React from "react";
import CodeEditor from "../components/CodeEditor/CodeEditor";
import "../styles/CodeEditorPage.css"; // Import the CSS file
import Sidebar from "../components/Sidebar/Sidebar";

const CodeEditorPage = () => (
  <div className="code-editor-page">
    <Sidebar/>   
    <CodeEditor />
  </div>  
);

export default CodeEditorPage;
