

import React, { useState, useEffect, useMemo } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type RankingEntry, type Screen, type Category, type GameMode, type ClassRankingEntry } from '../../types';
import { GAS_WEB_APP_URL } from '../../constants.ts';

interface RankingScreenProps {
  onNavigate: (screen: Screen) => void;
}

type RankingMode = 'individual' | 'class';

const categories: Category[] = [
    '未来',
    '動名詞',
    '不定詞',
    '助動詞【must】',
    '助動詞【have to】',
    '助動詞【その他】',
    '比較',
    'there is',
    '接続詞',
    '受け身',
    '現在完了',
    '現在完了進行形',
    '不定詞2',
    'その他'
];

const gameModes: { key: GameMode, label: string }[] = [
  { key: 'select', label: '選択問題' },
  { key: 'input', label: '入力問題' },
  { key: 'sort', label: '並替問題' },
  { key: 'test', label: 'テスト' },
];


const RankingScreen: React.FC<RankingScreenProps> = ({ onNavigate }) => {
  const [rankingMode, setRankingMode] = useState<RankingMode>('individual');
  const [individualRanking, setIndividualRanking] = useState<RankingEntry[]>([]);
  const [classRanking, setClassRanking] = useState<ClassRankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    grade: 'all',
    class: 'all',
    category: 'all',
    mode: 'all',
  });

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError('');
      try {
        const action = rankingMode === 'individual' ? 'getRanking' : 'getClassRanking';
        const params = new URLSearchParams({ action });

        if (rankingMode === 'individual') {
          Object.entries(filters).forEach(([key, value]) => {
            params.append(key, value as string);
          });
        }
        
        const url = `${GAS_WEB_APP_URL}?${params.toString()}`;

        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        const responseText = await response.text();

        if (!response.ok) throw new Error(`サーバーエラー: ${response.status}`);
        if (!responseText) throw new Error('サーバーから空の応答がありました。');
        
        const data = JSON.parse(responseText);
        if (!data.success) throw new Error(data.message || 'データの取得に失敗しました。');

        if (rankingMode === 'individual') {
          // Fix: Cast untyped API response to ensure type safety.
          setIndividualRanking(data.rankings as RankingEntry[]);
        } else {
          // Fix: Cast untyped API response to ensure type safety.
          setClassRanking(data.rankings as ClassRankingEntry[]);
        }

      } catch (err) {
        const errorMessage = err instanceof Error ? `ランキングの読み込みに失敗しました: ${err.message}` : 'ランキングの読み込み中に不明なエラーが発生しました。';
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [rankingMode, filters]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const getRankClass = (rank: number) => {
    if (rank === 0) return 'bg-red-500/30 border-red-400 text-red-300';
    if (rank === 1) return 'bg-purple-500/30 border-purple-400 text-purple-300';
    if (rank === 2) return 'bg-orange-700/30 border-orange-600 text-orange-500';
    return 'bg-gray-800/50 border-gray-700';
  };
  
  const commonSelectClass = "w-full bg-gray-800 p-2 rounded border border-orange-700 focus:ring-2 focus:ring-orange-500 focus:outline-none";

  const renderIndividualRanking = () => (
     <div className="max-h-[60vh] overflow-y-auto">
        <ul className="space-y-3">
          {individualRanking.map((entry, index) => (
            <li key={entry.timestamp + entry.name + index} className={`flex items-center p-3 rounded-lg border transition-transform duration-200 hover:scale-105 ${getRankClass(index)}`}>
              <span className="text-2xl font-orbitron w-12">{index + 1}</span>
              <div className="flex-grow text-left ml-4">
                  <p className="text-xl">{entry.name}</p>
                  <p className="text-xs text-gray-400">{entry.grade}年 {entry.class}組</p>
              </div>
              <span className="text-2xl font-orbitron text-orange-300">{entry.score}</span>
            </li>
          ))}
            {individualRanking.length === 0 && <p className="text-center text-gray-400 p-4">まだランキングデータがありません。</p>}
        </ul>
      </div>
  );
  
  const sortedClassRanking = useMemo(() => {
    if (!classRanking || classRanking.length === 0) {
      return [];
    }

    return classRanking
      .map(entry => {
        let score;
        if (entry.studentCount <= 30) {
          // 30人以下の場合は、参加者全員のスコアを単純に合計
          score = entry.averageMaxScore * entry.studentCount;
        } else {
          // 31人以上の場合は、平均点に30を掛けて30人規模に換算
          score = entry.averageMaxScore * 30;
        }
        return {
          ...entry,
          totalScore: Math.round(score),
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  }, [classRanking]);


  const renderClassRanking = () => (
    <div className="max-h-[60vh] overflow-y-auto">
      <ul className="space-y-3">
        {sortedClassRanking.map((entry, index) => (
          <li key={`${entry.grade}-${entry.class}`} className={`p-4 rounded-lg border transition-transform duration-200 hover:scale-105 ${getRankClass(index)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl font-orbitron w-12">{index + 1}</span>
                <span className="text-xl font-bold">{entry.grade}年 {entry.class}組</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-orbitron text-orange-300">{entry.totalScore}</p>
                <p className="text-xs text-gray-400">クラススコア</p>
              </div>
            </div>
             <div className="text-xs text-gray-500 text-right mt-2">
                参加人数: {entry.studentCount}人
              </div>
          </li>
        ))}
         {sortedClassRanking.length === 0 && <p className="text-center text-gray-400 p-4">まだクラスランキングデータがありません。</p>}
      </ul>
    </div>
  );

  return (
    <div className="p-4 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-orbitron glow-primary">Ranking</h1>
        <button onClick={() => onNavigate('home')} className="bg-orange-600 px-4 py-2 rounded-md hover:bg-orange-500 transition-colors">戻る</button>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b-2 border-orange-800">
          <button 
            onClick={() => setRankingMode('individual')} 
            className={`px-4 py-2 text-lg font-bold transition-colors ${rankingMode === 'individual' ? 'border-b-4 border-orange-400 text-orange-300' : 'text-gray-500 hover:text-orange-400'}`}
          >
            個人
          </button>
          <button 
            onClick={() => setRankingMode('class')} 
            className={`px-4 py-2 text-lg font-bold transition-colors ${rankingMode === 'class' ? 'border-b-4 border-orange-400 text-orange-300' : 'text-gray-500 hover:text-orange-400'}`}
          >
            クラス対抗
          </button>
        </div>
      </div>

      {rankingMode === 'individual' && (
        <CyberPanel className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">学年</label>
              <select name="grade" value={filters.grade} onChange={handleFilterChange} className={commonSelectClass}>
                <option value="all">全学年</option>
                {[1, 2, 3].map(g => <option key={g} value={g}>{g}年</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">クラス</label>
              <select name="class" value={filters.class} onChange={handleFilterChange} className={commonSelectClass}>
                <option value="all">全クラス</option>
                {[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}組</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">分野</label>
              <select name="category" value={filters.category} onChange={handleFilterChange} className={commonSelectClass}>
                <option value="all">全分野</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                <option value="weakness">弱点克服</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">モード</label>
              <select name="mode" value={filters.mode} onChange={handleFilterChange} className={commonSelectClass}>
                <option value="all">全モード</option>
                {gameModes.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}
              </select>
            </div>
          </div>
        </CyberPanel>
      )}

      <CyberPanel>
        {loading ? (
          <p className="text-center text-orange-300">読み込み中...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : rankingMode === 'individual' ? renderIndividualRanking() : renderClassRanking()
        }
      </CyberPanel>
    </div>
  );
};

export default RankingScreen;