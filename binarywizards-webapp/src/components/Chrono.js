import React, { useState, useRef, forwardRef, useImperativeHandle } from "react";

const Chrono = forwardRef(({ sendResponse }, ref) => {
  const [time, setTime] = useState(0);
  const intervalIdRef = useRef(null);

  // Démarrer le chronomètre
  const startTimer = (timeAvailable) => {
    stopTimer(); // Assurez-vous qu'aucun ancien intervalle ne fonctionne
    setTime(timeAvailable);

    if (timeAvailable > 0) {
      intervalIdRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (newTime <= 0) {
            stopTimer(); // Arrêter le chronomètre quand le temps est écoulé
            onTimerEnd();
          }
          return newTime;
        });
      }, 1000);
    } else {
      onTimerEnd(); // Appeler directement `onTimerEnd` si le temps disponible est 0
    }
  };

  // Arrêter le chronomètre
  const stopTimer = () => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  // Réinitialiser le chronomètre avec un nouveau temps disponible
  const resetTimer = (timeAvailable) => {
    stopTimer();
    startTimer(timeAvailable);
  };

  // Appelé lorsque le temps est écoulé
  const onTimerEnd = () => {
    if (sendResponse) {
      sendResponse(-1); // Indique que le temps est écoulé
    }
  };

  // Formater le temps en mm:ss
  const formatTime = (time) => {
    const seconds = Math.floor(time % 60);
    return `${seconds.toString()}s`;
  };

  // Exposer des méthodes via la référence du parent
  useImperativeHandle(ref, () => ({
    stopTimer,
    resetTimer,
  }));

  return (
    <div>
      <div className={`text-5xl font-bold mb-4 ${time <= 5 ? "text-red-600" : "text-[#8B2DF1]"}`}>
        {formatTime(Math.max(0, time))} 
      </div>
    </div>
  );
});

export default Chrono;