import React, { useEffect, useRef, useState } from "react";

const CustomAudioPlayer = ({ src, deleteAudio, option_id, setOnSelected }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleSelected = () => {
        if (setOnSelected && option_id) {
            setOnSelected(option_id);
            audioRef.current.pause();
            setIsPlaying(false);
        }

    };

    const togglePlayPause = (event) => {
        event.stopPropagation(); // Empêche la propagation de l'événement
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        e.stopPropagation(); // Empêche la propagation de l'événement
        const time = (e.target.value / 100) * duration;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div
            className="flex flex-col items-center justify-center w-full max-w-lg p-4 bg-gray-800 rounded-lg shadow-md"
        // Clic sur la div parent
        >
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            ></audio>

            <div className="flex items-center justify-between w-full mb-2">
                {/* Bouton Lecture/Pause */}
                <button
                    onClick={(event) => togglePlayPause(event)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                >
                    {isPlaying ? "Pause" : "Lecture"}
                </button>
                {setOnSelected && (
                    <button
                        onClick={() => handleSelected()}
                        className="px-4 mx-2 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                    >
                        Sélectionner
                    </button>
                )
                }

                {/* Indicateur de temps */}
                <span className="text-sm text-gray-300">
                    {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, "0")} /{" "}
                    {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}
                </span>
            </div>

            {/* Barre de progression */}
            <input
                type="range"
                className="w-full cursor-pointer"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
            />

            {deleteAudio && (
                <button onClick={() => deleteAudio()} className="mt-2 text-sm text-gray-400">
                    Supprimer
                </button>
            )}
        </div>
    );
};

export default CustomAudioPlayer;