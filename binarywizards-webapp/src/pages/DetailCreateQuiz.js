import React from 'react';
import { useParams } from 'react-router-dom';

export default function DetailCreateQuiz() {
    const { id } = useParams();
  return (
    <div>
      <h1>DetailCreateQuiz</h1>
      <p>quiz id : {id}</p>
    </div>
  );
}