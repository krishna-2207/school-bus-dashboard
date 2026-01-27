
import React from 'react';
import { TrendingUp, Award, AlertTriangle, MapPin, CheckCircle2 } from 'lucide-react';
import { BusState } from '../types';

interface SpeedMonitorProps {
  busState: BusState;
}

const SpeedMonitor: React.FC<SpeedMonitorProps> = ({ busState }) => {
  const speedLimit = 50;
  const currentSpeed = Math.round(busState.speed);
  
  // Data for Violation Log
  const violations = [
    { time: '08:30 AM', speed: '52 km/h', limit: '40 km/h', location: 'School Zone - Oak St', status: 'Reviewed' },
    { time: '08:15 AM', speed: '48 km/h', limit: '45 km/h', location: 'Residential - Maple Ave', status: 'Reviewed' },
    { time: 'Yesterday', speed: '55 km/h', limit: '50 km/h', location: 'Main Road', status: 'Reviewed' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row: Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Speed Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full flex items-center space-x-2 mb-6 text-slate-800">
            <div className="text-blue-500"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-lg">Current Speed</h3>
          </div>
          
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeDasharray="125 250" strokeLinecap="round" />
              {/* Progress Circle */}
              <circle 
                cx="50" cy="50" r="40" fill="none" 
                stroke={currentSpeed > speedLimit ? "#ef4444" : "#10b981"} 
                strokeWidth="8" 
                strokeDasharray={`${Math.min(currentSpeed, 100) * 1.25} 250`} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-extrabold text-slate-800">{currentSpeed}</span>
              <span className="text-sm text-slate-400 font-medium">km/h</span>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Speed Limit</p>
            <p className="text-xl font-bold text-slate-800">{speedLimit} km/h</p>
          </div>
        </div>

        {/* Speed History Chart Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="w-full flex items-center space-x-2 mb-6 text-slate-800">
            <div className="text-blue-500"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-lg">Speed History</h3>
          </div>
          
          <div className="h-40 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
              {/* Grid Lines */}
              {[0, 50, 100, 150].map(y => (
                <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              ))}
              {/* Limit Line */}
              <line x1="0" y1="60" x2="400" y2="60" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4" />
              <text x="220" y="55" fill="#94a3b8" fontSize="12" className="font-medium">Limit</text>
              
              {/* Data Path */}
              <path 
                d="M 0 200 L 40 120 L 80 80 L 120 40 L 160 60 L 200 30 L 240 10 L 280 120 L 320 130 L 360 80 L 400 100" 
                fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
              />
              {/* Data Points */}
              {[
                {x: 40, y: 120}, {x: 80, y: 80}, {x: 120, y: 40}, {x: 160, y: 60}, {x: 200, y: 30}, {x: 240, y: 10}, {x: 280, y: 120}
              ].map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
              ))}
            </svg>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
              <span>08:00</span>
              <span>08:15</span>
              <span>08:30</span>
              <span>08:45</span>
            </div>
          </div>
        </div>

        {/* Safe Driving Score Card */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full flex items-center space-x-2 mb-6 text-slate-800">
            <div className="text-blue-500"><Award size={20} /></div>
            <h3 className="font-bold text-lg">Safe Driving Score</h3>
          </div>
          
          <div className="relative w-36 h-36 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="231 251" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-800">92</span>
              <span className="text-xs text-slate-400 font-bold">/ 100</span>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <span className="inline-block bg-emerald-500 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-widest">
              Excellent
            </span>
            <p className="text-xs text-slate-500 font-medium pt-2">Top 10% of drivers</p>
          </div>
        </div>

      </div>

      {/* Bottom Row: Violation Log */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center space-x-3">
          <div className="text-amber-500"><AlertTriangle size={24} /></div>
          <h3 className="text-xl font-bold text-slate-800">Speed Violation Log</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Recorded Speed</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Speed Limit</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {violations.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm font-bold text-slate-700">{log.time}</td>
                  <td className="px-6 py-5 text-sm font-bold text-red-500">{log.speed}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{log.limit}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-slate-300" />
                      {log.location}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-full text-[10px] font-bold uppercase tracking-wide">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SpeedMonitor;
