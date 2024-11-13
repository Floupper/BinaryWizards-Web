export async function GetQuestion(id_quizz) {
    return fetch(`http://klebert-host.com:33012/quiz/${id_quizz}/question`)
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
  

  export async function PostAnswers(id_quizz, index_question, index_reponse) {
    const quizQuestionPost = {
      question_index: index_question,
      option_index: index_reponse,
    };
  
    return fetch(`http://klebert-host.com:33012/quiz/${id_quizz}/question`, {
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