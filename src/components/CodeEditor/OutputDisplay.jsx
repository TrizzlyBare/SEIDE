import React from "react";

const OutputDisplay = ({ output, isError }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      {output.map((line, index) => (
        <p key={index} style={{ color: isError ? "red" : "green" }}>
          {line}
        </p>
      ))}
    </div>
  );
};

export default OutputDisplay;
