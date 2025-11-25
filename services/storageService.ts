

import { type Stats, type GameResult, type IncorrectQuestion, type Category, type Question, type UserInfo, type MasteryData, type MissionState, type MasteryInfo } from '../types';

const STATS_KEY = 'eigoHackStats';
const INCORRECT_QUESTIONS_KEY = 'eigoHackIncorrectQuestions';
const USER_INFO_KEY = 'eigoHackUserInfo';
const MASTERY_KEY = 'eigoHackMastery';
const MISSIONS_KEY = 'eigoHackDailyMissions';

const defaultStats: Stats = {
  totalPlays: 0,
  lifetimeScore: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  level: 1,
  exp: 0,
  categoryStats: {
    '未来': { correct: 0, total: 0 },
    '動名詞': { correct: 0, total: 0 },
    '不定詞': { correct: 0, total: 0 },
    '助動詞【must】': { correct: 0, total: 0 },
    '助動詞【have to】': { correct: 0, total: 0 },
    '助動詞【その他】': { correct: 0, total: 0 },
    '比較': { correct: 0, total: 0 },
    'there is': { correct: 0, total: 0 },
    '接続詞': { correct: 0, total: 0 },
    '受け身': { correct: 0, total: 0 },
    '現在完了': { correct: 0, total: 0 },
    '現在完了進行形': { correct: 0, total: 0 },
    '不定詞2': { correct: 0, total: 0 },
    'その他': { correct: 0, total: 0 },
  },
};

// --- User Info Management ---
export const saveUserInfo = (userInfo: UserInfo) => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

export const getUserInfo = (): UserInfo | null => {
  try {
    const stored = localStorage.getItem(USER_INFO_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to parse user info:", error);
    return null;
  }
};

export const clearUserInfo = () => {
  localStorage.removeItem(USER_INFO_KEY);
};

// --- Stats Management ---
export const getStats = (): Stats => {
  try {
    const storedStats = localStorage.getItem(STATS_KEY);
    if (storedStats) {
      const parsed = JSON.parse(storedStats);
      const mergedCategoryStats = { ...defaultStats.categoryStats, ...parsed.categoryStats };
      return { ...defaultStats, ...parsed, categoryStats: mergedCategoryStats };
    }
  } catch (error) {
    console.error("Failed to parse stats from localStorage:", error);
  }
  return { ...defaultStats };
};

export const saveStats = (stats: Stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const saveGameResult = (result: GameResult, newIncorrectQuestions: IncorrectQuestion[], questionsPlayed: Question[]) => {
  const stats = getStats();

  stats.totalPlays += 1;
  stats.lifetimeScore += result.score;
  stats.totalCorrect += result.correctAnswers;
  stats.totalAnswered += result.totalQuestions;

  const incorrectIds = new Set(newIncorrectQuestions.map(q => q.id));

  questionsPlayed.forEach(question => {
    const category = question.category;
    if (stats.categoryStats[category]) {
      stats.categoryStats[category].total += 1;
      if (!incorrectIds.has(question.id)) {
        stats.categoryStats[category].correct += 1;
      }
    }
  });

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  newIncorrectQuestions.forEach(addIncorrectQuestion);
};


export const addIncorrectQuestion = (question: IncorrectQuestion) => {
  let incorrect = getIncorrectQuestions();
  if (!incorrect.some(q => q.id === question.id)) {
    incorrect.push(question);
    localStorage.setItem(INCORRECT_QUESTIONS_KEY, JSON.stringify(incorrect));
  }
};


export const getIncorrectQuestions = (): IncorrectQuestion[] => {
  try {
    const stored = localStorage.getItem(INCORRECT_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to parse incorrect questions:", error);
    return [];
  }
};

export const clearIncorrectQuestion = (questionId: number) => {
  let incorrect = getIncorrectQuestions();
  incorrect = incorrect.filter(q => q.id !== questionId);
  localStorage.setItem(INCORRECT_QUESTIONS_KEY, JSON.stringify(incorrect));
};

export const clearAllData = () => {
  localStorage.removeItem(STATS_KEY);
  localStorage.removeItem(INCORRECT_QUESTIONS_KEY);
  localStorage.removeItem(MASTERY_KEY);
  localStorage.removeItem(MISSIONS_KEY);
};


// --- Mastery Management ---

const getMasteryDefault = (): MasteryData => ({});

export const getMasteryData = (): MasteryData => {
    try {
        const stored = localStorage.getItem(MASTERY_KEY);
        return stored ? JSON.parse(stored) : getMasteryDefault();
    } catch (error) {
        console.error("Failed to parse mastery data:", error);
        return getMasteryDefault();
    }
};

const saveMasteryData = (data: MasteryData) => {
    localStorage.setItem(MASTERY_KEY, JSON.stringify(data));
};

const getNextReviewDate = (streak: number): string => {
    const intervals = [1, 2, 5, 10, 21, 45, 90]; // Spaced repetition intervals in days
    const daysToAdd = streak >= intervals.length ? intervals[intervals.length - 1] : intervals[streak];
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toISOString().split('T')[0];
};

export const updateMasteryOnCorrect = (questionId: number) => {
    const masteryData = getMasteryData();
    const entry = masteryData[questionId] || { level: 'unseen', streak: 0, nextReviewDate: '' };
    
    entry.streak++;
    entry.nextReviewDate = getNextReviewDate(entry.streak);

    if (entry.streak >= 5) {
        entry.level = 'mastered';
    } else if (entry.streak > 0) {
        entry.level = 'reviewing';
    }

    masteryData[questionId] = entry;
    saveMasteryData(masteryData);
};

export const updateMasteryOnIncorrect = (question: Question) => {
    const masteryData = getMasteryData();
    const entry = masteryData[question.id] || { level: 'unseen', streak: 0, nextReviewDate: '' };

    entry.streak = 0;
    entry.level = 'learning';
    entry.nextReviewDate = getNextReviewDate(0); // Review tomorrow

    masteryData[question.id] = entry;
    saveMasteryData(masteryData);
    addIncorrectQuestion({id: question.id, question: question.question, answer: question.answer});
};

// --- Mission Management ---

export const getMissionState = (): MissionState | null => {
    try {
        const stored = localStorage.getItem(MISSIONS_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch (error) {
        console.error("Failed to parse mission state:", error);
        return null;
    }
};

export const saveMissionState = (state: MissionState) => {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(state));
};