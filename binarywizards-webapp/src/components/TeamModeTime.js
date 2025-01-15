import React, { useState } from "react";

const TimeSelector = ({ onTimerSelect }) => {
  const [selectedTimer, setSelectedTimer] = useState("none");

  const timers = [
    { value: "easy", label: "30s", color: "bg-[#8B2DF1] text-white" },
    { value: "medium", label: "15s", color: "bg-[#8B2DF1] text-white" },
    { value: "hard", label: "5s", color: "bg-[#8B2DF1] text-white" },
  ];

  return (
    <div className="p-6 rounded-lg shadow-lg w-full max-w-lg bg-white">
      <h2 className="text-lg mb-4 text-center">Select a Timer</h2>
      <div className="flex justify-around items-center mb-6">
        {timers.map((timer, index) => (
          <button
            key={index}
            onClick={() => {
                setSelectedTimer(timer.value);
                onTimerSelect(timer.value);
              }}
            className={`w-32 h-20 rounded-lg flex items-center justify-center text-lg font-medium ${timer.color} ${
              selectedTimer === timer.value
                ? "opacity-100 ring-4 ring-offset-2 ring-offset-white"
                : "opacity-60 border border-gray-300"
            }`}
          >
            {timer.label}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default TimeSelector;
