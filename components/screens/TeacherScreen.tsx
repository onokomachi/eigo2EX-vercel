
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type Screen, type PlayLogEntry, type AnalyticsData, type FilterableCategory, type FilterableQuestionType, type Category, type QuestionType, type Question, type RankingEntry, GameMode, AppSettings } from '../../types';
import { GAS_WEB_APP_URL } from '../../constants';
import { getAllQuestions } from '../../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TeacherScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  requestConfirmation: (message: string, onConfirm: () => void) => void;
}

const categoryShortNames: Record<Category, string> = {
    '未来': '未来', '動名詞': '動名詞', '不定詞': '不定詞', '助動詞【must】': 'must', '助動詞【have to】': 'have to', '助動詞【その他】': '助動詞', '比較': '比較',
    'there is': 'there is', '接続詞': '接続詞', '受け身': '受け身', '現在完了': '現完',
    '現在完了進行形': '現完進', '不定詞2': '不定詞2', 'その他': 'その他',
};
const allCategories = Object.keys(categoryShortNames) as Category[];
const gameModes: { key: GameMode, label: string }[] = [
  { key: 'select', label: '選択問題' }, { key: 'input', label: '入力問題' },
  { key: 'sort', label: '並替問題' }, { key: 'test', label: 'テスト' },
];


type StudentAnalytics = { 
  studentId: string; 
  level: number;
  playDays: number;
  totalAnswered: number; 
  correctRate: number; 
  lastPlayDate: string;
  lastPlayTimestamp: number;
};

type ClassAnalytics = {
  className: string;
  studentCount: number;
  totalAnswered: number;
  correctRate: number;
};

type Period = 'today' | 'week' | 'month' | 'all';

const TeacherScreen: React.FC<TeacherScreenProps> = ({ onLogout, requestConfirmation }) => {
  const [searchCriteria, setSearchCriteria] = useState({ grade: '2', class: '', studentId: '' });
  const [period, setPeriod] = useState<Period>('all');
  const [playLogs, setPlayLogs] = useState<PlayLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // States for analytics
  const [analyticsFilters, setAnalyticsFilters] = useState<{ category: FilterableCategory, type: FilterableQuestionType }>({ category: 'all', type: 'all' });
  const [studentSort, setStudentSort] = useState<{ key: keyof StudentAnalytics, order: 'asc' | 'desc' }>({ key: 'studentId', order: 'asc' });
  const [classSort, setClassSort] = useState<{ key: keyof ClassAnalytics, order: 'asc' | 'desc' }>({ key: 'className', order: 'asc' });


  // States for ranking viewer
  const [rankingFilters, setRankingFilters] = useState({ grade: 'all', class: 'all', category: 'all', mode: 'all' });
  const [rankingData, setRankingData] = useState<RankingEntry[]>([]);
  const [isRankingLoading, setIsRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState('');

  // States for data reset
  const [resetCategory, setResetCategory] = useState<Category | 'all' | 'weakness'>('all');
  const [isResetting, setIsResetting] = useState(false);

  // States for App Settings
  const [appSettings, setAppSettings] = useState<AppSettings>({ showLogoutButton: false, showResetButton: false });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsError, setSettingsError] = useState('');
  
  const [questionMap] = useState<Map<number, Question>>(() => new Map(getAllQuestions().map(q => [q.id, q])));

  const fetchPlayLogs = useCallback(async () => {
    const { grade, class: className } = searchCriteria;
    if (!grade) {
      setError('学年は必須です。');
      return;
    }
    setLoading(true);
    setError('');
    setPlayLogs([]);

    // Trigger ranking fetch for the selected class to get student levels
    if (className) {
      setRankingFilters(f => ({ ...f, grade: grade, class: className, category: 'all', mode: 'all' }));
    } else {
      // If fetching for a whole grade, get all rankings to calculate levels for all students in that grade
      setRankingFilters(f => ({ ...f, grade: grade, class: 'all', category: 'all', mode: 'all' }));
    }

    try {
      const params = new URLSearchParams({ action: 'getPlayLog', ...searchCriteria });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let startDate: Date | null = null;
      
      switch(period) {
        case 'today':
          startDate = today;
          break;
        case 'week':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
          break;
        case 'month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
      }
      
      if (startDate) {
        params.append('startDate', startDate.toISOString().split('T')[0]);
        params.append('endDate', new Date().toISOString().split('T')[0]);
      }

      const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`, { method: 'GET', mode: 'cors' });
      const data = await response.json();
      
      if (!data.success) throw new Error(data.message || 'ログデータの取得に失敗しました。');
      // Fix: Cast untyped API response to ensure type safety.
      setPlayLogs(data.logs as PlayLogEntry[]);
    } catch (err) {
      setError(err instanceof Error ? `データ取得エラー: ${err.message}` : 'データの取得中に不明なエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria, period]);

  const fetchRanking = useCallback(async () => {
    setIsRankingLoading(true);
    setRankingError('');
    try {
      const params = new URLSearchParams({ action: 'getRanking', ...rankingFilters });
      const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`, { method: 'GET', mode: 'cors' });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'ランキングの取得に失敗しました。');
      // Fix: Cast untyped API response to ensure type safety.
      setRankingData(data.rankings as RankingEntry[]);
    } catch (err) {
      setRankingError(err instanceof Error ? `エラー: ${err.message}` : '不明なエラーが発生しました。');
    } finally {
      setIsRankingLoading(false);
    }
  }, [rankingFilters]);

  // Fetch ranking data when filters change
  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);
  
    const fetchAppSettings = useCallback(async () => {
        setSettingsLoading(true);
        setSettingsError('');
        try {
            const params = new URLSearchParams({ action: 'getAppSettings' });
            const response = await fetch(`${GAS_WEB_APP_URL}?${params.toString()}`);
            if (!response.ok) throw new Error('設定の取得に失敗しました');
            const data = await response.json();
            if (data.success) {
                setAppSettings(data.settings);
            } else {
                throw new Error(data.message || '設定の取得に失敗しました');
            }
        } catch (err) {
            setSettingsError(err instanceof Error ? err.message : '不明なエラー');
        } finally {
            setSettingsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppSettings();
    }, [fetchAppSettings]);

  const handleAppSettingsChange = async (key: keyof AppSettings, value: boolean) => {
        const newSettings = { ...appSettings, [key]: value };
        setAppSettings(newSettings);

        try {
            const payload = { action: 'updateAppSettings', settings: newSettings };
            const response = await fetch(GAS_WEB_APP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                mode: 'cors',
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!result.success) {
                // Revert on failure
                setAppSettings(prev => ({...prev, [key]: !value}));
                alert('設定の更新に失敗しました: ' + (result.message || ''));
            }
        } catch (err) {
            // Revert on failure
            setAppSettings(prev => ({...prev, [key]: !value}));
            alert('設定の更新中にエラーが発生しました。');
        }
    };


  const analyticsData: AnalyticsData | null = useMemo(() => {
    if (playLogs.length === 0) return null;

    const filteredLogs = playLogs.filter(log => {
      const question = questionMap.get(log.questionId);
      if (!question) return false;
      const categoryMatch = analyticsFilters.category === 'all' || question.category === analyticsFilters.category;
      const typeMatch = analyticsFilters.type === 'all' || question.type === analyticsFilters.type;
      return categoryMatch && typeMatch;
    });

    const totalAnswered = filteredLogs.length;
    const totalCorrect = filteredLogs.filter(log => log.isCorrect).length;
    
    const categoryStats = allCategories.reduce((acc, cat) => ({...acc, [cat]: { correct: 0, total: 0, correctRate: 0 }}), {} as Record<Category, { correct: number; total: number; correctRate: number }>);
    const incorrectCounts = new Map<number, number>();
    const heatmap = allCategories.reduce((acc, cat) => ({...acc, [cat]: { select: { correct: 0, total: 0 }, input: { correct: 0, total: 0 }, sort: { correct: 0, total: 0 }}}), {} as AnalyticsData['heatmap']);

    for (const log of filteredLogs) {
      const question = questionMap.get(log.questionId);
      if(question) {
        const { category, type } = question;
        if(categoryStats[category]){
            categoryStats[category].total++;
            if (log.isCorrect) categoryStats[category].correct++;
            else incorrectCounts.set(log.questionId, (incorrectCounts.get(log.questionId) || 0) + 1);
        }
        if (heatmap[category] && heatmap[category][type]) {
            heatmap[category][type].total++;
            if (log.isCorrect) heatmap[category][type].correct++;
        }
      }
    }

    Object.keys(categoryStats).forEach(key => {
      const cat = key as Category;
      if (categoryStats[cat].total > 0) categoryStats[cat].correctRate = (categoryStats[cat].correct / categoryStats[cat].total) * 100;
    });

    const incorrectQuestions = Array.from(incorrectCounts.entries()).map(([id, count]) => ({ id, count, ...questionMap.get(id)! })).sort((a, b) => b.count - a.count).slice(0, 20);

    return {
      scope: searchCriteria, totalPlays: new Set(filteredLogs.map(l => l.timestamp.split('T')[0] + l.studentId)).size,
      totalAnswered, totalCorrect, correctRate: totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0,
      categoryStats, incorrectQuestions, heatmap
    };
  }, [playLogs, analyticsFilters, searchCriteria, questionMap]);

  const classAnalytics: ClassAnalytics[] | null = useMemo(() => {
    if (!playLogs.length || searchCriteria.class || !searchCriteria.grade) {
      return null;
    }

    const logsByClass = playLogs.reduce((acc, log) => {
      if (log.grade == searchCriteria.grade) {
        (acc[log.class] = acc[log.class] || []).push(log);
      }
      return acc;
    }, {} as Record<string, PlayLogEntry[]>);

    const classData = Object.entries(logsByClass).map(([className, logs]: [string, PlayLogEntry[]]) => {
      const totalAnswered = logs.length;
      const totalCorrect = logs.filter(l => l.isCorrect).length;
      const correctRate = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
      const studentCount = new Set(logs.map(l => l.studentId)).size;
      return { className, studentCount, totalAnswered, correctRate };
    });

    return classData.sort((a, b) => {
      const key = classSort.key;
      const orderFactor = classSort.order === 'asc' ? 1 : -1;
      const valA = a[key];
      const valB = b[key];
      const numA = typeof valA === 'string' ? parseInt(valA, 10) : valA;
      const numB = typeof valB === 'string' ? parseInt(valB, 10) : valB;

      if (numA < numB) return -1 * orderFactor;
      if (numA > numB) return 1 * orderFactor;
      return 0;
    });
  }, [playLogs, searchCriteria.grade, searchCriteria.class, classSort]);

  const studentAnalytics: StudentAnalytics[] | null = useMemo(() => {
    if (!playLogs.length || !searchCriteria.class || searchCriteria.studentId) return null;

    const levelMap = new Map<string, number>();
    rankingData.forEach(entry => {
        if (entry.studentId && entry.grade === searchCriteria.grade && entry.class === searchCriteria.class) {
            const match = entry.name.match(/\(Lv\.\s*(\d+)\)/);
            if (match) {
                levelMap.set(entry.studentId, parseInt(match[1], 10));
            }
        }
    });
    
    const logsByStudent = playLogs.reduce((acc, log) => { (acc[log.studentId] = acc[log.studentId] || []).push(log); return acc; }, {} as Record<string, PlayLogEntry[]>);
    
    const studentData = Object.entries(logsByStudent).map(([studentId, logs]: [string, PlayLogEntry[]]) => {
        const totalAnswered = logs.length;
        const totalCorrect = logs.filter(l => l.isCorrect).length;
        const correctRate = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
        
        const level = levelMap.get(studentId) || 1;
        const playDays = new Set(logs.map(l => l.timestamp.split('T')[0])).size;
        
        const lastPlayTimestamp = Math.max(...logs.map(l => new Date(l.timestamp).getTime()));
        const lastPlayDateObj = new Date(lastPlayTimestamp);
        const lastPlayDate = `${lastPlayDateObj.getFullYear()}/${lastPlayDateObj.getMonth() + 1}/${lastPlayDateObj.getDate()}`;

        return { studentId, totalAnswered, correctRate, level, playDays, lastPlayDate, lastPlayTimestamp };
    });

    return studentData.sort((a, b) => {
        const key = studentSort.key;
        const orderFactor = studentSort.order === 'asc' ? 1 : -1;

        if (key === 'lastPlayDate') {
            return (a.lastPlayTimestamp - b.lastPlayTimestamp) * orderFactor;
        }

        const valA = a[key as keyof Omit<StudentAnalytics, 'lastPlayDate' | 'lastPlayTimestamp'>];
        const valB = b[key as keyof Omit<StudentAnalytics, 'lastPlayDate' | 'lastPlayTimestamp'>];
        const numA = typeof valA === 'string' ? parseInt(valA, 10) : valA as number;
        const numB = typeof valB === 'string' ? parseInt(valB, 10) : valB as number;

        if (numA < numB) return -1 * orderFactor;
        if (numA > numB) return 1 * orderFactor;
        return 0;
    });
  }, [playLogs, searchCriteria, studentSort, rankingData]);

  const handleSort = (key: keyof StudentAnalytics) => setStudentSort(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
  const handleClassSort = (key: keyof ClassAnalytics) => setClassSort(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
  
  const handleResetData = async (type: 'log' | 'ranking') => {
      let payload; let confirmMessage;
      
      if (type === 'log') {
          if (!analyticsData || analyticsData.totalAnswered === 0) return alert('削除対象の学習ログがありません。');
          const { grade, class: className, studentId } = searchCriteria;
          let scopeMessage = `${grade}年生`;
          if (className) scopeMessage += ` ${className}組`; if (studentId) scopeMessage += ` ${studentId}番`;
          confirmMessage = `${scopeMessage} の学習ログ (${analyticsData.totalAnswered}件) をすべて削除します。\n\nこの操作は元に戻せません。本当によろしいですか？`;
          payload = { action: 'resetLogData', criteria: { grade, class: className || 'all', studentId: studentId || 'all' } };
      } else {
          const categoryName = resetCategory === 'all' ? '全分野' : resetCategory;
          confirmMessage = `本当に「${categoryName}」のランキングデータをすべて削除しますか？\nこの操作は元に戻せません。`;
          payload = { action: 'resetRankingData', criteria: { category: resetCategory } };
      }

      const performReset = async () => {
          type === 'log' ? setLoading(true) : setIsResetting(true);
          setError('');
          try {
              const response = await fetch(GAS_WEB_APP_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, mode: 'cors', body: JSON.stringify(payload) });
              const result = await response.json();
              if (!result.success) throw new Error(result.message || 'Server error');
              alert(result.message || 'データリセットを完了しました。');
              if (type === 'log') setPlayLogs([]);
          } catch (err) {
              const errorMessage = err instanceof Error ? err.message : 'データのリセット中に不明なエラーが発生しました。';
              setError(errorMessage);
              alert(`エラー: ${errorMessage}`);
          } finally {
              type === 'log' ? setLoading(false) : setIsResetting(false);
          }
      };
      requestConfirmation(confirmMessage, performReset);
  };

  const chartData = analyticsData ? Object.entries(analyticsData.categoryStats).map(([name, data]) => ({ name: categoryShortNames[name as Category] || name, 正答率: parseFloat(data.correctRate.toFixed(1)) })) : [];
  const getRateColor = (rate: number) => rate >= 80 ? 'text-orange-400' : rate >= 60 ? 'text-yellow-400' : 'text-red-400';
  const getHeatmapColor = (rate: number): string => rate < 0 ? 'bg-gray-800/50' : rate < 40 ? 'bg-red-800/70 text-red-200' : rate < 60 ? 'bg-red-700/60 text-yellow-200' : rate < 80 ? 'bg-yellow-700/50 text-yellow-100' : rate < 95 ? 'bg-green-700/50 text-green-200' : 'bg-green-500/60 text-white font-bold';
  const commonSelectClass = "w-full bg-gray-800 p-2 rounded border border-orange-700 focus:ring-2 focus:ring-orange-500 focus:outline-none";

  return (
    <div className="p-4 fade-in space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-4xl font-orbitron glow-primary">教員用管理画面</h1><button onClick={onLogout} className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-500 transition-colors">ログアウト</button></div>
      <CyberPanel>
        <h2 className="text-2xl font-bold text-orange-300 mb-4">学習ログ分析</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end mb-4">
          <div><label className="block text-sm text-gray-400 mb-1">学年</label><select value={searchCriteria.grade} onChange={(e) => setSearchCriteria(p => ({...p, grade: e.target.value}))} className={commonSelectClass}>{[1, 2, 3].map(g => <option key={g} value={g}>{g}年</option>)}</select></div>
          <div><label className="block text-sm text-gray-400 mb-1">クラス</label><select value={searchCriteria.class} onChange={(e) => setSearchCriteria(p => ({...p, class: e.target.value, studentId: ''}))} className={commonSelectClass}><option value="">全クラス</option>{[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}組</option>)}</select></div>
          <div><label className="block text-sm text-gray-400 mb-1">番号</label><select value={searchCriteria.studentId} onChange={(e) => setSearchCriteria(p => ({...p, studentId: e.target.value}))} className={commonSelectClass} disabled={!searchCriteria.class}><option value="">全番号</option>{Array.from({length: 40}, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}番</option>)}</select></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
            <div className="md:col-span-3">
                <label className="block text-sm text-gray-400 mb-1">期間</label>
                <div className="flex rounded-md shadow-sm">
                    {(['today', 'week', 'month', 'all'] as const).map((p, i) => (
                        <button type="button" key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 text-sm font-medium transition-colors ${period === p ? 'bg-orange-600 text-white z-10' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} ${i === 0 ? 'rounded-l-md' : ''} ${i === 3 ? 'rounded-r-md' : 'border-r-0'} border border-gray-600`}>
                            {{today: '今日', week: '今週', month: '今月', all: '全期間'}[p]}
                        </button>
                    ))}
                </div>
            </div>
            <div className="md:col-span-2">
                 <button type="button" onClick={() => fetchPlayLogs()} disabled={loading} className="w-full bg-orange-600 px-6 py-2 rounded-md hover:bg-orange-500 disabled:bg-gray-600">{loading ? '検索中...' : 'データ取得'}</button>
            </div>
        </div>
        {error && !loading && <p className="text-red-500 mt-4">{error}</p>}
      </CyberPanel>
      
      <CyberPanel>
        <h2 className="text-2xl font-bold text-orange-300 mb-4">生徒画面設定</h2>
        {settingsLoading ? (
            <p className="text-center text-orange-300">設定を読み込み中...</p>
        ) : settingsError ? (
            <p className="text-center text-red-500">{settingsError}</p>
        ) : (
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <label htmlFor="showLogoutButton" className="text-gray-200">生徒画面のログアウトボタン</label>
                    <button
                        id="showLogoutButton"
                        onClick={() => handleAppSettingsChange('showLogoutButton', !appSettings.showLogoutButton)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                            appSettings.showLogoutButton ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                        aria-checked={appSettings.showLogoutButton}
                        role="switch"
                    >
                        <span className="sr-only">ログアウトボタンを表示</span>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            appSettings.showLogoutButton ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <label htmlFor="showResetButton" className="text-gray-200">生徒マイページのデータリセットボタン</label>
                    <button
                        id="showResetButton"
                        onClick={() => handleAppSettingsChange('showResetButton', !appSettings.showResetButton)}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                            appSettings.showResetButton ? 'bg-orange-500' : 'bg-gray-600'
                        }`}
                        aria-checked={appSettings.showResetButton}
                        role="switch"
                    >
                        <span className="sr-only">データリセットボタンを表示</span>
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                            appSettings.showResetButton ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                </div>
                 <p className="text-xs text-gray-500 mt-2">これらの設定は、全生徒の画面に即時反映されます。通常は非表示にすることを推奨します。</p>
            </div>
        )}
      </CyberPanel>

      {loading && <div className="text-center p-8"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div><p className="text-orange-300 mt-4">データを読み込み中...</p></div>}
      {analyticsData ? (
        <div className="space-y-6">
            <CyberPanel><h3 className="text-xl font-bold text-orange-300 mb-4">分析フィルタ</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm text-gray-400 mb-1">分野</label><select value={analyticsFilters.category} onChange={e => setAnalyticsFilters(f => ({...f, category: e.target.value as FilterableCategory}))} className={commonSelectClass}><option value="all">全分野</option>{allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div><div><label className="block text-sm text-gray-400 mb-1">問題形式</label><select value={analyticsFilters.type} onChange={e => setAnalyticsFilters(f => ({...f, type: e.target.value as FilterableQuestionType}))} className={commonSelectClass}><option value="all">全形式</option><option value="select">選択</option><option value="input">入力</option><option value="sort">並替</option></select></div></div></CyberPanel>
            
            {classAnalytics && (<CyberPanel><h2 className="text-2xl font-bold text-orange-300 mb-4">{searchCriteria.grade}年生 クラス別成績一覧</h2><div className="max-h-96 overflow-y-auto pr-2"><table className="w-full text-sm table-auto"><thead><tr className="border-b-2 border-orange-700"><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-left" onClick={() => handleClassSort('className')}>クラス {classSort.key === 'className' && (classSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-right" onClick={() => handleClassSort('studentCount')}>参加生徒数 {classSort.key === 'studentCount' && (classSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-right" onClick={() => handleClassSort('totalAnswered')}>総解答数 {classSort.key === 'totalAnswered' && (classSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-right" onClick={() => handleClassSort('correctRate')}>正答率 {classSort.key === 'correctRate' && (classSort.order === 'asc' ? '▲' : '▼')}</th></tr></thead><tbody>{classAnalytics.map(c => (<tr key={c.className} className="border-b border-gray-700 hover:bg-gray-800/50"><td className="p-2 font-orbitron text-base text-left">{c.className}組</td><td className="p-2 font-orbitron text-base text-right">{c.studentCount}人</td><td className="p-2 font-orbitron text-base text-right">{c.totalAnswered}</td><td className={`p-2 font-orbitron font-bold text-lg text-right ${getRateColor(c.correctRate)}`}>{c.correctRate.toFixed(1)}%</td></tr>))}</tbody></table>{classAnalytics.length === 0 && <p className="text-center text-gray-400 p-4">この学年の学習ログはありません。</p>}</div></CyberPanel>)}
            
            {studentAnalytics && (<CyberPanel><h2 className="text-2xl font-bold text-orange-300 mb-4">{searchCriteria.grade}年{searchCriteria.class}組 生徒別成績一覧</h2><div className="max-h-96 overflow-y-auto pr-2"><table className="w-full text-sm table-auto"><thead><tr className="border-b-2 border-orange-700"><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-left" onClick={() => handleSort('studentId')}>番号 {studentSort.key === 'studentId' && (studentSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-left" onClick={() => handleSort('level')}>レベル {studentSort.key === 'level' && (studentSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-left" onClick={() => handleSort('playDays')}>プレイ日数 {studentSort.key === 'playDays' && (studentSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-right" onClick={() => handleSort('totalAnswered')}>総解答数 {studentSort.key === 'totalAnswered' && (studentSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-right" onClick={() => handleSort('correctRate')}>正答率 {studentSort.key === 'correctRate' && (studentSort.order === 'asc' ? '▲' : '▼')}</th><th className="p-2 cursor-pointer hover:bg-orange-900/50 text-right" onClick={() => handleSort('lastPlayDate')}>最終プレイ日 {studentSort.key === 'lastPlayDate' && (studentSort.order === 'asc' ? '▲' : '▼')}</th></tr></thead><tbody>{studentAnalytics.map(s => (<tr key={s.studentId} className="border-b border-gray-700 hover:bg-gray-800/50"><td className="p-2 font-orbitron text-base text-left">{s.studentId}番</td><td className="p-2 font-orbitron text-base text-left">{s.level}</td><td className="p-2 font-orbitron text-base text-left">{s.playDays}</td><td className="p-2 font-orbitron text-base text-right">{s.totalAnswered}</td><td className={`p-2 font-orbitron font-bold text-lg text-right ${getRateColor(s.correctRate)}`}>{s.correctRate.toFixed(1)}%</td><td className="p-2 font-orbitron text-base text-right">{s.lastPlayDate}</td></tr>))}</tbody></table>{studentAnalytics.length === 0 && <p className="text-center text-gray-400 p-4">このクラスの学習ログはありません。</p>}</div></CyberPanel>)}
            
            <CyberPanel className="md:col-span-2"><h2 className="text-2xl font-bold text-orange-300 mb-4">正答率ヒートマップ</h2><div className="overflow-x-auto"><table className="w-full text-center text-sm border-separate border-spacing-0.5"><thead><tr className="bg-gray-800"><th className="p-2 sticky left-0 bg-gray-800">分野</th><th className="p-2">選択</th><th className="p-2">入力</th><th className="p-2">並替</th></tr></thead><tbody>{Object.entries(analyticsData.heatmap).map(([category, types]) => (<tr key={category} className="bg-gray-900"><th className="p-2 font-bold text-left sticky left-0 bg-gray-900">{categoryShortNames[category as Category]}</th>{(['select', 'input', 'sort'] as QuestionType[]).map(type => { const data = types[type]; const rate = data.total > 0 ? (data.correct / data.total) * 100 : -1; return (<td key={type} className={`p-2 font-orbitron transition-colors duration-300 ${getHeatmapColor(rate)}`}>{rate >= 0 ? `${rate.toFixed(0)}%` : '-'}<span className="text-xs block opacity-70">({data.correct}/{data.total})</span></td>);})}</tr>))}</tbody></table></div></CyberPanel>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><CyberPanel><h2 className="text-2xl font-bold text-orange-300 mb-4">総合統計</h2><div className="grid grid-cols-2 gap-4"><div><p className="text-sm text-gray-400">総解答数</p><p className="text-2xl font-orbitron">{analyticsData.totalAnswered}</p></div><div><p className="text-sm text-gray-400">総合正答率</p><p className="text-2xl font-orbitron">{analyticsData.correctRate.toFixed(1)}%</p></div></div></CyberPanel><CyberPanel><h2 className="text-2xl font-bold text-orange-300 mb-4">分野別 正答率</h2><ResponsiveContainer width="100%" height={200}><BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#444" /><XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} /><YAxis unit="%" domain={[0, 100]} tick={{ fill: '#9ca3af' }} /><Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ff9800' }} labelStyle={{ color: '#ff9800' }} /><Bar dataKey="正答率" fill="#ff9800" /></BarChart></ResponsiveContainer></CyberPanel><CyberPanel className="md:col-span-2"><h2 className="text-2xl font-bold text-orange-300 mb-4">苦手問題リスト (ワースト20)</h2><div className="max-h-60 overflow-y-auto pr-2">{analyticsData.incorrectQuestions.length > 0 ? (<table className="w-full text-left text-sm"><thead><tr className="border-b-2 border-orange-700"><th className="p-2">誤答数</th><th className="p-2">問題</th><th className="p-2">カテゴリ</th></tr></thead><tbody>{analyticsData.incorrectQuestions.map(q => (<tr key={q.id} className="border-b border-gray-700 hover:bg-gray-800/50"><td className="p-2 text-red-400 font-bold text-base">{q.count}</td><td className="p-2">{q.question}</td><td className="p-2 text-gray-400">{categoryShortNames[q.category]}</td></tr>))}</tbody></table>) : <p className="text-center text-gray-400 p-4">対象範囲に苦手な問題はありません。</p>}</div></CyberPanel><div className="md:col-span-2 text-center mt-4"><button onClick={() => handleResetData('log')} disabled={loading || !analyticsData || analyticsData.totalAnswered === 0} className="bg-red-700 text-white font-bold px-8 py-3 rounded-lg hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">表示範囲の学習ログをリセット</button></div></div>
        </div>
      ) : (playLogs.length === 0 && !loading && <CyberPanel><p className="text-center text-gray-400">データがありません。検索条件を指定して「データ取得」ボタンを押してください。</p></CyberPanel>)}

      <CyberPanel>
        <h2 className="text-2xl font-bold text-orange-300 mb-4">ランキング閲覧</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><label className="block text-sm text-gray-400 mb-1">学年</label><select name="grade" value={rankingFilters.grade} onChange={e => setRankingFilters(f => ({...f, grade: e.target.value}))} className={commonSelectClass}><option value="all">全学年</option>{[1, 2, 3].map(g => <option key={g} value={g}>{g}年</option>)}</select></div>
            <div><label className="block text-sm text-gray-400 mb-1">クラス</label><select name="class" value={rankingFilters.class} onChange={e => setRankingFilters(f => ({...f, class: e.target.value}))} className={commonSelectClass}><option value="all">全クラス</option>{[1, 2, 3, 4, 5, 6].map(c => <option key={c} value={c}>{c}組</option>)}</select></div>
            <div><label className="block text-sm text-gray-400 mb-1">分野</label><select name="category" value={rankingFilters.category} onChange={e => setRankingFilters(f => ({...f, category: e.target.value}))} className={commonSelectClass}><option value="all">全分野</option>{allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}<option value="weakness">弱点克服</option></select></div>
            <div><label className="block text-sm text-gray-400 mb-1">モード</label><select name="mode" value={rankingFilters.mode} onChange={e => setRankingFilters(f => ({...f, mode: e.target.value}))} className={commonSelectClass}><option value="all">全モード</option>{gameModes.map(m => <option key={m.key} value={m.key}>{m.label}</option>)}</select></div>
        </div>
        {isRankingLoading ? <p className="text-center text-orange-300">ランキング読込中...</p> : rankingError ? <p className="text-center text-red-500">{rankingError}</p> : <div className="max-h-80 overflow-y-auto pr-2"><ul className="space-y-2">{rankingData.length > 0 ? rankingData.map((entry, index) => (<li key={`${entry.timestamp}-${index}`} className="flex justify-between items-center p-2 bg-gray-800/50 rounded-md"><span><span className="font-bold w-8 inline-block">{index + 1}.</span>{entry.name}</span><span className="font-orbitron text-orange-300">{entry.score}点</span></li>)) : <p className="text-center text-gray-400">該当データなし</p>}</ul></div>}
      </CyberPanel>

      <CyberPanel>
          <h2 className="text-2xl font-bold text-red-400 mb-4">データリセット</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2"><label className="block text-sm text-gray-400 mb-1">リセット対象分野</label><select value={resetCategory} onChange={e => setResetCategory(e.target.value as Category | 'all' | 'weakness')} className={commonSelectClass}><option value="all">全分野</option>{allCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}<option value="weakness">弱点克服</option></select></div>
            <button onClick={() => handleResetData('ranking')} disabled={isResetting} className="w-full bg-red-700 text-white font-bold px-6 py-2 rounded-md hover:bg-red-600 disabled:bg-gray-600">{isResetting ? 'リセット中...' : 'ランキングをリセット'}</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">この操作はサーバー上のランキングデータを削除します。学習ログは削除されません。</p>
      </CyberPanel>
    </div>
  );
};

export default TeacherScreen;
