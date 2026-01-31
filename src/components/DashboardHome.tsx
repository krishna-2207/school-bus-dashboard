import React, { useState, useEffect } from 'react';
import MapSection from './MapSection';
import { ICONS, INITIAL_ALERTS, SCHOOL_LOCATION, BUS_STOPS, DIVERSION_POINTS } from '../constants';
import { BusState, StudentMarker } from '../types';
import {
  Users,
  CheckCircle,
  Clock,
  Map,
  Activity,
  Wifi,
  Bus as BusIcon,
  TrendingUp,
  UserCheck,
  Navigation,
  PhoneCall,
  ShieldAlert,
  Car,
  Zap,
  Bell,
  Heart,
  Phone,
  AlertCircle,
  ArrowRightLeft,
  ShieldCheck,
  Info,
  AlertTriangle,
  Shield
} from 'lucide-react';


interface DashboardHomeProps {
  busState: BusState;
  studentLocations: StudentMarker[];
}

interface LogEntry {
  id: string;
  name: string;
  action: string;
  time: string;
  location: string;
  eta: string;
  status: 'On Bus' | 'Dropped' | 'Awaiting';
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ busState, studentLocations }) => {
  const currentSpeed = Math.round(busState.speed);
  const speedLimit = 50;

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 'l1', name: 'Emma W.', action: 'Boarded', time: '08:14 AM', location: 'Emma\'s Home', eta: '--', status: 'On Bus' },
    { id: 'l2', name: 'Liam S.', action: 'Boarded', time: '08:31 AM', location: 'Liam\'s Home', eta: '--', status: 'On Bus' },
    { id: 'l3', name: 'Noah K.', action: 'Scheduled', time: 'Pending', location: 'Noah\'s Home', eta: '12 mins', status: 'Awaiting' },
    { id: 'l4', name: 'Olivia R.', action: 'Scheduled', time: 'Pending', location: 'Olivia\'s Home', eta: '24 mins', status: 'Awaiting' },
  ]);

  useEffect(() => {
    const checkProximity = () => {
      setLogs(currentLogs => {
        let changed = false;
        const nextLogs = currentLogs.map(log => {
          const stopLocation = BUS_STOPS.find(s => s.name === log.location);
          if (stopLocation) {
            const dist = Math.sqrt(Math.pow(busState.x - stopLocation.x, 2) + Math.pow(busState.y - stopLocation.y, 2));
            if (dist < 15 && log.status === 'Awaiting') {
              changed = true;
              const now = new Date();
              return {
                ...log,
                action: 'Boarded',
                time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                eta: '--',
                status: 'On Bus' as const
              };
            }
          }
          return log;
        });
        return changed ? nextLogs : currentLogs;
      });
    };
    checkProximity();
  }, [busState.x, busState.y]);

  return (
    <div className="space-y-8 pb-12">
      {/* Route Diversion Notification Bar */}
      {busState.isDiverted && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between shadow-lg shadow-amber-900/5 animate-pulse">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
              <ArrowRightLeft size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-900 leading-tight">Diversion Detected</h3>
              <p className="text-sm text-amber-700 font-medium">The bus has deviated from the standard route due to <span className="font-bold underline">Road Construction</span>.</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Est. Delay</p>
              <p className="text-xl font-black text-amber-900">+5:30m</p>
            </div>
            <button className="px-6 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-amber-700 transition-all">
              View Reason
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Tracking View */}
        <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2 text-slate-800">
              <div className="text-blue-600 bg-blue-50 p-2 rounded-xl"><Map size={20} /></div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Live Fleet Map</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Real-time Location Stream</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${busState.isDiverted ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {busState.isDiverted ? <Navigation size={12} /> : <CheckCircle size={12} />}
                <span>{busState.isDiverted ? 'Diversion Active' : 'Optimal Route'}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[450px]">
            <MapSection busState={busState} studentLocations={studentLocations} />
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div className="lg:col-span-4 flex flex-col space-y-8">
          {/* Status Monitor Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className={`p-3 rounded-2xl mb-3 ${busState.status === 'Stopped' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                <BusIcon size={24} />
              </div>
              <p className="text-sm font-black text-slate-800 tracking-tight">{busState.status}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Bus Status</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className={`p-3 rounded-2xl mb-3 ${busState.gpsSignal === 'Strong' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                <Wifi size={24} />
              </div>
              <p className="text-sm font-black text-slate-800 tracking-tight">{busState.gpsSignal}</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">GPS Signal</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center space-x-2 mb-4 text-slate-800">
              <div className="text-blue-500"><TrendingUp size={18} /></div>
              <h3 className="font-bold text-sm uppercase tracking-widest">Telemetry</h3>
            </div>
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f8fafc" strokeWidth="8" strokeLinecap="round" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={currentSpeed > speedLimit ? "#ef4444" : "#3b82f6"}
                  strokeWidth="8"
                  strokeDasharray={`${(currentSpeed / 80) * 251} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-slate-800 tracking-tighter">{currentSpeed}</span>
                <span className="text-[8px] text-slate-400 font-black uppercase">km/h</span>
              </div>
            </div>
            <div className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Idle</span>
              <span>Limit {speedLimit}</span>
              <span>Max 80</span>
            </div>
          </div>

          {/* Traffic Insights */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-red-500 bg-red-50 p-2 rounded-xl"><Car size={18} /></div>
              <h3 className="font-bold text-sm">Real-time Traffic</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Impact</p>
                  <p className={`text-lg font-black ${busState.trafficStatus === 'Clear' ? 'text-emerald-600' : 'text-red-600'}`}>{busState.trafficStatus || 'Stable'}</p>
                </div>
                <Activity size={24} className={busState.trafficStatus === 'Heavy' ? 'text-red-400' : 'text-emerald-400'} />
              </div>
              <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                Route conditions are being updated every 5 seconds using external traffic telemetry.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Verified Students', value: '26 / 32', icon: <UserCheck size={24} />, color: 'blue' },
          { label: 'Network Stability', value: '99.8%', icon: <Wifi size={24} />, color: 'emerald' },
          { label: 'Route Efficiency', value: '94%', icon: <Navigation size={24} />, color: 'amber' },
          { label: 'System Health', value: 'Secure', icon: <ShieldCheck size={24} />, color: 'purple' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-5 hover:translate-y-[-4px] transition-all cursor-pointer group">
            <div className={`p-4 bg-${stat.color}-50 text-${stat.color}-600 rounded-2xl group-hover:bg-${stat.color}-600 group-hover:text-white transition-colors`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AT THE BOTTOM: Accident Alerts & Emergency Management */}
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-red-100 overflow-hidden">
        <div className="p-8 border-b border-red-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-red-50/10">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-900/20">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Accident & Critical Alerts</h3>
              <p className="text-sm text-slate-500 font-medium">Automatic incident detection and emergency dispatch triggers.</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <ShieldCheck size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Active System Secured</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Indicator */}
            <div className="flex items-center space-x-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center">
                  <Shield size={32} className="text-slate-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-50 flex items-center justify-center">
                  <CheckCircle size={14} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">Impact Detection</p>
                <p className="text-2xl font-black text-emerald-600">No Incidents</p>
                <p className="text-xs text-slate-400 font-medium mt-1">Bus SB-042: Normal G-Force levels detected.</p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Rapid Response Channels</p>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-95">
                  <Bell size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Police</span>
                </button>
                <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95">
                  <Heart size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Hospital</span>
                </button>
                <button className="flex flex-col items-center justify-center space-y-2 p-4 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 hover:bg-amber-600 hover:text-white transition-all shadow-sm active:scale-95">
                  <PhoneCall size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Admin</span>
                </button>
              </div>
            </div>
          </div>

          {/* Alert History Small Table */}
          <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Alert History</span>
              <button className="text-[10px] font-black text-blue-600 uppercase hover:underline">Full Log</button>
            </div>
            <div className="divide-y divide-slate-100">
              {[
                { id: 'h1', time: 'Yesterday', type: 'System', msg: 'Emergency Button Calibration Check Successful', status: 'OK' },
                { id: 'h2', time: '2 Days Ago', type: 'Overspeed', msg: 'Bus SB-042 exceeded 55km/h on Highway 10', status: 'Logged' }
              ].map(h => (
                <div key={h.id} className="px-6 py-3 flex items-center justify-between text-xs font-medium text-slate-600">
                  <span className="w-24 text-slate-400">{h.time}</span>
                  <span className="flex-1 px-4">{h.msg}</span>
                  <span className="text-emerald-500 font-black">{h.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
