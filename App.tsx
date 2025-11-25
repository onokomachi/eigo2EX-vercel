

import React, { useState, useEffect, useCallback } from 'react';
import { type Screen, type GameMode, type Category, type Question, type GameResult, type IncorrectQuestion, type UserInfo, type PlayLogEntry, type ConfirmationState, type MissionState, type DailyMission, type FilterableCategory, type Stats, type ChallengeEntry, type ChallengePeerInfo, type AppSettings } from './types';
import * as storageService from './services/storageService';
import { getQuestionsForCategory, getAllQuestions } from './data';
import { GAS_WEB_APP_URL } from './constants';

import LoginScreen from './components/screens/LoginScreen';
import HomeScreen from './components/screens/HomeScreen';
import GameScreen from './components/screens/GameScreen';
import ResultsScreen from './components/screens/ResultsScreen';
import MyPageScreen from './components/screens/MyPageScreen';
import RankingScreen from './components/screens/RankingScreen';
import TeacherLoginScreen from './components/screens/TeacherLoginScreen';
import TeacherScreen from './components/screens/TeacherScreen';
import ConfirmationScreen from './components/screens/ConfirmationScreen';
import CyberPanel from './components/ui/CyberPanel';

const EXP_FOR_NEXT_LEVEL = (level: number) => 100 + (level - 1) * 50;

const App: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [screen, setScreen] = useState<Screen>('login');
  const [gameSettings, setGameSettings] = useState<{ mode: GameMode; category: FilterableCategory; questions: Question[] } | null>(null);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState | null>(null);
  const [lastPlayLogs, setLastPlayLogs] = useState<PlayLogEntry[]>([]);
  const [missionState, setMissionState] = useState<MissionState | null>(null);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  
  // Popups
  const [showExpGain, setShowExpGain] = useState<{ description: string, exp: number }[] | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<{ oldLevel: number, newLevel: number } | null>(null);
  
  // Challenge states
  const [challenges, setChallenges] = useState<ChallengeEntry[]>([]);
  const [isFetchingChallenges, setIsFetchingChallenges] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState<ChallengeEntry | null>(null);

  useEffect(() => {
    const savedUserInfo = storageService.getUserInfo();
    if (savedUserInfo) {
      handleLogin(savedUserInfo);
    }
  }, []);

  const fetchAppSettings = async () => {
      try {
        const params = new URLSearchParams({ action: 'getAppSettings' });
        const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch app settings');
        const data = await response.json();
        if (data.success) {
          setAppSettings(data.settings);
        } else {
           console.error('Could not fetch app settings:', data.message);
           // Set default settings if fetch fails
           setAppSettings({ showLogoutButton: false, showResetButton: false });
        }
      } catch (error) {
        console.error('Error fetching app settings:', error);
        setAppSettings({ showLogoutButton: false, showResetButton: false });
      }
    };
  
  const fetchChallenges = async (info: UserInfo) => {
    setIsFetchingChallenges(true);
    try {
        const params = new URLSearchParams({
            action: 'getChallenges',
            userInfo: JSON.stringify(info)
        });
        const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`, {
            method: 'GET',
            mode: 'cors',
        });
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        if (data.success) {
            setChallenges(data.challenges || []);
        } else {
            console.error('Failed to fetch challenges:', data.message);
            setChallenges([]);
        }
    } catch (error) {
        console.error('Error fetching challenges:', error);
        setChallenges([]);
    } finally {
        setIsFetchingChallenges(false);
    }
  };

  const handleLogin = (info: UserInfo) => {
    setUserInfo(info);
    storageService.saveUserInfo(info);
    initializeMissions();
    fetchChallenges(info);
    fetchAppSettings();
    setScreen('home');
  };
  
  const handleLogout = () => {
    setUserInfo(null);
    storageService.clearUserInfo();
    setChallenges([]);
    setAppSettings(null);
    setScreen('login');
  }

  const initializeMissions = () => {
    let currentMissions = storageService.getMissionState();
    const todayStr = new Date().toISOString().split('T')[0];
    if (!currentMissions || currentMissions.date !== todayStr) {
        const stats = storageService.getStats();
        currentMissions = generateDailyMissions(stats);
        storageService.saveMissionState(currentMissions);
    }
    setMissionState(currentMissions);
  };

  const generateDailyMissions = (stats: Stats): MissionState => {
      const allCategories = ['未来', '動名詞', '不定詞', '助動詞', '比較', 'there is', '接続詞', '受け身', '現在完了', '現在完了進行形', '不定詞2'] as Category[];
      const missions: DailyMission[] = [];

      const playedCategories = allCategories.filter(cat => stats.categoryStats[cat]?.total > 2);
      if (playedCategories.length > 0) {
          const weakCategory = playedCategories.sort((a, b) => 
              (stats.categoryStats[a].correct / stats.categoryStats[a].total) - 
              (stats.categoryStats[b].correct / stats.categoryStats[b].total)
          )[0];
          missions.push({
              id: 'cat_1', type: 'solve_category', description: `「${weakCategory}」の問題を5問正解しよう`,
              target: 5, progress: 0, completed: false, category: weakCategory, expReward: 75
          });
      } else {
          missions.push({
              id: 'cat_generic_1', type: 'solve_category', description: `好きな分野の問題を10問正解しよう`,
              target: 10, progress: 0, completed: false, category: 'all', expReward: 50
          });
      }

      missions.push({
          id: 'rank_1', type: 'get_rank', description: `Bランク以上を1回取ろう`,
          target: 1, progress: 0, completed: false, rank: 'B', expReward: 100
      });

      missions.push({
          id: 'total_1', type: 'answer_total', description: '合計20問に解答しよう',
          target: 20, progress: 0, completed: false, expReward: 50
      });
      
      return {
          date: new Date().toISOString().split('T')[0],
          missions: missions.slice(0, 3).sort(() => Math.random() - 0.5),
      };
  };

  const startGame = useCallback((mode: GameMode, category: FilterableCategory, questionIds?: number[]) => {
    let questionsPool: Question[] = [];
    const allQuestions = getAllQuestions();
    
    if (questionIds) {
        const questionMap = new Map(allQuestions.map(q => [q.id, q]));
        questionsPool = questionIds.map(id => questionMap.get(id)).filter((q): q is Question => !!q);
    } else if (category === 'review') {
        const masteryData = storageService.getMasteryData();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const reviewIds = Object.keys(masteryData)
            .filter(id => {
                const entry = masteryData[Number(id)];
                return entry.level !== 'mastered' && new Date(entry.nextReviewDate) <= today;
            })
            .map(Number);
        
        questionsPool = allQuestions.filter(q => reviewIds.includes(q.id));
        if (questionsPool.length === 0) {
            alert('本日の復習問題はありません。素晴らしい！');
            return;
        }
    } else if (category === 'weakness') {
      const incorrect = storageService.getIncorrectQuestions();
      const incorrectIds = new Set(incorrect.map(q => q.id));
      questionsPool = allQuestions.filter(q => incorrectIds.has(q.id));
    } else if (category === 'all') {
      questionsPool = allQuestions;
    } else {
      questionsPool = getQuestionsForCategory(category);
    }
    
    let filteredQuestions: Question[];
    if (mode === 'select' || mode === 'input' || mode === 'sort') {
      filteredQuestions = questionsPool.filter(q => q.type === mode);
    } else {
      filteredQuestions = questionsPool;
    }
    
    const selectedQuestions = questionIds ? filteredQuestions : filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 20);

    if (selectedQuestions.length > 0) {
      setGameSettings({ mode, category, questions: selectedQuestions });
      setScreen('game');
    } else {
      alert('このカテゴリまたはモードには問題がありません。');
    }
  }, []);

  const handleAcceptChallenge = (challenge: ChallengeEntry) => {
    setActiveChallenge(challenge);
    startGame(challenge.mode, challenge.category, challenge.questionIds);
  };
  
  const handleDeclineChallenge = async (challengeId: string) => {
    setChallenges(prev => prev.filter(c => c.challengeId !== challengeId));
    try {
        await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'updateChallenge', challengeId, status: 'declined' }),
            headers: {'Content-Type': 'text/plain;charset=utf-8'},
            mode: 'cors'
        });
    } catch (error) {
        console.error('Failed to decline challenge:', error);
    }
  };
  
  const handleMissionUpdatesAndExp = (result: GameResult, settings: typeof gameSettings) => {
    const currentMissionState = storageService.getMissionState();
    if (!currentMissionState) return;

    const currentStats = storageService.getStats();
    let totalExpGained = 0;
    const newlyCompletedMissions: { description: string, exp: number }[] = [];

    const updatedMissions = currentMissionState.missions.map(mission => {
        if (mission.completed) return mission;
        
        let progressIncrement = 0;
        switch(mission.type) {
            case 'answer_total':
                progressIncrement = result.totalQuestions;
                break;
            case 'solve_category':
                const isRankableCategory = settings?.category !== 'weakness' && settings?.category !== 'review';
                if (isRankableCategory && (mission.category === 'all' || mission.category === settings?.category)) {
                     progressIncrement = result.correctAnswers;
                }
                break;
            case 'get_rank':
                if (mission.rank && result.rank.charCodeAt(0) <= mission.rank.charCodeAt(0)) {
                    progressIncrement = 1;
                }
                break;
            case 'perfect_game':
                if (result.correctAnswers === result.totalQuestions && result.totalQuestions > 0) {
                    progressIncrement = 1;
                }
                break;
        }

        const newProgress = mission.progress + progressIncrement;
        const isCompleted = newProgress >= mission.target;

        if (isCompleted && !mission.completed) {
            totalExpGained += mission.expReward;
            newlyCompletedMissions.push({ description: mission.description, exp: mission.expReward });
        }
        return { ...mission, progress: newProgress, completed: isCompleted };
    });
    
    if (newlyCompletedMissions.length > 0) {
        setShowExpGain(newlyCompletedMissions);
    }

    const newMissionState = { ...currentMissionState, missions: updatedMissions };
    storageService.saveMissionState(newMissionState);
    setMissionState(newMissionState);

    if (totalExpGained > 0) {
        const oldLevel = currentStats.level;
        let newExp = currentStats.exp + totalExpGained;
        let newLevel = currentStats.level;
        let expForNext = EXP_FOR_NEXT_LEVEL(newLevel);

        while (newExp >= expForNext) {
            newExp -= expForNext;
            newLevel++;
            expForNext = EXP_FOR_NEXT_LEVEL(newLevel);
        }

        const newStats: Stats = { ...currentStats, exp: newExp, level: newLevel };
        storageService.saveStats(newStats);

        if (newLevel > oldLevel) {
            setTimeout(() => {
                setShowExpGain(null);
                setShowLevelUp({ oldLevel, newLevel });
            }, newlyCompletedMissions.length > 0 ? 2500 : 500);
        }
    }
};

  const endGame = useCallback(async (rawScore: number, correctAnswers: number, totalQuestions: number, incorrect: Question[], playedQuestions: Map<number, boolean>) => {
    if (!userInfo) return;

    const correctRate = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
    const finalScore = Math.round(rawScore * (correctRate ** 2));
    
    const rank = finalScore >= 320 ? 'S' : finalScore >= 240 ? 'A' : finalScore >= 150 ? 'B' : finalScore >= 75 ? 'C' : 'D';
    
    const comments = {
      S: '完璧です！正答率・スピードともに最高レベル！',
      A: '素晴らしい成績です！高い正答率を維持できています。',
      B: '良い調子です！この調子で正答率を上げていきましょう。',
      C: 'まずは基本をマスター！正答率を意識して再挑戦しよう。',
      D: 'まだ伸びしろあり！まずは正解することを目標に。'
    };
    
    const result: GameResult = {
      score: finalScore,
      correctAnswers,
      totalQuestions,
      rank,
      comment: comments[rank],
    };

    const logEntries: PlayLogEntry[] = Array.from(playedQuestions.entries()).map(([questionId, isCorrect]) => ({
        timestamp: new Date().toISOString(),
        ...userInfo,
        questionId,
        isCorrect,
    }));

    setLastResult(result);
    setLastPlayLogs(logEntries);
    
    const incorrectForStorage: IncorrectQuestion[] = incorrect.map(q => ({ id: q.id, question: q.question, answer: q.answer }));
    
    if (gameSettings) {
      storageService.saveGameResult(result, incorrectForStorage, gameSettings.questions);
      handleMissionUpdatesAndExp(result, gameSettings);
    }
    
    if(activeChallenge) {
        try {
            await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'updateChallenge',
                    challengeId: activeChallenge.challengeId,
                    status: 'completed',
                    resultScore: finalScore
                }),
                headers: {'Content-Type': 'text/plain;charset=utf-8'},
                mode: 'cors'
            });
            setChallenges(prev => prev.filter(c => c.challengeId !== activeChallenge.challengeId));
        } catch (error) {
            console.error('Failed to complete challenge:', error);
        }
        setActiveChallenge(null);
    }
    
    setScreen('results');
  }, [gameSettings, userInfo, activeChallenge]);

  const navigateTo = (newScreen: Screen) => {
    if (newScreen === 'home' && userInfo) {
      initializeMissions();
      fetchChallenges(userInfo);
    }
    setScreen(newScreen);
  };
  
  const requestConfirmation = (message: string, onConfirm: () => void) => {
    setConfirmationState({
      message,
      onConfirm: () => {
        setConfirmationState(null);
        onConfirm();
      },
      onCancel: () => {
        setConfirmationState(null);
      },
    });
  };

  const renderScreen = () => {
    const homeScreenComponent = <HomeScreen userInfo={userInfo} onStartGame={startGame} onNavigate={navigateTo} missionState={missionState} challenges={challenges} onAcceptChallenge={handleAcceptChallenge} onDeclineChallenge={handleDeclineChallenge} isFetchingChallenges={isFetchingChallenges} onLogout={handleLogout} requestConfirmation={requestConfirmation} appSettings={appSettings} />;
    
    switch (screen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onNavigate={navigateTo} />;
      case 'home':
        return homeScreenComponent;
      case 'game':
        if (gameSettings) {
          return <GameScreen settings={gameSettings} onEndGame={endGame} />;
        }
        return homeScreenComponent;
      case 'results':
        if (lastResult && userInfo) {
          return <ResultsScreen 
                   result={lastResult} 
                   onNavigate={navigateTo} 
                   onRestart={() => gameSettings && startGame(gameSettings.mode, gameSettings.category)} 
                   userInfo={userInfo}
                   gameSettings={gameSettings}
                   playLogs={lastPlayLogs}
                 />;
        }
        return homeScreenComponent;
      case 'mypage':
        return <MyPageScreen onNavigate={navigateTo} requestConfirmation={requestConfirmation} appSettings={appSettings} />;
      case 'ranking':
        return <RankingScreen onNavigate={navigateTo} />;
      case 'teacher_login':
        return <TeacherLoginScreen onNavigate={navigateTo} />;
      case 'teacher_panel':
        return <TeacherScreen onNavigate={navigateTo} onLogout={handleLogout} requestConfirmation={requestConfirmation} />;
      default:
        return <LoginScreen onLogin={handleLogin} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-black bg-fixed bg-cover">
      <main className="container mx-auto p-4 max-w-4xl relative">
        {renderScreen()}
        {confirmationState && (
          <ConfirmationScreen 
            message={confirmationState.message} 
            onConfirm={confirmationState.onConfirm} 
            onCancel={confirmationState.onCancel} 
          />
        )}
        {showExpGain && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 fade-in" onClick={() => setShowExpGain(null)}>
                <CyberPanel className="text-center w-full max-w-md">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4 glow-accent">ミッション達成！</h2>
                    <ul className="text-lg text-gray-200 whitespace-pre-wrap mb-8 text-left space-y-2">
                      {showExpGain.map((item, i) => <li key={i}>・{item.description} <span className="font-bold text-green-400">(+{item.exp} EXP)</span></li>)}
                    </ul>
                    <button onClick={() => setShowExpGain(null)} className="px-6 py-2 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-500 transition-colors">
                        閉じる
                    </button>
                </CyberPanel>
            </div>
        )}
        {showLevelUp && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 fade-in" onClick={() => setShowLevelUp(null)}>
                <CyberPanel className="text-center w-full max-w-md border-green-400">
                    <h2 className="text-4xl font-bold text-green-300 mb-4 glow-primary">LEVEL UP!</h2>
                    <div className="text-6xl font-orbitron text-gray-200 flex items-center justify-center gap-4 mb-8">
                        <span>{showLevelUp.oldLevel}</span>
                        <span className="text-green-400">→</span>
                        <span>{showLevelUp.newLevel}</span>
                    </div>
                    <button onClick={() => setShowLevelUp(null)} className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-500 transition-colors">
                        OK
                    </button>
                </CyberPanel>
            </div>
        )}
      </main>
    </div>
  );
};

export default App;