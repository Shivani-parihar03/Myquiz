import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { startQuiz, submitQuiz } from '../service/api';
import './home.css';

const Home = () => {
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("username");
    const fetchQuiz = async () => {
      const payload = { username: user };
      try {
        const data = await startQuiz(payload);
   
        if (data.completed == false) {
       
          const selectedQuestions = data.questions.slice(0, 15);
          setQuiz({ ...data, questions: selectedQuestions });
        }
        else{
          
          setShowResults(true);
          setCompleted(true);
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchQuiz();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      handleNext();
    }
  }, [timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value });

    const correctAnswer = quiz.questions[currentQuestionIndex].correctAnswer;
    if (value === correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(60);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeLeft(60);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const data = await submitQuiz(quiz._id, answers);
      setQuiz(data);
      setShowResults(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <ul>
          <li>
            <button onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('username'); navigate('/'); }}>Logout</button>
          </li>
        </ul>
      </nav>
      {error && <p className="error">{error}</p>}
      {quiz ?  ( completed ? (
          <div className="results-container">
            <h2>Quiz Completed</h2>
            <p>Your Score: {score}/{quiz.questions.length}</p>
            <p>You have already completed the quiz.</p>
            <button onClick={() => navigate('/')}>Go to Home</button>
          </div>
        ) : (
          showResults ? (
            <div className="results-container">
              <h2>Quiz Results</h2>
              <p>Your Score: {score}/{quiz.questions.length}</p>
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[index.toString()];
                const isCorrect = userAnswer === question.correctAnswer;
                return (
                  <div key={index} >
                    <p><strong>Q{index + 1}:</strong> {question.question}</p>
                    <p className={`result-question ${isCorrect ? 'correct' : 'incorrect'}`}><strong>Your Answer:</strong> {userAnswer}</p>
                    {!isCorrect && <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>}
                  </div>
                );
              })}
              <button onClick={() => navigate('/')}>Go to Home</button>
            </div>
          ) : (
          <div className="quiz-container">
            <div className="sidebar">
              <div className="score">
                <p>Score: {score}</p>
              </div>
              <div className="timer">Time Left: {timeLeft}s</div>
              <div className="questions-left">Question {currentQuestionIndex + 1}/{quiz.questions.length}</div>
            </div>
            <form className="quiz-form" onSubmit={handleSubmit}>
              <h2>Question {currentQuestionIndex + 1}/{quiz.questions.length}</h2>
              <div className="question">
                <p>{quiz.questions[currentQuestionIndex].question}</p>
                {quiz.questions[currentQuestionIndex].options.map((option, i) => (
                  <div key={i} className="option">
                    <input
                      type="radio"
                      id={`${currentQuestionIndex}-${i}`}
                      name={currentQuestionIndex.toString()}
                      value={option}
                      checked={answers[currentQuestionIndex.toString()] === option}
                      onChange={handleChange}
                      required
                    />
                    <label htmlFor={`${currentQuestionIndex}-${i}`}>{option}</label>
                  </div>
                ))}
              </div>
              <div className="navigation-buttons">
                <button
                  className="navigation-buttons"
                  type="button"
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                >
                  Back
                </button>
                {currentQuestionIndex < quiz.questions.length - 1 && (
                  <button className="navigation-buttons" type="button" onClick={handleNext}>
                    Next
                  </button>
                )}
                {currentQuestionIndex === quiz.questions.length - 1 && (
                  <button className="navigation-buttons" type="submit">Submit</button>
                )}
              </div>
            </form>
          </div>
        )
        )
        
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Home;
