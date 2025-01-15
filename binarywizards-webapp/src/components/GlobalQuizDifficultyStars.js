import React, { useState, useEffect } from 'react';

export default function DifficultyQuizStars({ initialDifficulty, onDifficultyChange }) {
    // Initialiser difficultySelected en fonction de initialDifficulty et mettre à jour lorsqu'il change
    const [difficultySelected, setDifficultySelected] = useState(() => {
        switch (initialDifficulty.toLowerCase()) {
            case 'easy':
                return 1;
            case 'medium':
                return 2;
            case 'hard':
                return 3;
            default:
                return 0; // Si aucune difficulté n'est spécifiée, on met 0 par défaut
        }
    });

    // Utiliser useEffect pour synchroniser difficultySelected avec initialDifficulty
    useEffect(() => {
        switch (initialDifficulty.toLowerCase()) {
            case 'easy':
                setDifficultySelected(1);
                break;
            case 'medium':
                setDifficultySelected(2);
                break;
            case 'hard':
                setDifficultySelected(3);
                break;
            default:
                setDifficultySelected(0);
        }
    }, [initialDifficulty]); // Ce useEffect se déclenche chaque fois que initialDifficulty change

    const handleStarClick = (index) => {
        if (onDifficultyChange) {
            setDifficultySelected(index + 1);
            const newDifficulty =
                index + 1 === 1 ? 'easy' : index + 1 === 2 ? 'medium' : 'hard';
            onDifficultyChange(newDifficulty);
        }
    };

    const totalStars = 3;

    const stars = Array.from({ length: totalStars }, (_, index) => (
        <span
            key={index}
            onClick={() => handleStarClick(index)}
            style={{
                cursor: onDifficultyChange ? 'pointer' : 'default',
                color: index < difficultySelected ? 'gold' : 'lightgray',
                fontSize: '1.5em',
            }}
        >
            ★
        </span>
    ));

    return <div>{stars}</div>;
}
