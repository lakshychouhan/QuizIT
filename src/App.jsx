import axios from 'axios';
import React, { useEffect, useState } from 'react';

function App() {
  let [quizData, setQuizData] = useState([]);
  let [questionIndex, setQuestionIndex] = useState(0);
  let [selectedAnswer, setSelectedAnswer] = useState("");
  let [marks, setMarks] = useState(0);
  let [result, setResult] = useState(false);
  let [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    axios("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        setQuizData(res.data);
        shuffleOptions(res.data[0]); 
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // Shuffle array function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  function shuffleOptions(currentQuestion) {
    const shuffled = shuffleArray([
      ...currentQuestion.incorrectAnswers,
      currentQuestion.correctAnswer
    ]);
    setShuffledOptions(shuffled);
  }

  // Next question function
  function next() {
    if (selectedAnswer === quizData[questionIndex].correctAnswer) {
      setMarks(marks + 10);
    } else {
      console.log("wrong");
    }

    if (questionIndex < quizData.length - 1) {
      setQuestionIndex(questionIndex + 1);
      shuffleOptions(quizData[questionIndex + 1]); 
      setSelectedAnswer(""); 
    } else {
      setResult(true);
    }
  }

  return (
    <>
      <h1 className="text-center text-[4rem]">QuizIT</h1>

      <div className="quiz p-5">
        {quizData.length > 0 ? (
          !result ? (
            <div>
              <p>
                Q {questionIndex + 1} : {quizData[questionIndex].question.text}
              </p>
              <ul>
                {shuffledOptions.map((iAns, index) => (
                  <li key={index}>
                    <input
                      type="radio"
                      name="answer"
                      value={iAns}
                      checked={selectedAnswer === iAns}
                      onChange={(e) => setSelectedAnswer(e.target.value)} 
                    />
                    &nbsp; &nbsp; &nbsp;
                    <label>{iAns}</label>
                  </li>
                ))}
              </ul>

              <button className="next" onClick={next}>
                Next
              </button>
            </div>
          ) : (
            // Show result when quiz is over
            <div className="results">
              <h2 className="complete">Quiz Completed!</h2>
              <p className="score">
                Your score is: {marks} / {quizData.length * 10}
              </p>
              {marks >= 50 ? (
                <p className="pass">Pass</p>
              ) : (
                <p className="fail">Fail</p>
              )}
            </div>
          )
        ) : (
          <p>loading.. </p>
        )}
      </div>
    </>
  );
}

export default App;