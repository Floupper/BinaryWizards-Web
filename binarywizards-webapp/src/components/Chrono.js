import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";

const Chrono = forwardRef(({ sendResponse }, ref) => {
  const [time, setTime] = useState(0);
  const intervalIdRef = useRef(null);

  const startTimer = (timeAvailable) => {
    stopTimer(); 
    setTime(timeAvailable);

    if (timeAvailable > 0) {
      intervalIdRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null; 
            onTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      onTimerEnd();
    }
  };

  const stopTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  const resetTimer = (timeAvailable) => {
    stopTimer();
    startTimer(timeAvailable);
  };

  const onTimerEnd = () => {
    sendResponse(-1); 
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

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
