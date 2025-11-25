
import React, { useState, useEffect } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type GameResult, type Screen, type UserInfo, type GameMode, type FilterableCategory, type Question, type PlayLogEntry, type ChallengePeerInfo } from '../../types';
import { GAS_WEB_APP_URL, GAS_API_KEY } from '../../constants.ts';
import * as storageService from '../../services/storageService';

interface ChallengeModalProps {
  onClose: () => void;
  onSubmit: (opponent: ChallengePeerInfo) => void;
  isSubmitting: boolean;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ onClose, onSubmit, isSubmitting }) => {
    const [opponentInfo, setOpponentInfo] = useState({ grade: '2', class: '1', studentId: '1' });
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!opponentInfo.grade || !opponentInfo.class || !opponentInfo.studentId) {
            setError('すべての項目を入力してください。');
            return;
        }
        setError('');
        onSubmit({ ...opponentInfo, name: `${opponentInfo.grade}-${opponentInfo.class}-${opponentInfo.studentId}`});
    };
    
    const commonSelectClass = "w-full bg-gray-900/80 border border-orange-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400";

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 fade-in" onClick={onClose}>
            <div onClick={e => e.stopPropagation()}>
                <CyberPanel className="w-full max-w-sm">
                    <h2 className="text-2xl font-bold text-orange-300 mb-4">挑戦状を送る</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">学年</label>
                            <select value={opponentInfo.grade} onChange={e => setOpponentInfo(p => ({...p, grade: e.target.value}))} className={commonSelectClass}>
                                {[1, 2, 3].map(g => <option key={g} value={g}>{g}年</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm text-gray-400 mb-1">クラス</label>
                            <select value={opponentInfo.class} onChange={e => setOpponentInfo(p => ({...p, class: e.target.value}))} className={commonSelectClass}>
                                {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}組</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">番号</label>
                            <select value={opponentInfo.studentId} onChange={e => setOpponentInfo(p => ({...p, studentId: e.target.value}))} className={commonSelectClass}>
                                {Array.from({length: 40}, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}番</option>)}
                            </select>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="flex gap-4 pt-2">
                             <button type="button" onClick={onClose} className="w-full px-6 py-2 bg-gray-600 text-white font-bold rounded-md hover:bg-gray-500 transition-colors">
                                キャンセル
                            </button>
                            <button type="submit" disabled={isSubmitting} className="w-full px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-500 transition-colors disabled:bg-gray-600">
                                {isSubmitting ? '送信中...' : '送信'}
                            </button>
                        </div>
                    </form>
                </CyberPanel>
            </div>
        </div>
    );
};


interface ResultsScreenProps {
  result: GameResult;
  onNavigate: (screen: Screen) => void;
  onRestart: (() => void) | null;
  userInfo: UserInfo;
  gameSettings: { mode: GameMode; category: FilterableCategory; questions: Question[] } | null;
  playLogs: PlayLogEntry[];
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onNavigate, onRestart, userInfo, gameSettings, playLogs }) => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const canRegister = gameSettings && gameSettings.category !== 'all' && gameSettings.category !== 'review' && gameSettings.category !== 'weakness';
  const canSendChallenge = canRegister && (result.rank === 'S' || result.rank === 'A');

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeStatus, setChallengeStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const savedUserInfo = storageService.getUserInfo();
    const stats = storageService.getStats();
    if(savedUserInfo?.studentId) {
        setPlayerName(`${savedUserInfo.grade}-${savedUserInfo.class}-${savedUserInfo.studentId} (Lv. ${stats.level})`);
    }
  }, []);

  const handleRegister = async () => {
    if (!playerName.trim() || playerName.length > 30) {
      setError('プレイヤー名は1～30文字で入力してください。');
      return;
    }
    if (!canRegister) {
      setError(gameSettings ? 'このカテゴリではランキング登録はできません。' : 'ゲーム設定が不明なため、ランキングに登録できません。');
      setSubmissionStatus('error');
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        action: 'registerScoreAndLogs', name: playerName, score: result.score, grade: userInfo.grade, class: userInfo.class,
        studentId: userInfo.studentId, category: gameSettings.category, mode: gameSettings.mode, logs: playLogs,
      };
      
      const response = await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        mode: 'cors',
        body: JSON.stringify(payload),
      });
      
      const responseText = await response.text();
      if (!response.ok) throw new Error(`サーバーエラー: ${response.status} ${responseText}`);
      if (!responseText) throw new Error('サーバーから空の応答がありました。');
      const responseData = JSON.parse(responseText);
      if (!responseData.success) throw new Error(responseData.message || `サーバーでエラーが発生しました。`);
      setSubmissionStatus('success');
    } catch (err) {
      console.error('GAS Error:', err);
      const errorMessage = err instanceof Error ? `登録に失敗しました: ${err.message}` : '登録中に不明なエラーが発生しました。';
      setError(errorMessage);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendChallenge = async (opponent: ChallengePeerInfo) => {
    if (!gameSettings) return;
    setChallengeStatus('sending');
    try {
        const payload = {
            action: 'sendChallenge',
            challenger: { ...userInfo, name: playerName },
            opponent,
            category: gameSettings.category,
            mode: gameSettings.mode,
            targetScore: result.score,
            questionIds: gameSettings.questions.map(q => q.id),
        };
        const response = await fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {'Content-Type': 'text/plain;charset=utf-8'},
            mode: 'cors'
        });
        const data = await response.json();
        if (!data.success) throw new Error(data.message || '挑戦状の送信に失敗しました。');
        setChallengeStatus('sent');
        setShowChallengeModal(false);
    } catch (err) {
        console.error('Failed to send challenge:', err);
        setChallengeStatus('error');
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 fade-in">
        <h1 className="text-6xl font-orbitron mb-4 glow-primary">Result</h1>
        
        <CyberPanel className="w-full max-w-lg">
          <div className="space-y-4">
            <p className="text-2xl text-orange-200">ランク</p>
            <p className="text-8xl font-orbitron font-bold text-red-400 glow-accent">{result.rank}</p>
            <p className="text-xl text-red-300">{result.comment}</p>
            
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div><p className="text-sm text-orange-200">スコア</p><p className="text-2xl font-bold">{result.score}</p></div>
              <div><p className="text-sm text-orange-200">正解数</p><p className="text-2xl font-bold">{result.correctAnswers} / {result.totalQuestions}</p></div>
              <div><p className="text-sm text-orange-200">正答率</p><p className="text-2xl font-bold">{result.totalQuestions > 0 ? ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1) : 0}%</p></div>
            </div>
            
            {submissionStatus === 'idle' && canRegister && (
              <div className="pt-6">
                <h3 className="text-lg text-orange-200">ランキングに登録</h3>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <input type="text" placeholder="プレイヤー名 (30文字以内)" value={playerName} onChange={(e) => setPlayerName(e.target.value)} maxLength={30}
                    className="flex-grow bg-gray-800/80 border border-orange-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <button onClick={handleRegister} disabled={isSubmitting || !playerName.trim()}
                    className="px-6 py-2 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {isSubmitting ? '登録中...' : '登録'}
                  </button>
                </div>
              </div>
            )}
            
            {canSendChallenge && challengeStatus !== 'sent' && (
                 <div className="pt-4">
                     <button onClick={() => setShowChallengeModal(true)} disabled={challengeStatus === 'sending'}
                         className="w-full bg-red-600 text-white font-bold py-2 rounded-md hover:bg-red-500 transition-colors shadow-[0_0_15px_rgba(244,67,54,0.6)] disabled:bg-gray-600">
                         挑戦状を送る
                     </button>
                 </div>
            )}
            {challengeStatus === 'sent' && <p className="pt-4 text-green-400">挑戦状を送信しました！</p>}
            {challengeStatus === 'error' && <p className="pt-4 text-red-500">挑戦状の送信に失敗しました。</p>}


            {submissionStatus === 'success' && (
              <div className="pt-6 text-center">
                <p className="text-orange-400 text-xl">ランキングに登録しました！</p>
                <button onClick={() => onNavigate('ranking')} className="mt-2 text-orange-400 hover:underline">ランキングを見る</button>
              </div>
            )}

            {(submissionStatus === 'error' || error) && ( <p className="pt-6 text-red-500">{error || '登録に失敗しました。'}</p> )}
          </div>
        </CyberPanel>
        
        <div className="flex space-x-4 mt-8">
          {onRestart && <button onClick={onRestart} className="bg-orange-600 px-6 py-3 rounded-md hover:bg-orange-500 transition-colors font-bold">もう一度挑戦</button>}
          <button onClick={() => onNavigate('home')} className="bg-purple-600/80 px-6 py-3 rounded-md hover:bg-purple-500/80 transition-colors font-bold">トップに戻る</button>
        </div>
      </div>
      {showChallengeModal && <ChallengeModal onClose={() => setShowChallengeModal(false)} onSubmit={handleSendChallenge} isSubmitting={challengeStatus === 'sending'} />}
    </>
  );
};

export default ResultsScreen;
