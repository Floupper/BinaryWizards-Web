import React, { useState } from 'react';


export default function DifficultyQuizStars({ initialDifficulty, onDifficultyChange }) {
    const [difficultySelected, setDifficultySelected] = useState(() => {
        switch (initialDifficulty.toLowerCase()) {
            case 'easy':
                return 1;
            case 'medium':
                return 2;
            case 'hard':
                return 3;
            default:
                return 0;
        }
    });
    const handleStarClick = (index) => {
        setDifficultySelected(index + 1);
        const newDifficulty = index + 1 === 1 ? 'easy' : index + 1 === 2 ? 'medium' : 'hard';
        onDifficultyChange && onDifficultyChange(newDifficulty);
    };

    const totalStars = 3;

    const stars = Array.from({ length: totalStars }, (_, index) => (
        <span
            key={index}
            onClick={() => handleStarClick(index)}
            style={{
                cursor: 'pointer',
                color: index < difficultySelected ? 'gold' : 'lightgray',
                fontSize: '1.5em',
            }}
        >
            ★
        </span>
    ));
    return <div>{stars}</div>;
}
