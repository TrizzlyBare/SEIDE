import React from "react";
import "../../styles/outputButton.css";

const RunButton = ({ runCode, isLoading }) => {
  return (
    <button onClick={runCode} disabled={isLoading} id="buttonoutput">
      {isLoading ? "Loading..." : "Run Code"}
    </button>
  );
};

export default RunButton;
