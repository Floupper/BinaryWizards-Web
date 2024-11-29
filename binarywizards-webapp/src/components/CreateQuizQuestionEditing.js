
import CreateQuizService from '../services/CreateQuizService';
import React, { useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import {MultipleChoiceQuestion,MultipleChoiceQuestion2} from './CreateQuizQuestionEditingMultipleChoiceQuestion';
import BooleanChoiceQuestion from './CreateQuizQuestionEditingBooleanChoice';


export default function CreateQuizzQuestion({ TypeOfScreen, setModalOpen, questionId, quizId ,refreshQuizQuestions}) {
// État pour gérer l'option sélectionnée

const [selectedOptionInput, setSelectedOptionInput] = useState({
  type: 'boolean',
  choices: ['', '', '', ''],
  correctAnswerBoolean: 0,
  correctAnswerMultiple: 0
});

const [categories, setCategories] = useState([]);
const [selectedCategory, setSelectedCategory] = useState('');
const [quizDifficulty, setQuizDifficulty] = useState('');
const [difficulties, setDifficulties] = useState([]);
const [difficulty, setDifficulty] = useState('');

const [answerText, setAnswerText] = useState([]);
const [responceIndex, setResponseIndex] = useState(null);

const [questionData, setQuestionData] = useState();


const [questionType, setQuestionType] = useState('boolean');
const [questionOptions, setQuestionOptions] = useState();

const [questionText, setQuestionText]= useState('');


useEffect(() => {
  CreateQuizService.fetchCategories()
    .then(data => setCategories(data))
    .catch(error => toast.info('Error fetching categories:', error));

    CreateQuizService.fetchDifficulties()
    .then(data => setDifficulties(data))
    .catch(error => toast.info('Error fetching difficulties:', error));

  }, []);

  useEffect(() => {
    if(questionId){
    CreateQuizService.fetchQuestionDetails(quizId, questionId)
      .then(data => {
        setQuestionData(data.question);
        setQuestionOptions(data.question.options);
        setQuestionType(data.question.question_type);
        setQuestionText(data.question.question_text);
        setQuizDifficulty(data.question.question_difficulty);
        setSelectedCategory(data.question.question_category);
        // Mise à jour de `selectedOptionInput` en fonction du type
        setSelectedOptionInput((prevState) => {
          const isMultiple = data.question.question_type === 'multiple';
          
          // Si la question est de type "multiple", on prend les options textuelles,
          // sinon on initialise choices à ['','','',''] pour le type boolean
          const choices = isMultiple 
            ? data.question.options.map((option) => option.option_text)
            : ['', '', '', '']; // Initialisation à ['','','',''] pour boolean
          
          // Gestion spécifique pour le type boolean
          const correctAnswerBoolean = !isMultiple
            ? data.question.options.find((option) => option.is_correct_answer)?.option_text === 'True'
              ? 1 // Si la réponse correcte est "True", elle devient index 1
              : 0 // Sinon, c'est "False", donc index 0
            : null;
  
          return {
            ...prevState,
            type: data.question.question_type,
            choices: choices, // Tableau choisi selon le type
            correctAnswerMultiple: isMultiple
              ? data.question.options.findIndex((option) => option.is_correct_answer)
              : null, // Index de la bonne réponse pour "multiple"
            correctAnswerBoolean, // Index ajusté pour les questions "boolean"
          };
        });
      })
    
      .catch(error => toast.info('Error fetching question details:', error));
    }
  }, [questionId]);
  


// Fonction de gestion des changements
const handleOptionChange = (event) => {
  setQuestionType(event.target.value);
};

const handleCategoryChange = (event) => {
  setSelectedCategory(event.target.value);
};

const handleChangeQuestionText = (event) => {
  setQuestionText(event.target.value);
  };


  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    if (!questionText) {
      toast.error("Please enter a question.");
      return;

    }
  
    if (!quizDifficulty) {
      toast.error("Please select a difficulty.");
      return;
    }
    if (questionType === "multiple" && selectedOptionInput.choices.some(choice => !choice.trim())) {
      toast.error("Please ensure all choices are filled out.");
      return;
    }
    
    try {
      // Création des options selon le type de la question
      const options = [];
  
      if (questionType === 'boolean') {
        // Pour les questions boolean, on a juste 2 options : True et False
        options.push(
          {
            option_text: "True",
            is_correct_answer: selectedOptionInput.correctAnswerBoolean === 1, // True si la bonne réponse est True
          },
          {
            option_text: "False",
            is_correct_answer: selectedOptionInput.correctAnswerBoolean === 0, // False si la bonne réponse est False
          }
        );
      } else if (questionType === 'multiple') {
        // Pour les questions "multiple", on map les choix définis
        options.push(
          ...selectedOptionInput.choices.map((choice, index) => ({
            option_text: choice,
            is_correct_answer: selectedOptionInput.correctAnswerMultiple === index, // Vérifie l'index correct
          }))
        );
      } else {
        throw new Error("Invalid question type"); // Gère les types inattendus
      }
      

      
      // Création du corps de la requête
      const requestBody = {
        question_text: questionText,
        question_difficulty: quizDifficulty,
        question_category: selectedCategory,
        question_type: questionType,
        options: options, // Tableau des options
      };
  
      console.log(TypeOfScreen); // Debug : affiche les données envoyées
      console.log(requestBody);
      // Sélection de l'action en fonction de `TypeOfScreen`

      const action = TypeOfScreen === "edit"
        ? CreateQuizService.updateQuestion
        : CreateQuizService.createQuestion;
  
      // Appel à l'API
      await action(requestBody, quizId, questionId);
  
      // Succès
      toast.success(
        `Question successfully ${TypeOfScreen ? "updated" : "created"}!`
      );
      setModalOpen(false); // Ferme le modal
      refreshQuizQuestions(); // Actualise la liste des questions
    } catch (error) {
      // Gestion des erreurs
      toast.error(
        `Error ${TypeOfScreen ? "updating" : "creating"} question: ${
          error.message || "Unknown error"
        }`
      );
      console.error(error); // Log pour le debug
    }
  };


    return (
        <div>
    <div>
        
    <label htmlFor="question_text">Question :</label>
      <h2>  <input
          id="question_text"
          name="question_text"
          value={questionText}
          onChange={handleChangeQuestionText} // Met à jour l'état à chaque modification
          rows="4"
          cols="50"
          placeholder="Enter the question"
            className="large-input"
        /> </h2>


<div className="category">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
              <option value="" disabled>
               Select a category
               </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>


        <div className="form-group">
  <label htmlFor="difficulty">Difficulty</label>
  <select
    id="difficulty"
    value={quizDifficulty}
    onChange={(e) => setQuizDifficulty(e.target.value)}
  >
    {}
    <option value="" disabled>
      Select a difficulty
    </option>
    {difficulties.map((level) => (
      <option key={level} value={level}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </option>
    ))}
  </select>
</div>

<div>
    <form>
      <label>
        <input
          type="radio"
          name="toggle"
          value="boolean"
          checked={questionType === "boolean"}
          onChange={handleOptionChange}
        />
        Boolean
      </label>
      <label style={{ marginLeft: "10px" }}>
        <input
          type="radio"
          name="toggle"
          value="multiple"
          checked={questionType === "multiple"}
          onChange={handleOptionChange}
        />
        Multiple
      </label>
    </form>

    {/* Conteneur qui s'affiche/masque */}
    {questionType === "multiple" && (
      <div style={styles.container}>
              <label style={{ marginLeft: "10px" }}>
 
        <MultipleChoiceQuestion
        setAnswerText={setAnswerText}
        setResponseIndex={setResponseIndex}
        questionOptions={questionOptions}
        questionType={questionType}
        selectedOptionInput={selectedOptionInput}
        setSelectedOptionInput={setSelectedOptionInput}
        setQuestionOptions={setQuestionOptions}
        />
      </label>
      </div>
    )}
    {questionType === "boolean" && (
      <div style={styles.container}>
    
        <BooleanChoiceQuestion 
        selectedOptionInput={selectedOptionInput}
        setSelectedOptionInput={setSelectedOptionInput}
        
        />
      </div>
    )}
    </div>
  </div>
        <button onClick={() => setModalOpen(false)}>Fermer</button>
        <button onClick={handleSubmit}>Save Question</button>
    </div>
    )
}

const styles = {
    container: {
      marginTop: "10px",
      padding: "10px",
      border: "1px solid #ccc",
      backgroundColor: "#f9f9f9",
    },
    };