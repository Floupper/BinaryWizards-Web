import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function DetailCreateQuiz() {
    const { id } = useParams();
  return (
    <div>
      <Navbar />
      <h1>DetailCreateQuiz</h1>
      <p>quiz id : {id}</p>
    </div>
  );
}