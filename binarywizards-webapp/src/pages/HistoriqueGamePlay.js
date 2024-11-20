import React from 'react';
import { useParams } from 'react-router-dom';

export default function HistoriqueGamePlay() {
    const { quizId } = useParams();
  return (
    <div>
      <h1>Historique des parties</h1>
      <p>quiz id : {quizId}</p>
    </div>
  );
}