

import React, { useState, useEffect } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type GameMode, type Category, type Screen, type MissionState, type FilterableCategory, type ChallengeEntry, type Stats, type UserInfo, type AppSettings } from '../../types';
import * as storageService from '../../services/storageService';

interface HomeScreenProps {
  userInfo: UserInfo | null;
  onStartGame: (mode: GameMode, category: FilterableCategory) => void;
  onNavigate: (screen: Screen) => void;
  missionState: MissionState | null;
  challenges: ChallengeEntry[];
  onAcceptChallenge: (challenge: ChallengeEntry) => void;
  onDeclineChallenge: (challengeId: string) => void;
  isFetchingChallenges: boolean;
  onLogout: () => void;
  requestConfirmation: (message: string, onConfirm: () => void) => void;
  appSettings: AppSettings | null;
}

const EXP_FOR_NEXT_LEVEL = (level: number) => 100 + (level - 1) * 50;

const LevelWidget: React.FC<{ stats: Stats }> = ({ stats }) => {
    const expForNext = EXP_FOR_NEXT_LEVEL(stats.level);
    const expPercentage = expForNext > 0 ? (stats.exp / expForNext) * 100 : 0;
    
    return (
        <div className="w-40">
             <div className="flex justify-between items-baseline text-xs mb-1">
                <span className="font-orbitron font-bold text-orange-300">Lv. {stats.level}</span>
                <span className="text-gray-400">{stats.exp} / {expForNext} EXP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 border border-gray-900">
                <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${expPercentage}%` }}
                ></div>
            </div>
        </div>
    );
};


const HomeScreen: React.FC<HomeScreenProps> = ({ userInfo, onStartGame, onNavigate, missionState, challenges, onAcceptChallenge, onDeclineChallenge, isFetchingChallenges, onLogout, requestConfirmation, appSettings }) => {
  const [mode, setMode] = useState<GameMode>('select');
  const [category, setCategory] = useState<Category>('未来');
  const [weaknessCount, setWeaknessCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [stats, setStats] = useState<Stats>(storageService.getStats());

  useEffect(() => {
    const updateCountsAndStats = () => {
      setWeaknessCount(storageService.getIncorrectQuestions().length);
      const masteryData = storageService.getMasteryData();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueForReview = Object.values(masteryData).filter(
          entry => entry.level !== 'mastered' && new Date(entry.nextReviewDate) <= today
      ).length;
      setReviewCount(dueForReview);
      setStats(storageService.getStats());
    };
    updateCountsAndStats();
    
    // Listen for custom event when stats are updated elsewhere
    const handleStatsUpdate = () => updateCountsAndStats();
    window.addEventListener('statsUpdated', handleStatsUpdate);
    
    return () => {
        window.removeEventListener('statsUpdated', handleStatsUpdate);
    };
  }, []);
  
  const handleLogoutClick = () => {
    requestConfirmation('ログアウトしますか？', onLogout);
  };

  const categories: Category[] = [
    '未来', '動名詞', '不定詞', '助動詞【must】', '助動詞【have to】', '助動詞【その他】', '比較', 'there is', '接続詞', '受け身', '現在完了', '現在完了進行形', '不定詞2', 'その他'
  ];

  const gameModes: { key: GameMode, label: string }[] = [
    { key: 'select', label: '選択問題' }, { key: 'input', label: '入力問題' }, { key: 'sort', label: '並替問題' }, { key: 'test', label: 'テスト' },
  ];

  const handleStart = () => onStartGame(mode, category);
  const handleStartReview = () => onStartGame('test', 'review');
  const handleStartWeakness = () => onStartGame('test', 'weakness');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 fade-in">
      <div className="w-full max-w-lg">
        <header className="relative w-full mb-2 text-center">
            {userInfo && (
              <div className="absolute top-0 left-0 z-10 text-sm text-orange-400 font-orbitron">
                player: {userInfo.grade}-{userInfo.class}-{userInfo.studentId}
              </div>
            )}
            <div className="absolute top-0 right-0 z-10">
              <button onClick={() => onNavigate('teacher_login')} className="text-sm text-orange-400 hover:underline">先生用</button>
            </div>
            <h1 className="text-5xl md:text-6xl font-orbitron glow-primary pt-8">英語HACK</h1>
            <p className="text-orange-200 mt-2">中学英語 学習プラットフォーム</p>
        </header>
      
        {challenges.length > 0 && (
            <CyberPanel className="w-full max-w-lg mb-6 animate-pulse border-red-500">
                <h2 className="text-xl font-bold text-red-300 mb-2">挑戦状が {challenges.length}件 届いています！</h2>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                    {challenges.map(challenge => (
                        <div key={challenge.challengeId} className="p-2 bg-gray-800/50 rounded-md">
                            <p className="text-sm text-gray-300">
                                <span className="font-bold text-yellow-400">{challenge.challenger.name}</span>さんから「{challenge.category}」での挑戦
                            </p>
                            <p className="text-xs text-gray-400">目標スコア: {challenge.targetScore}点</p>
                            <div className="flex justify-end gap-2 mt-1">
                                <button onClick={() => onDeclineChallenge(challenge.challengeId)} className="text-xs px-2 py-1 bg-gray-600 rounded">辞退</button>
                                <button onClick={() => onAcceptChallenge(challenge)} className="text-xs px-2 py-1 bg-red-600 rounded">受ける</button>
                            </div>
                        </div>
                    ))}
                </div>
            </CyberPanel>
        )}

        {missionState && (
          <CyberPanel className="w-full max-w-lg mb-6 p-4">
              <div className="flex justify-between items-start mb-3">
                  <h2 className="text-md font-bold text-orange-300 mt-1">デイリーミッション</h2>
                  <LevelWidget stats={stats} />
              </div>
              <ul className="space-y-2 text-left">
                  {missionState.missions.map(mission => (
                      <li key={mission.id} className={`transition-opacity ${mission.completed ? 'opacity-50' : 'opacity-100'}`}>
                          <p className="text-orange-200 text-xs">{mission.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <progress value={mission.progress} max={mission.target} className="w-full h-1.5 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:bg-orange-400 [&::-moz-progress-bar]:bg-orange-400" />
                              <span className="text-xs font-orbitron w-16 text-right">{Math.min(mission.progress, mission.target)}/{mission.target}</span>
                              {mission.completed && <span className="text-yellow-400 font-bold text-sm">✓</span>}
                          </div>
                      </li>
                  ))}
              </ul>
          </CyberPanel>
        )}

        <CyberPanel className="w-full max-w-lg">
          <div className="space-y-6">
            <div>
              <label className="block text-lg text-orange-200 mb-2">学習分野</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-gray-800/80 border border-orange-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-lg text-orange-200 mb-2">問題モード</label>
              <div className="grid grid-cols-2 gap-2">
                {gameModes.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`w-full px-4 py-2 rounded-md transition-all duration-200 ${
                      mode === key
                        ? 'bg-orange-500 text-black font-bold shadow-[0_0_10px_rgba(255,152,0,0.7)]'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleStart}
              className="w-full bg-orange-600 text-white font-bold text-xl py-3 rounded-lg hover:bg-orange-500 transition-colors duration-300 shadow-[0_0_15px_rgba(255,152,0,0.6)]"
            >
              学習開始
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleStartReview}
                disabled={reviewCount === 0}
                className="w-full bg-green-600 text-white font-bold text-xl py-3 rounded-lg hover:bg-green-500 transition-colors duration-300 shadow-[0_0_15px_rgba(76,175,80,0.6)] disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                復習 ({reviewCount}問)
              </button>
              <button
                onClick={handleStartWeakness}
                disabled={weaknessCount === 0}
                className="w-full bg-red-500 text-white font-bold text-xl py-3 rounded-lg hover:bg-red-400 transition-colors duration-300 shadow-[0_0_15px_rgba(244,67,54,0.6)] disabled:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                弱点克服 ({weaknessCount}問)
              </button>
            </div>
          </div>
        </CyberPanel>

        <div className="flex justify-center items-center space-x-4 mt-8">
          <button onClick={() => onNavigate('mypage')} className="bg-purple-600/80 px-6 py-2 rounded-md hover:bg-purple-500/80 transition-colors">マイページ</button>
          <button onClick={() => onNavigate('ranking')} className="bg-red-600/80 px-6 py-2 rounded-md hover:bg-red-500/80 transition-colors">ランキング</button>
          {appSettings?.showLogoutButton && (
            <button onClick={handleLogoutClick} className="bg-gray-600/80 text-white px-4 py-2 rounded-md hover:bg-gray-500/80 transition-colors text-sm">ログアウト</button>
          )}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 text-xs text-gray-500">
        presented by onokomachi
      </div>
    </div>
  );
};

export default HomeScreen;