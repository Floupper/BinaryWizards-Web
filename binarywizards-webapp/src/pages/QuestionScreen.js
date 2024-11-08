import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionHUD from '../components/QuestionHUD';
import '../assets/QuestionScreen.css';

// Fonction pour récupérer les données de l'API
async function getQuestion() {
  return fetch('http://localhost:3000/quiz/123e4567-e89b-12d3-a456-426614174000/question')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      return response.json();
    })
    .catch(error => {
      throw error;
    });
}

export default function QuestionScreen() {
  const { id } = useParams();

  // États pour stocker les données du quiz
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState();
  const [nbQuestionsTotal, setNbQuestionsTotal] = useState();
  const [score, setScore] = useState();
  const [questionType, setQuestionType] = useState('');
  const [questionDifficulty, setQuestionDifficulty] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer et mettre à jour les données du quiz
  const handleFetchQuiz = async () => {
    try {
      const data = await getQuestion();
      setQuizData(data); // Stocke toutes les données du quiz

      // Mise à jour des autres états avec les données reçues
      setQuestionText(data.question_text);
      setOptions(data.options);
      setQuestionIndex(data.question_index);
      setNbQuestionsTotal(data.nb_questions_total);
      setScore(data.score);
      setQuestionType(data.question_type);
      setQuestionDifficulty(data.question_difficulty);
      setQuestionCategory(data.question_category);

    } catch (error) {
      setError(error.message); // Si erreur, on la gère
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Utilisation de useEffect pour appeler la fonction lors du montage du composant
  useEffect(() => {
    handleFetchQuiz();
  }, []); // Dépendance vide signifie que l'effet s'exécute une seule fois au montage

  // Fonction qui sera appelée au clic sur le bouton pour recharger les données
  const handleReload = () => {
    setLoading(true); // Mettre l'état de chargement à vrai
    handleFetchQuiz(); // Re-appeler la fonction pour récupérer les nouvelles données
  };

  // Paramètres à passer au composant QuestionHUD
  const paramHUD = {
    idquizz: id,
    score: score,
    question_index: questionIndex,
    nb_questions_total: nbQuestionsTotal,
  };

  // Affichage pendant le chargement ou en cas d'erreur
  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <div className="HUD">
        <QuestionHUD party_parameters={paramHUD} />
        <pre>{JSON.stringify(quizData, null, 2)}</pre> {/* Affichage des données JSON pour le débogage */}
      </div>

      {/* Bouton pour recharger les données */}
      <button onClick={handleReload}>Valider</button>

    </div>
  );
}
