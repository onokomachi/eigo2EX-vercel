
import React, { useState, useEffect, useCallback } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type GameMode, type Category, type Question, type FilterableCategory } from '../../types';
import * as storageService from '../../services/storageService';

const TIME_LIMIT = 60;

interface GameScreenProps {
  settings: {
    mode: GameMode;
    category: FilterableCategory;
    questions: Question[];
  };
  onEndGame: (score: number, correctAnswers: number, totalQuestions: number, incorrect: Question[], playedQuestions: Map<number, boolean>) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ settings, onEndGame }) => {
  const { mode, questions } = settings;
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ message: string, correct: boolean } | null>(null);
  const [answered, setAnswered] = useState(false);
  const [incorrectlyAnswered, setIncorrectlyAnswered] = useState<Question[]>([]);
  const [sortAnswer, setSortAnswer] = useState<string[]>([]);
  const [playedQuestions, setPlayedQuestions] = useState<Map<number, boolean>>(new Map());
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentQIndex];

  useEffect(() => {
    if (currentQuestion && currentQuestion.options) {
      const shuffled = [...currentQuestion.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    }
  }, [currentQuestion]);

  const handleEndGame = useCallback(() => {
    const correctAnswers = playedQuestions.size > 0 ? Array.from(playedQuestions.values()).filter(Boolean).length : 0;
    onEndGame(score, correctAnswers, playedQuestions.size, incorrectlyAnswered, playedQuestions);
  }, [score, incorrectlyAnswered, onEndGame, playedQuestions]);

  useEffect(() => {
    if (mode !== 'test' && settings.category !== 'review') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleEndGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, settings.category, handleEndGame]);

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setAnswered(false);
      setFeedback(null);
      setUserInput('');
      setSortAnswer([]);
    } else {
      handleEndGame();
    }
  };

  const checkAnswer = useCallback((answer: string | string[]) => {
    if (answered) return;
    setAnswered(true);
    let isCorrect = false;
    
    if (Array.isArray(currentQuestion.answer)) { // Sort mode
        isCorrect = JSON.stringify(answer) === JSON.stringify(currentQuestion.answer);
    } else { // Select or Input mode
        isCorrect = typeof answer === 'string' && answer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    }

    setPlayedQuestions(prev => new Map(prev).set(currentQuestion.id, isCorrect));

    if (isCorrect) {
      const timeBonus = (mode !== 'test' && settings.category !== 'review') ? Math.floor(timeLeft / 6) : 0;
      const points = 10 + timeBonus;
      setScore(prev => prev + points);
      setFeedback({ message: `正解！+${points}点`, correct: true });
      storageService.clearIncorrectQuestion(currentQuestion.id);
      storageService.updateMasteryOnCorrect(currentQuestion.id);
    } else {
      setFeedback({ message: `不正解… 正解は「${Array.isArray(currentQuestion.answer) ? currentQuestion.answer.join(' ') : currentQuestion.answer}」`, correct: false });
      setIncorrectlyAnswered(prev => [...prev, currentQuestion]);
      storageService.updateMasteryOnIncorrect(currentQuestion);
    }
  }, [answered, currentQuestion, timeLeft, mode, settings.category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      checkAnswer(userInput);
    }
  };

  const handleSortClick = (option: string) => {
    setSortAnswer(prev => {
        if (prev.length === 0) {
            const capitalizedOption = option.charAt(0).toUpperCase() + option.slice(1);
            return [capitalizedOption];
        }
        return [...prev, option];
    });
  };

  const handleUndoSort = (indexToRemove: number) => {
    setSortAnswer(prev => prev.filter((_, index) => index !== indexToRemove));
  };
  
  useEffect(() => {
    const questionType = mode === 'test' ? currentQuestion.type : mode;
    if (questionType === 'sort' && currentQuestion.options && sortAnswer.length === currentQuestion.options.length) {
        checkAnswer(sortAnswer);
    }
  }, [sortAnswer, mode, currentQuestion, checkAnswer]);

  if (!currentQuestion) {
    return (
      <CyberPanel>
        <p>問題の読み込みに失敗しました。</p>
        <button onClick={handleEndGame} className="mt-4 px-4 py-2 bg-orange-500 rounded">ホームに戻る</button>
      </CyberPanel>
    );
  }

  const renderAnswerUI = () => {
    const commonButtonClass = "p-4 bg-gray-800 rounded-lg text-lg text-orange-200 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-50 transition-all";
    const commonInputClass = "w-full bg-gray-900/80 border border-orange-600 rounded-md px-4 py-3 text-white text-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-center";
    const commonSubmitButtonClass = "w-full mt-4 p-3 bg-orange-600 rounded-lg text-lg font-bold hover:bg-orange-500 disabled:bg-gray-700 transition-colors";

    const questionType = mode === 'test' ? currentQuestion.type : mode;
    
    switch(questionType) {
      case 'select':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {shuffledOptions.map((opt, i) => (
              <button key={i} onClick={() => checkAnswer(opt)} disabled={answered} className={commonButtonClass}>
                {opt}
              </button>
            ))}
          </div>
        );
      case 'input':
        return (
          <form onSubmit={handleInputSubmit} className="mt-4">
            <input type="text" value={userInput} onChange={handleInputChange} disabled={answered} className={commonInputClass} autoCapitalize="off" autoCorrect="off" />
            <button type="submit" disabled={answered} className={commonSubmitButtonClass}>
              回答
            </button>
          </form>
        );
      case 'sort':
        const remainingOptions = shuffledOptions.filter(opt => !sortAnswer.map(s => s.toLowerCase()).includes(opt.toLowerCase()));
        return (
          <div className="mt-4">
            <div className="min-h-[60px] bg-gray-900/80 p-3 rounded-md border border-orange-700 text-2xl font-bold tracking-wider flex flex-wrap gap-x-2">
              {sortAnswer.map((word, index) => (
                  <span key={index} onClick={() => !answered && handleUndoSort(index)} className="cursor-pointer hover:text-red-400 transition-colors">
                      {word}
                  </span>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
              {remainingOptions.map((opt, i) => (
                <button key={i} onClick={() => handleSortClick(opt)} disabled={answered} className="p-3 bg-gray-800 rounded-lg text-base text-orange-200 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-50 transition-all">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-4 font-orbitron text-xl">
        <div>問 {currentQIndex + 1}/{questions.length}</div>
        <div className="text-red-400 glow-accent">Score: {score}</div>
        {(mode !== 'test' && settings.category !== 'review') && <div className="text-orange-400">Time: {timeLeft}</div>}
      </div>

      {(mode !== 'test' && settings.category !== 'review') && (
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
          <div className="bg-orange-400 h-2.5 rounded-full" style={{ width: `${(timeLeft / TIME_LIMIT) * 100}%`, transition: 'width 1s linear' }}></div>
        </div>
      )}

      <CyberPanel>
        <p className="text-lg text-orange-200 mb-2">{settings.category === 'review' ? `復習: ${currentQuestion.category}` : currentQuestion.category}</p>
        <h2 className="text-3xl font-bold leading-relaxed mb-4">{currentQuestion.question}</h2>
        {currentQuestion.japanese && (
          <p className="text-lg text-gray-400 mb-6">{currentQuestion.japanese}</p>
        )}

        {!answered ? renderAnswerUI() : (
          <div className="mt-4 text-center">
            <div className={`text-3xl font-bold ${feedback?.correct ? 'text-orange-400' : 'text-red-400'}`} dangerouslySetInnerHTML={{ __html: feedback?.message.replace(/「(.*?)」/g, '「<span class="text-yellow-300">$1</span>」') || '' }} />
            <button onClick={handleNextQuestion}
              className="mt-6 w-full max-w-xs mx-auto p-3 bg-orange-600 rounded-lg text-lg font-bold hover:bg-orange-500 transition-colors">
              {currentQIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </div>
        )}
      </CyberPanel>
      <button onClick={handleEndGame} className="mt-6 text-sm text-gray-400 hover:text-white">ゲームを終了する</button>
    </div>
  );
};

export default GameScreen;