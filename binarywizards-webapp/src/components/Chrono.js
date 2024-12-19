import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";

const Chrono = forwardRef(({ sendResponse }, ref) => {
  const [time, setTime] = useState(0);
  const intervalIdRef = useRef(null);

  // Function to start the timer
  const startTimer = (timeAvailable) => {
    clearInterval(intervalIdRef.current); // Clear any previous interval
    setTime(timeAvailable); // Set the initial time state

    if (timeAvailable > 0) {
      intervalIdRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalIdRef.current); // Stop the timer when time is 0
            onTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      onTimerEnd(); // If the time is already expired, call the timer end function
    }
  };

  // Function to manually stop the timer
  const stopTimer = () => {
    clearInterval(intervalIdRef.current);
  };

  // Function to reset the timer with a new available time
  const resetTimer = (timeAvailable) => {
    console.log(timeAvailable)
    stopTimer();
    startTimer(timeAvailable); // Restart the timer with the available time
  };

  // Function called when the timer ends
  const onTimerEnd = () => {
    sendResponse(-1); // Send a response indicating the time is up
  };

  // Function to format the time in minutes and seconds
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Expose stop and reset methods to the parent component
  useImperativeHandle(ref, () => ({
    stopTimer,
    resetTimer,
  }));

  return (
    <div>
      <div className={`text-5xl font-bold mb-4 ${time <= 5 ? "text-red-500" : "text-black"}`}>
        {formatTime(time)}
      </div>
    </div>
  );
});

export default Chrono;