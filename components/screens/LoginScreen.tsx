
import React, { useState } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type UserInfo, type Screen } from '../../types';

interface LoginScreenProps {
  onLogin: (userInfo: UserInfo) => void;
  onNavigate: (screen: Screen) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigate }) => {
  const [grade, setGrade] = useState('2');
  const [className, setClassName] = useState('1');
  const [studentId, setStudentId] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (grade && className && studentId) {
      onLogin({ grade, class: className, studentId });
    } else {
      alert('すべての項目を選択してください。');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-4 fade-in">
      <h1 className="text-6xl font-orbitron mb-4 glow-primary">英語HACK</h1>
      <p className="text-orange-200 mb-10">中学英語 学習プラットフォーム</p>

      <CyberPanel className="w-full max-w-sm">
        <h2 className="text-2xl text-orange-200 mb-6">ユーザーを選択してください</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg text-orange-200 mb-2">学年</label>
            <select value={grade} onChange={e => setGrade(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-orange-700">
              <option value="1">1年</option>
              <option value="2">2年</option>
              <option value="3">3年</option>
            </select>
          </div>
          <div>
            <label className="block text-lg text-orange-200 mb-2">クラス</label>
            <select value={className} onChange={e => setClassName(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-orange-700">
              {['1', '2', '3', '4', '5', '6'].map(c => <option key={c} value={c}>{c}組</option>)}
            </select>
          </div>
          <div>
            <label className="block text-lg text-orange-200 mb-2">番号</label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-orange-700">
              {Array.from({ length: 40 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}番</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white font-bold text-xl py-3 mt-4 rounded-lg hover:bg-orange-500 transition-colors">
            学習をはじめる
          </button>
        </form>
      </CyberPanel>
      
      <div className="absolute top-4 right-4">
        <button onClick={() => onNavigate('teacher_login')} className="text-sm text-orange-400 hover:underline">先生用</button>
      </div>

       <div className="absolute bottom-4 right-4 text-xs text-gray-500">
        presented by onokomachi
      </div>
    </div>
  );
};

export default LoginScreen;
