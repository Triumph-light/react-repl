import React from "react";

const ReactLogo = () => {
  return (
    <svg
      width="30px"
      height="30px"
      viewBox="-10.5 -9.45 21 18.9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color: `rgba(8, 126, 164, 1)` }}
    >
      <circle cx="0" cy="0" r="2" fill="currentColor"></circle>
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <ellipse rx="10" ry="4.5"></ellipse>
        <ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse>
        <ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse>
      </g>
    </svg>
  );
};

export default ReactLogo;
