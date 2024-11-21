import React from "react";
import "../../styles/outputButton.css";

const DashRunButton = ({ runCode, isLoading }) => {
  return (
    <button onClick={runCode} disabled={isLoading} id="buttonoutput">
      {isLoading ? "Loading..." : "Run Code"}
    </button>
  );
};

export default DashRunButton;
