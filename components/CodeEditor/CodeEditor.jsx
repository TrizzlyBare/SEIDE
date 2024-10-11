import React, { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../middleware/constants";
import Output from "./Output";
import "../../styles/CodeEditorPage.css";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [textInput, setTextInput] = useState(""); // State for the problem description

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
  };

  return (
    <div className="main-container">

      <div className="split-container">
        {/* Left side: Problem description */}
        <div className="left-panel">
          <textarea
            value={textInput}
            onChange={handleTextInputChange}
            placeholder="Enter problem description..."
            className="problem-description"
          />
        </div>

        {/* Right side: Editor and controls */}
        <div className="right-panel">
          <div className="editor-header">
            <LanguageSelector language={language} onSelect={onSelect} />
          </div>
          <Editor
            height="100%"
            options={{
              minimap: { enabled: false },
            }}
            language={language}
            value={value}
            onMount={onMount}
          />
          <Output editorRef={editorRef} language={language} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
