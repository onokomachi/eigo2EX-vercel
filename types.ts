

export type GameMode = 'select' | 'input' | 'sort' | 'test';
export type QuestionType = 'select' | 'input' | 'sort';

export type Category = 
  | '未来'
  | '動名詞'
  | '不定詞'
  | '助動詞【must】'
  | '助動詞【have to】'
  | '助動詞【その他】'
  | '比較'
  | 'there is'
  | '接続詞'
  | '受け身'
  | '現在完了'
  | '現在完了進行形'
  | '不定詞2'
  | 'その他';
export type FilterableCategory = Category | 'all' | 'weakness' | 'review';
export type FilterableQuestionType = QuestionType | 'all';


// --- User Info ---
export interface UserInfo {
  grade: string;
  class: string;
  studentId: string;
}

// --- App Settings ---
export interface AppSettings {
  showLogoutButton: boolean;
  showResetButton: boolean;
}

// --- Main Types ---

export interface Question {
  id: number;
  category: Category;
  question: string;
  japanese?: string; // 問題文の和訳（オプショナル）
  answer: string | string[];
  options?: string[];
  type: QuestionType;
}

export interface GameResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  comment: string;
}

export interface Stats {
  totalPlays: number;
  lifetimeScore: number;
  totalCorrect: number;
  totalAnswered: number;
  categoryStats: Record<Category, { correct: number; total: number }>;
  level: number;
  exp: number;
}

export interface IncorrectQuestion {
  id: number;
  question: string;
  answer: string | string[];
}

export interface RankingEntry {
  timestamp: string;
  name: string;
  score: number;
  grade: string;
  class: string;
  studentId: string;
  category: Category | 'weakness';
  mode: GameMode;
}

// --- Class Ranking ---
export interface ClassRankingEntry {
  grade: string;
  class: string;
  averageMaxScore: number;
  studentCount: number;
}


export type Screen = 
  | 'login'
  | 'home' 
  | 'game' 
  | 'results' 
  | 'mypage' 
  | 'ranking' 
  | 'teacher_login' 
  | 'teacher_panel'
  | 'confirmation';

export interface ConfirmationState {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// --- New Mastery and Mission Types ---
export type MasteryLevel = 'unseen' | 'learning' | 'reviewing' | 'mastered';
export interface MasteryInfo {
  level: MasteryLevel;
  nextReviewDate: string; // ISO string date YYYY-MM-DD
  streak: number; // consecutive correct answers
}
export interface MasteryData {
  [questionId: number]: MasteryInfo;
}

export type MissionType = 'solve_category' | 'get_rank' | 'answer_total' | 'perfect_game';
export interface DailyMission {
  id: string;
  type: MissionType;
  description: string;
  target: number;
  progress: number;
  completed: boolean;
  expReward: number;
  category?: Category | 'all';
  rank?: GameResult['rank'];
}

export interface MissionState {
    date: string; // YYYY-MM-DD
    missions: DailyMission[];
}

// --- Challenge Types ---
export interface ChallengePeerInfo {
  grade: string;
  class: string;
  studentId: string;
  name: string;
}

export interface ChallengeEntry {
  challengeId: string;
  challenger: ChallengePeerInfo;
  opponent: ChallengePeerInfo;
  category: FilterableCategory;
  mode: GameMode;
  targetScore: number;
  questionIds: number[];
  status: 'pending' | 'accepted' | 'completed' | 'declined';
  challengerTimestamp: string;
  resultScore?: number;
  opponentTimestamp?: string;
}


// --- Diagram Info Types ---

export type WeatherSymbol = 'kaisei' | 'hare' | 'kumori' | 'ame' | 'yuki' | 'kiri' | 'hyou' | 'arare' | 'kaminari' | 'mizore';

export interface JapaneseWeatherSymbolInfo {
  weather: WeatherSymbol;
}

export interface CircuitDiagramInfo {
  layout: 'series' | 'parallel';
  voltage: { value: number };
  resistances: Array<{ value: number | string; label?: string }>;
  currents: Array<{ point: string; value: number | string }>;
}

export interface MeterDiagramInfo {
  meterType: 'ammeter' | 'voltmeter';
  unit: string;
  maxValue: number;
  value: number;
}

interface ResistorInfo {
    value: number | string;
    label?: string;
}

export interface MixedCircuitDiagramInfo {
  voltage: { value: number };
  resistances: {
    r1: ResistorInfo;
    r2: ResistorInfo;
    r3: ResistorInfo;
  };
}

interface VaporPoint {
    temp: number;
    amount: number;
}

export interface SaturationVaporCurveInfo {
  curvePoints: VaporPoint[];
  currentPoint: VaporPoint;
  dewPointTemp?: number;
}


// --- Backend Communication Types ---

export interface PlayLogEntry {
  timestamp: string;
  grade: string;
  class: string;
  studentId: string;
  questionId: number;
  isCorrect: boolean;
}

// --- Teacher Panel Analytics Types ---
export interface AnalyticsData {
  scope: {
    grade: string;
    class?: string;
    studentId?: string;
  };
  totalPlays: number;
  totalAnswered: number;
  totalCorrect: number;
  correctRate: number;
  categoryStats: Record<Category, { correct: number; total: number; correctRate: number }>;
  incorrectQuestions: Array<{
    id: number;
    question: string;
    category: Category;
    type: QuestionType;
    count: number;
  }>;
  heatmap: Record<Category, Record<QuestionType, { correct: number; total: number }>>;
}