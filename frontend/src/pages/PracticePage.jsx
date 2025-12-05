import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { HiCheckCircle, HiXCircle, HiArrowRight } from 'react-icons/hi2';
import './PracticePage.css';

const PracticePage = () => {
  const { user, updateUser } = useAuthStore();
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    startSession();
    return () => {
      if (sessionId) {
        completeSession();
      }
    };
  }, []);

  const startSession = async () => {
    try {
      const response = await api.post('/sessions/start', { session_type: 'practice' });
      setSessionId(response.data.session.id);
      loadQuestion();
    } catch (error) {
      console.error('Failed to start session:', error);
      setLoading(false);
    }
  };

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setShowFeedback(false);
      setSelectedAnswer('');
      setStartTime(Date.now());
      const response = await api.get('/questions/random/practice', {
        params: { level: user?.current_level || 'A1' }
      });
      setQuestion(response.data.question);
    } catch (error) {
      console.error('Failed to load question:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer) return;

    const timeTaken = Date.now() - startTime;
    try {
      const response = await api.post('/progress/answer', {
        question_id: question.id,
        answer: selectedAnswer,
        time_taken: timeTaken
      });

      setIsCorrect(response.data.isCorrect);
      setXpEarned(response.data.xpEarned);
      setShowFeedback(true);

      // Update user XP
      if (response.data.xpEarned) {
        updateUser({ total_xp: (user.total_xp || 0) + response.data.xpEarned });
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setIsCorrect(null);
    setXpEarned(0);
    loadQuestion();
  };

  const completeSession = async () => {
    if (sessionId) {
      try {
        await api.post(`/sessions/${sessionId}/complete`, {
          duration: Math.floor((Date.now() - startTime) / 1000)
        });
      } catch (error) {
        console.error('Failed to complete session:', error);
      }
    }
  };

  if (loading && !question) {
    return <div className="practice-loading">Loading question...</div>;
  }

  if (!question) {
    return <div className="practice-error">No questions available</div>;
  }

  const options = question.options ? (typeof question.options === 'string' ? JSON.parse(question.options) : question.options) : [];

  return (
    <div className="practice-page">
      <div className="practice-card">
        <div className="question-header">
          <div className="question-level-badge">{question.level}</div>
          <div className="question-topic-badge">{question.topic}</div>
        </div>

        <div className="question-content">
          <h3 className="question-text">{question.question_text}</h3>

          {question.question_type === 'multiple_choice' && (
            <div className="options-list">
              {options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${selectedAnswer === option ? 'selected' : ''} ${showFeedback && option === (typeof question.correct_answer === 'string' ? JSON.parse(question.correct_answer) : question.correct_answer) ? 'correct' : ''} ${showFeedback && selectedAnswer === option && selectedAnswer !== (typeof question.correct_answer === 'string' ? JSON.parse(question.correct_answer) : question.correct_answer) ? 'incorrect' : ''}`}
                  onClick={() => !showFeedback && setSelectedAnswer(option)}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.question_type === 'fill_blank' && (
            <div className="fill-blank-input">
              <input
                type="text"
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="Type your answer"
                disabled={showFeedback}
                className="answer-input"
              />
            </div>
          )}

          {showFeedback && (
            <div className={`feedback ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
              <div className="feedback-icon">
                {isCorrect ? <HiCheckCircle /> : <HiXCircle />}
              </div>
              <div className="feedback-content">
                <h4>{isCorrect ? 'Correct!' : 'Incorrect'}</h4>
                {isCorrect && <p className="xp-gained">+{xpEarned} XP</p>}
                {question.explanation && (
                  <p className="explanation">{question.explanation}</p>
                )}
                {question.grammar_rule && (
                  <div className="grammar-rule">
                    <strong>Grammar Rule:</strong> {question.grammar_rule}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="question-actions">
          {!showFeedback ? (
            <button
              className="btn-submit"
              onClick={submitAnswer}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : (
            <button className="btn-next" onClick={nextQuestion}>
              Next Question
              <HiArrowRight className="icon-inline" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
