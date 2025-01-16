import React, { useEffect, useRef, useState } from "react";

const CustomAudioPlayer = ({ src, deleteAudio, option_id, setOnSelected }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const handleSelected = () => {
        if (setOnSelected && option_id !== null) {
            setOnSelected(option_id);
            if (audioRef.current) {
                audioRef.current.pause();
            }
            setIsPlaying(false);
        }
    };

    const togglePlayPause = (event) => {
        event.stopPropagation();
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const time = (e.target.value / 100) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    return (
        <div
            className="flex flex-col items-center justify-center w-full max-w-lg p-4 bg-gray-800 rounded-lg shadow-md"
            role="region"
            aria-label="Custom audio player"
        >
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            ></audio>

            <div className="flex items-center justify-between w-full mb-2">
                <button
                    onClick={togglePlayPause}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                    aria-label={isPlaying ? "Pause audio" : "Play audio"}
                >
                    {isPlaying ? "Pause" : "Play"}
                </button>

                {setOnSelected && (
                    <button
                        onClick={handleSelected}
                        className="px-4 mx-2 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
                        aria-label="Select this option"
                    >
                        Select
                    </button>
                )}

                <span className="text-sm text-gray-300">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>

            <input
                type="range"
                className="w-full cursor-pointer"
                min="0"
                max="100"
                value={(currentTime / duration) * 100 || 0}
                onChange={handleSeek}
                aria-label="Audio progress bar"
            />

            {deleteAudio && (
                <button
                    onClick={deleteAudio}
                    className="mt-2 text-sm text-gray-400 hover:text-white"
                    aria-label="Delete this audio"
                >
                    Delete
                </button>
            )}
        </div>
    );
};

export default CustomAudioPlayer;