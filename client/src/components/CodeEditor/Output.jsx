import React, { useState } from "react";
import { executeCode } from "../../middleware/Editorapi";
import RunButton from "./RunButton";
import "../../styles/Output.css";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      setIsError(!!result.stderr); // Set isError to true if there's an error
    } catch (error) {
      console.log(error);
      alert("An error occurred: " + (error.message || "Unable to run code"));
      setIsError(true); // Error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="output-wrapper">
      <div
        className={`output-container ${
          isError ? "error-text" : "success-text"
        }`}
      >
        {output &&
          output.map((line, index) => (
            <p key={index} className="output-text">
              {line}
            </p>
          ))}
      </div>
      <RunButton runCode={runCode} isLoading={isLoading} />
    </div>
  );
};

export default Output;
