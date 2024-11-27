import React, { useState } from "react";

export default function BooleanChoiceQuestion({ selectedOptionInput, setSelectedOptionInput }) {
  // correctAnserBoolean 0 -> False, else if 1-> True




  if(selectedOptionInput.correctAnswerBoolean === null){
    setSelectedOptionInput((prevState) => ({
      ...prevState,
      correctAnswerBoolean : 0, 
    }));
  
  };

  
  const handleChangeResponseSelected = (event) => {
    const id = parseInt(event.target.id, 10); // Récupère l'ID numérique
    
    if(event.target.id === 'False'){
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        correctAnswerBoolean : 0, 
      }))}
    else{
      setSelectedOptionInput((prevState) => ({
        ...prevState,
        correctAnswerBoolean : 1,
    }))
  };
  };


  return (
<>  <div>
          <input
            type="radio"
            name="toggle"
            id='False' // ID unique pour chaque radio
            checked={selectedOptionInput.correctAnswerBoolean === 0}
            onChange={handleChangeResponseSelected}/>
                    <a id='False' onClick={handleChangeResponseSelected}>False</a>
          </div>
          <div>
          <input
            type="radio"
            name="toggle"
            id='True' // ID unique pour chaque radio
            checked={selectedOptionInput.correctAnswerBoolean === 1}
            onChange={handleChangeResponseSelected}/>
          <a id='True' onClick={handleChangeResponseSelected}>True</a>
</div>
{/*}
    <div>
      {[0, 1].map((id) => (
        <div key={id} style={{ marginBottom: "10px" }}>
          <input
            type="radio"
          
            name="toggle"
            id={id.toString()} // ID unique pour chaque radio
            checked={selectedOption === id}
            onChange={handleChangeResponseSelected}
          />
          <a>
{questionOptions[id]?.option_text || null}

        </a>
        </div>
      ))}
    </div>*/}
    </>

  );

}
