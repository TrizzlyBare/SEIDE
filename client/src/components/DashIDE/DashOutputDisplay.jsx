import React from "react";
import "../../styles/DashOutput.css";

const DashOutputDisplay = ({ output, isError }) => {
  return (
    <div className="output-container">
      <div className={isError ? "output-error" : "output-text"}>
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

export default DashOutputDisplay;