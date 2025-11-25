import { type Category, type Question } from '../types';
import futureQuestions from './01_future';
import gerundsQuestions from './02_gerunds';
import infinitivesQuestions from './03_infinitives';
import auxiliariesOthersQuestions from './04_auxiliaries';
import auxiliariesMustQuestions from './04_auxiliaries_must';
import auxiliariesHaveToQuestions from './04_auxiliaries_have_to';
import comparisonQuestions from './05_comparison';
import thereIsQuestions from './06_there_is';
import conjunctionsQuestions from './07_conjunctions';
import passiveQuestions from './08_passive';
import presentPerfectQuestions from './09_present_perfect';
import presentPerfectProgressiveQuestions from './10_present_perfect_progressive';
import infinitives2Questions from './11_infinitives_2';
import othersQuestions from './12_others';

// Aggregate all questions into one array
const allQuestions: Question[] = [
  ...futureQuestions,
  ...gerundsQuestions,
  ...infinitivesQuestions,
  ...auxiliariesOthersQuestions,
  ...auxiliariesMustQuestions,
  ...auxiliariesHaveToQuestions,
  ...comparisonQuestions,
  ...thereIsQuestions,
  ...conjunctionsQuestions,
  ...passiveQuestions,
  ...presentPerfectQuestions,
  ...presentPerfectProgressiveQuestions,
  ...infinitives2Questions,
  ...othersQuestions,
];

// Create a map for easy category-based retrieval
const allQuestionsByCategory: Record<Category, Question[]> = {
  '未来': futureQuestions,
  '動名詞': gerundsQuestions,
  '不定詞': infinitivesQuestions,
  '助動詞【must】': auxiliariesMustQuestions,
  '助動詞【have to】': auxiliariesHaveToQuestions,
  '助動詞【その他】': auxiliariesOthersQuestions,
  '比較': comparisonQuestions,
  'there is': thereIsQuestions,
  '接続詞': conjunctionsQuestions,
  '受け身': passiveQuestions,
  '現在完了': presentPerfectQuestions,
  '現在完了進行形': presentPerfectProgressiveQuestions,
  '不定詞2': infinitives2Questions,
  'その他': othersQuestions,
};

// Synchronous function to get all questions
export const getAllQuestions = (): Question[] => {
  return allQuestions;
};

// Synchronous function to get questions for a specific category
export const getQuestionsForCategory = (category: Category): Question[] => {
  return allQuestionsByCategory[category] || [];
};