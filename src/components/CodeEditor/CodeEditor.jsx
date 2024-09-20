import React, { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../../middleware/constants";
import Output from "./Output";

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div style={{ width: "100%" }}>
      {" "}
      {/* Set width to 100% */}
      <div style={{ display: "flex", gap: "16px" }}>
        <div style={{ width: "50%", height: "400px" }}>
          <LanguageSelector language={language} onSelect={onSelect} />
          <Editor
            height="100%"
            options={{
              minimap: {
                enabled: false,
              },
            }}
            language={language}
            value={value}
            onMount={onMount}
          />
        </div>
        <div style={{ width: "50%" }}>
          <Output editorRef={editorRef} language={language} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
