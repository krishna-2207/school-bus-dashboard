
import React from 'react';
import MapSection from './MapSection';
import { BUS_STOPS } from '../constants';
import { BusState, StudentMarker } from '../types';
import { MapPin, Clock, Navigation, Timer, Wifi, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface LiveTrackingProps {
  busState: BusState;
  studentLocations: StudentMarker[];
}

const LiveTracking: React.FC<LiveTrackingProps> = ({ busState, studentLocations }) => {
  const getStopStatus = (stop: any) => {
    const dist = Math.sqrt(Math.pow(busState.x - stop.x, 2) + Math.pow(busState.y - stop.y, 2));
    if (dist < 30) return 'current';
    
    const stopIndex = BUS_STOPS.findIndex(s => s.id === stop.id);
    const busProgressIndex = Math.floor((busState.x / 800) * BUS_STOPS.length);
    
    if (stopIndex < busProgressIndex) return 'completed';
    return 'upcoming';
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Fleet Intelligence</h2>
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Monitoring • Route #204 Alpha</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center shadow-lg">
            Focus Vehicle <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
        {/* Hero Map Container */}
        <div className="lg:col-span-8 flex flex-col min-h-[500px]">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-2 flex-1 relative overflow-hidden group">
            <MapSection busState={busState} studentLocations={studentLocations} />
            
            {/* Quick Analytics Overlay */}
            <div className="absolute top-10 left-10 flex flex-col space-y-3 pointer-events-none group-hover:translate-x-1 transition-transform duration-500">
              <div className="bg-[#1e2129]/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-2xl flex items-center space-x-3">
                <Wifi size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Signal: 42ms (Stable)</span>
              </div>
              <div className="bg-[#1e2129]/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-2xl flex items-center space-x-3">
                <Timer size={14} className="text-emerald-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">On Schedule: +1.2m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stop Management Sidebar */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Trip Timeline</h3>
                <p className="text-lg font-black text-slate-800 tracking-tight">Stops Overview</p>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">
                STAY SAFE
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div className="relative space-y-10">
                {/* Visual Route Line */}
                <div className="absolute left-[13px] top-4 bottom-4 w-1 bg-slate-50 rounded-full" />
                
                {BUS_STOPS.map((stop, idx) => {
                  const status = getStopStatus(stop);
                  return (
                    <div key={stop.id} className="relative pl-12">
                      {/* Timeline Node */}
                      <div className={`absolute left-0 top-0 w-7 h-7 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center transition-all duration-700 z-10 ${
                        status === 'completed' ? 'bg-emerald-500 scale-90' :
                        status === 'current' ? 'bg-blue-600 ring-8 ring-blue-50 scale-110' :
                        'bg-slate-100'
                      }`}>
                        {status === 'completed' && <CheckCircle2 size={12} color="white" />}
                        {status === 'current' && <Navigation size={12} color="white" />}
                        {status === 'upcoming' && <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
                      </div>
                      
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className={`text-sm font-black tracking-tight ${status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>
                            {stop.name}
                          </h4>
                          <div className="flex items-center mt-1 space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span className="flex items-center"><Clock size={10} className="mr-1" /> {stop.time}</span>
                             {stop.distance && <span className="flex items-center opacity-60"><MapPin size={10} className="mr-1" /> {stop.distance}</span>}
                          </div>
                        </div>
                        {status === 'current' && (
                          <div className="flex flex-col items-end">
                            <span className="text-[8px] bg-blue-600 text-white px-3 py-1 rounded-full font-black tracking-widest animate-pulse border-2 border-blue-100 mb-1">
                              LIVE
                            </span>
                            <span className="text-[10px] font-black text-blue-600">ON SITE</span>
                          </div>
                        )}
                        {status === 'upcoming' && stop.eta && (
                          <span className="text-[10px] font-black text-blue-500 uppercase">ETA {stop.eta}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weather & Road Condition Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Road Conditions</span>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Excellent</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[92%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default LiveTracking;
