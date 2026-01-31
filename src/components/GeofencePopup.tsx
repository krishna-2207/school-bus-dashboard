
import React from 'react';
import { Bus, X } from 'lucide-react';

interface GeofencePopupProps {
  studentName: string | null;
  onClose: () => void;
}

const GeofencePopup: React.FC<GeofencePopupProps> = ({ studentName, onClose }) => {
  if (!studentName) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 flex items-center space-x-4 min-w-[300px]">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600 relative overflow-hidden">
          <Bus size={24} />
          <div className="absolute inset-0 bg-blue-400 opacity-20 animate-ping"></div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-sm">Geofence Alert</h4>
          <p className="text-xs text-slate-500">Bus is near <span className="text-blue-600 font-semibold">{studentName}'s location</span></p>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      <style>{`
        @keyframes bounce-in {
          0% { transform: translate(-50%, 100%); opacity: 0; }
          70% { transform: translate(-50%, -10px); opacity: 1; }
          100% { transform: translate(-50%, 0); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GeofencePopup;
