import React, { useState, useEffect } from "react";

export default function CircularProgress({ remainingTime }) {
  const radius = 100;
  const strokeWidth = 25;
  const circumference = 2 * Math.PI * radius;

  const strokeDashoffset = circumference - (remainingTime / 100) * circumference;

  return (
    <div className="mx-auto">
      <svg
        width="50"
        height="50"
        viewBox="0 0 250 250"
        xmlns="http://www.w3.org/2000/svg"
        className="chrono"
      >
        <circle
          cx="125"
          cy="125"
          r={radius}
          stroke="#8B2DF1"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s linear",
          }}
        />
      </svg>
    </div>
  );
}