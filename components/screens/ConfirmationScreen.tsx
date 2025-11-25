
import React from 'react';
import CyberPanel from '../ui/CyberPanel';

interface ConfirmationScreenProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 fade-in">
      <CyberPanel className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">操作の確認</h2>
        <p className="text-lg text-gray-200 whitespace-pre-wrap mb-8">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-orange-600 text-white font-bold rounded-md hover:bg-orange-500 transition-colors"
          >
            いいえ
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-700 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
          >
            はい
          </button>
        </div>
      </CyberPanel>
    </div>
  );
};

export default ConfirmationScreen;