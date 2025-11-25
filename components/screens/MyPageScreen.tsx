

import React, { useState, useMemo } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type Stats, type Screen, type IncorrectQuestion, type Category, type MasteryData, type MasteryLevel, type AppSettings } from '../../types';
import * as storageService from '../../services/storageService';
import { getAllQuestions } from '../../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MyPageScreenProps {
  onNavigate: (screen: Screen) => void;
  requestConfirmation: (message: string, onConfirm: () => void) => void;
  appSettings: AppSettings | null;
}

const EXP_FOR_NEXT_LEVEL = (level: number) => 100 + (level - 1) * 50;

const categoryShortNames: Record<Category, string> = {
    '未来': '未来',
    '動名詞': '動名詞',
    '不定詞': '不定詞',
    '助動詞【must】': 'must',
    '助動詞【have to】': 'have to',
    '助動詞【その他】': '助動詞',
    '比較': '比較',
    'there is': 'there is',
    '接続詞': '接続詞',
    '受け身': '受け身',
    '現在完了': '現完',
    '現在完了進行形': '現完進',
    '不定詞2': '不定詞2',
    'その他': 'その他',
};

const MyPageScreen: React.FC<MyPageScreenProps> = ({ onNavigate, requestConfirmation, appSettings }) => {
  const [stats, setStats] = useState<Stats>(storageService.getStats());
  const [incorrectQuestions, setIncorrectQuestions] = useState<IncorrectQuestion[]>(storageService.getIncorrectQuestions());
  const [masteryData, setMasteryData] = useState<MasteryData>(storageService.getMasteryData());

  const chartData = Object.entries(stats.categoryStats)
    .map(([name, data]) => ({
      name: categoryShortNames[name as Category] || name,
      // Fix: Cast `data` to `any` to access properties `total` and `correct` and resolve TypeScript errors.
      正答率: (data as any).total > 0 ? parseFloat((((data as any).correct / (data as any).total) * 100).toFixed(1)) : 0,
      解答数: (data as any).total
    }));

  const weakestCategory = Object.entries(stats.categoryStats)
    // Fix: Cast `data` to `any` to access property `total` and resolve TypeScript error.
    .filter(([, data]) => (data as any).total >= 5)
    // Fix: Cast `a` and `b` to `any` to access properties `correct` and `total` and resolve TypeScript errors.
    .sort(([, a], [, b]) => ((a as any).correct / (a as any).total) - ((b as any).correct / (b as any).total))
    [0];
  
  const handleResetData = () => {
    const confirmMessage = '本当にすべてのローカル学習データをリセットしますか？\nこの操作は元に戻せません。';
    
    const onConfirmReset = () => {
      storageService.clearAllData();
      setStats(storageService.getStats());
      setIncorrectQuestions(storageService.getIncorrectQuestions());
      setMasteryData(storageService.getMasteryData());
      alert('ローカルデータをリセットしました。');
    };

    requestConfirmation(confirmMessage, onConfirmReset);
  };
  
  const masteryStats = useMemo(() => {
    const allQuestionsCount = getAllQuestions().length;
    const levels: Record<MasteryLevel, number> = { unseen: 0, learning: 0, reviewing: 0, mastered: 0 };
    const trackedIds = Object.keys(masteryData);

    trackedIds.forEach(id => {
        levels[masteryData[Number(id)].level]++;
    });
    
    levels.unseen += allQuestionsCount - trackedIds.length;
    return levels;
  }, [masteryData]);

  const expForNext = EXP_FOR_NEXT_LEVEL(stats.level);

  return (
    <div className="p-4 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-orbitron glow-primary">マイページ</h1>
        <button onClick={() => onNavigate('home')} className="bg-orange-600 px-4 py-2 rounded-md hover:bg-orange-500 transition-colors">戻る</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CyberPanel>
            <h2 className="text-2xl font-bold text-orange-300 mb-4">プレイヤーレベル</h2>
            <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-orbitron">Lv. {stats.level}</span>
                <span className="text-sm text-gray-400 font-orbitron">{stats.exp} / {expForNext} EXP</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 border border-gray-900">
                <div 
                    className="bg-green-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.exp / expForNext) * 100}%` }}
                ></div>
            </div>
        </CyberPanel>
        
        <CyberPanel>
          <h2 className="text-2xl font-bold text-orange-300 mb-4">総合統計（ローカル）</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-gray-400">総プレイ回数</p><p className="text-2xl font-orbitron">{stats.totalPlays}</p></div>
            <div><p className="text-sm text-gray-400">生涯スコア</p><p className="text-2xl font-orbitron">{stats.lifetimeScore}</p></div>
            <div><p className="text-sm text-gray-400">総解答数</p><p className="text-2xl font-orbitron">{stats.totalAnswered}</p></div>
            <div><p className="text-sm text-gray-400">生涯正答率</p><p className="text-2xl font-orbitron">{stats.totalAnswered > 0 ? ((stats.totalCorrect / stats.totalAnswered) * 100).toFixed(1) : 0}%</p></div>
          </div>
          {weakestCategory && (
            <div className="mt-6">
              <p className="text-sm text-gray-400">苦手な分野</p>
              <p className="text-xl font-bold text-red-400">{weakestCategory[0]}</p>
            </div>
          )}
        </CyberPanel>

        <CyberPanel>
            <h2 className="text-2xl font-bold text-orange-300 mb-4">習熟度（全問題）</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
                <div><p className="text-sm text-green-400">マスター済み</p><p className="text-2xl font-orbitron">{masteryStats.mastered}</p></div>
                <div><p className="text-sm text-yellow-400">復習中</p><p className="text-2xl font-orbitron">{masteryStats.reviewing}</p></div>
                <div><p className="text-sm text-blue-400">学習中</p><p className="text-2xl font-orbitron">{masteryStats.learning}</p></div>
                <div><p className="text-sm text-gray-400">未学習</p><p className="text-2xl font-orbitron">{masteryStats.unseen}</p></div>
            </div>
        </CyberPanel>
        
        <CyberPanel className="md:col-span-2">
          <h2 className="text-2xl font-bold text-orange-300 mb-4">分野別 正答率</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 14 }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ff9800' }}
                labelStyle={{ color: '#ff9800' }}
                formatter={(value: number) => `${value}%`}
              />
              <Legend wrapperStyle={{ color: '#e5e7eb' }} />
              <Bar dataKey="正答率" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </CyberPanel>

        <CyberPanel className="md:col-span-2">
            <h2 className="text-2xl font-bold text-orange-300 mb-4">弱点リスト ({incorrectQuestions.length}問)</h2>
            <div className="max-h-60 overflow-y-auto pr-2">
            {incorrectQuestions.length > 0 ? (
                <ul className="space-y-4">
                {incorrectQuestions.map(q => (
                    <li key={q.id} className="p-3 bg-gray-800/70 rounded-md">
                    <p className="text-gray-300">{q.question}</p>
                    <p className="text-red-300 font-bold mt-1">正解: {Array.isArray(q.answer) ? q.answer.join(', ') : q.answer}</p>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-gray-400">素晴らしい！弱点はありません。</p>
            )}
            </div>
        </CyberPanel>

        {appSettings?.showResetButton && (
          <div className="md:col-span-2 text-center mt-4">
              <button
                  onClick={handleResetData}
                  className="bg-red-700 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(255,50,50,0.6)]"
              >
                  全ローカルデータリセット
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPageScreen;