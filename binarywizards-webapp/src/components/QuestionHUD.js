export default function QuestionHUD({party_parameters}){

    return (
        <div>
            <h3>ID du quizz : {party_parameters.idquizz}</h3>
            <h3>Score : {party_parameters.score}</h3>
            <h3>Question : {party_parameters.question_index} / {party_parameters.nb_questions_total}  </h3>
        </div>
    )
}