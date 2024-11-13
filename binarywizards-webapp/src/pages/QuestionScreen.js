import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionHUD from '../components/QuestionHUD';
import QuestionChoiceMultiple from '../components/QuestionChoiceMultiple';
import '../assets/QuestionScreen.css';

// Fonction pour récupérer les données de l'API
async function GetQuestion(id_quizz) {
  return fetch(`http://localhost:3000/quiz/${id_quizz}/question`)
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

async function PostAnswers(id_quizz, index_question, index_reponse) {
  const quizQuestionPost = {
    question_index: index_question,
    option_index: index_reponse,
  };

  return fetch(`http://localhost:3000/quiz/${id_quizz}/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quizQuestionPost),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des réponses');
      }
      return response.json();
    })
    .catch(error => {
      console.error('Error sending response:', error);
      throw error;
    });
}

export default function QuestionScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // États pour stocker les données du quiz
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState();
  const [nbQuestionsTotal, setNbQuestionsTotal] = useState();
  const [score, setScore] = useState();
  const [questionType, setQuestionType] = useState('');
  const [questionDifficulty, setQuestionDifficulty] = useState('');
  const [questionCategory, setQuestionCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false); // État pour bloquer la soumission multiple

  // Fonction pour récupérer et mettre à jour les données du quiz
  const handleFetchQuiz = async () => {
    try {
      const data = await GetQuestion(id);

      // Vérifie si le quiz est terminé
      if (data.quizz_finished) {
        navigate('/end-quizz'); // Redirige vers la page de fin du quiz
        return;
      }

      // Mise à jour des états avec les données reçues si le quiz n'est pas terminé
      setQuestionText(data.question_text);
      setOptions(data.options);
      setQuestionIndex(data.question_index);
      setNbQuestionsTotal(data.nb_questions_total);
      setScore(data.score);
      setQuestionType(data.question_type);
      setQuestionDifficulty(data.question_difficulty);
      setQuestionCategory(data.question_category);
      setSelectedQuestionId(null); // Réinitialiser la sélection
      setIsAnswered(false); // Réinitialise l'état d'envoi pour la nouvelle question

    } catch (error) {
      setError(error.message); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    handleFetchQuiz();
  }, []); 

  // Soumettre la réponse lors de la sélection d'une option
  const handleQuestionSelect = async (selectedId) => {
    if (!isAnswered) { // Vérifie si une réponse n'a pas déjà été envoyée
      setSelectedQuestionId(selectedId); // Met à jour la réponse sélectionnée
      setIsAnswered(true); // Marque que la réponse a été envoyée

      try {
        await PostAnswers(id, questionIndex, selectedId); // Envoie la réponse via POST
      } catch (error) {
        setError('Erreur lors de l\'envoi des réponses');
      }
    }
  };

  // Charger la question suivante lors de l'appui sur "Passer à la question suivante"
  const handleReload = () => {
    setLoading(true);
    handleFetchQuiz(); // Charger la prochaine question
  };

  const paramHUD = {
    idquizz: id,
    score: score,
    question_index: questionIndex,
    nb_questions_total: nbQuestionsTotal,
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="QuestionScreen">
      <div className="HUD">
        <QuestionHUD party_parameters={paramHUD} />
      </div>
      
      <h1 className="Question">{questionText}</h1>
      
      <div className="Answers">    
        <QuestionChoiceMultiple 
          question_choice={options} 
          onQuestionSelect={handleQuestionSelect} 
          selectedQuestionId={selectedQuestionId}
          isAnswered={isAnswered}  // Passer l'état de la réponse envoyée
        />
        
        <button 
          className={`validate-button ${!isAnswered ? 'disabled' : ''}`}
          onClick={handleReload}
          disabled={!isAnswered}  // Désactive le bouton si aucune réponse n'est sélectionnée
        >
          Passer à la question suivante
        </button>
      </div>
        
      <p>ID de la question sélectionnée : {selectedQuestionId}</p>
    </div>
  );
}
