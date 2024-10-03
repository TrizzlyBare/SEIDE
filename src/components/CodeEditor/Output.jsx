import React, { useState } from "react";
import { executeCode } from "../../middleware/api";
import RunButton from "./RunButton";
import OutputDisplay from "./OutputDisplay";
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
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      alert("An error occurred: " + (error.message || "Unable to run code"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {output && <OutputDisplay output={output} isError={isError} />}
      <RunButton runCode={runCode} isLoading={isLoading} />
    </div>
  );
};

export default Output;
