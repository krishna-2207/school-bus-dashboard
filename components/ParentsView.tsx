
import React, { useState } from 'react';
import { Users, Bell, Eye, MapPin, Phone, Navigation, Bus, ChevronRight, Hash } from 'lucide-react';
import { STUDENT_PARENT_DATA } from '../constants';

const ParentsView: React.FC = () => {
  const [preferences, setPreferences] = useState({
    geofence: true,
    arrival: true,
    delay: true,
    emergency: true,
  });

  const togglePreference = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12">
      {/* Left Column: Management & Preferences */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Student-Parent Management Section */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-blue-600">
              <Users size={20} />
              <h3 className="text-xl font-bold text-slate-800">Student-Parent Management</h3>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline px-4 py-2 bg-blue-50 rounded-xl transition-all">
              Export Directory
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bus No.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {STUDENT_PARENT_DATA.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                          {item.avatar}
                        </div>
                        <span className="text-sm font-bold text-slate-800">{item.studentName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">
                        {item.grade}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600">{item.parentName}</td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-600 font-mono tracking-tighter">{item.phone}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-sm w-fit group-hover:shadow-blue-200 transition-all">
                        <Hash size={10} className="text-blue-200" />
                        <span className="text-[11px] font-black tracking-widest">
                          {item.busId}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Parent Notification Preferences */}
        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center space-x-3 text-blue-600">
            <Bell size={20} />
            <h3 className="text-xl font-bold text-slate-800">Parent Notification Preferences</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { id: 'geofence', label: 'Geofence Alerts', desc: "Notify when bus enters student's zone", state: preferences.geofence },
              { id: 'arrival', label: 'Arrival Notifications', desc: 'Send notification when bus arrives at stop', state: preferences.arrival },
              { id: 'delay', label: 'Delay Alerts', desc: 'Notify if bus is delayed more than 5 minutes', state: preferences.delay },
              { id: 'emergency', label: 'Emergency Alerts', desc: 'Instant notification for emergency situations', state: preferences.emergency },
            ].map((pref) => (
              <div key={pref.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100/50">
                <div>
                  <p className="text-sm font-black text-slate-800 tracking-tight">{pref.label}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{pref.desc}</p>
                </div>
                <button 
                  onClick={() => togglePreference(pref.id as keyof typeof preferences)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${pref.state ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${pref.state ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Right Column: Portal Preview */}
      <div className="lg:col-span-4 space-y-6">
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-fit sticky top-24">
          <div className="p-8 pb-4 flex items-center space-x-3 text-blue-600">
            <Eye size={20} />
            <h3 className="text-xl font-bold text-slate-800">Parent Portal Preview</h3>
          </div>
          
          <div className="p-8">
            {/* Phone Mockup Frame */}
            <div className="relative mx-auto w-full max-w-[280px] aspect-[9/18.5] bg-slate-50 rounded-[3rem] border-[8px] border-slate-200 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Phone Header */}
              <div className="bg-blue-600 p-6 pt-10 text-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black tracking-tight">SafeBus Parent App</h4>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </div>
                <p className="text-[10px] opacity-80 font-medium">Good morning, Sarah!</p>
              </div>

              {/* Phone Content Area */}
              <div className="flex-1 p-4 space-y-4">
                {/* Student Info */}
                <div className="flex items-center space-x-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-black text-blue-600">EJ</div>
                  <div>
                    <p className="text-[11px] font-black text-slate-800">Emma Johnson</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Grade 4</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2 text-emerald-600 mb-1">
                    <Bus size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">On the way</span>
                  </div>
                  <p className="text-[9px] text-emerald-800 font-bold">Bus SB-042 • ETA: 5 min</p>
                </div>

                {/* Location Card */}
                <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                   <div className="flex items-center space-x-2 text-blue-600 mb-1">
                    <MapPin size={12} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Current Location</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold">Near Maple Avenue</p>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <button className="bg-blue-50 text-blue-600 py-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition-active active:scale-95">
                    <Navigation size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Track Bus</span>
                  </button>
                  <button className="bg-blue-50 text-blue-600 py-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition-active active:scale-95">
                    <Phone size={14} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Call Driver</span>
                  </button>
                </div>
              </div>

              {/* Home Indicator */}
              <div className="h-1 w-16 bg-slate-300 rounded-full mx-auto mb-2 mt-2" />
            </div>
            
            <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Preview of what parents see in the mobile app
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParentsView;
