
import React, { useState } from 'react';
import CyberPanel from '../ui/CyberPanel';
import { type Screen } from '../../types';

const TEACHER_PASSWORD = '215124';

interface TeacherLoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({ onNavigate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEACHER_PASSWORD) {
      onNavigate('teacher_panel');
    } else {
      setError('パスワードが違います。');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 fade-in">
      <h1 className="text-4xl font-orbitron mb-6 glow-primary">教員用ログイン</h1>
      
      <CyberPanel className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800/80 border border-orange-600 rounded-md px-4 py-2 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="w-full bg-orange-600 px-6 py-3 rounded-md hover:bg-orange-500 transition-colors font-bold"
          >
            認証
          </button>
          {error && <p className="text-red-500 pt-2">{error}</p>}
        </form>
      </CyberPanel>

      <button onClick={() => onNavigate('home')} className="mt-8 text-orange-300 hover:underline">
        トップに戻る
      </button>
    </div>
  );
};

export default TeacherLoginScreen;