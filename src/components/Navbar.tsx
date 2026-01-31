
import React, { useState } from 'react';
import { Bell, Search, UserCircle, X, Clock, Users, User, Phone, ChevronRight } from 'lucide-react';
import { INITIAL_ALERTS, STUDENT_PARENT_DATA } from '../constants';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Reminders for bus notifications
  const reminders = [
    { id: 'rem-1', message: "Bus SB-042 starting afternoon route in 15 mins", time: "02:45 PM", type: "Reminder" },
    { id: 'rem-2', message: "Weekly maintenance due for Bus SB-015", time: "10:00 AM", type: "Reminder" },
    ...INITIAL_ALERTS.slice(0, 3)
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 sticky top-0 z-40">
      <h1 className="text-lg font-bold text-slate-800 truncate pr-4">
        {title}
      </h1>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student, parent..." 
            className="bg-transparent border-none focus:outline-none text-sm ml-2 w-48 text-slate-600 font-medium"
          />
        </div>
        
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Bus Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {reminders.map((alert) => (
                  <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${
                        alert.type === 'Emergency' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">{alert.message}</p>
                        <div className="flex items-center mt-1 text-[10px] text-slate-400 font-medium">
                          <Clock size={10} className="mr-1" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center bg-white">
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile Details Dropdown */}
        <div className="relative flex items-center space-x-2 pl-2 border-l border-slate-200">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-slate-800">Admin User</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Super Admin</p>
          </div>
          <button 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className="p-1 hover:bg-slate-50 rounded-full transition-colors"
          >
            <UserCircle size={36} className="text-slate-300" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-14 w-96 bg-white rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-black text-slate-800 tracking-tight">User Directory</h3>
                   <button onClick={() => setShowProfile(false)} className="text-slate-400">
                     <X size={18} />
                   </button>
                </div>
                <p className="text-xs text-slate-500 font-medium">Detailed Parent & Student Profiles</p>
              </div>
              
              <div className="p-4 max-h-[500px] overflow-y-auto space-y-3 custom-scrollbar">
                {STUDENT_PARENT_DATA.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-blue-600 shadow-sm">
                          {item.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 group-hover:text-blue-700 transition-colors">{item.studentName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.grade}</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black text-slate-500 uppercase tracking-widest">
                        {item.busId}
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-3 border-t border-slate-200/50">
                      <div className="flex items-center text-xs font-medium text-slate-600">
                        <User size={12} className="mr-2 text-slate-400" />
                        <span className="font-bold mr-1">Parent:</span> {item.parentName}
                      </div>
                      <div className="flex items-center text-xs font-medium text-slate-600">
                        <Phone size={12} className="mr-2 text-slate-400" />
                        <span className="font-bold mr-1">Phone:</span> {item.phone}
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all flex items-center justify-center">
                      Detailed Profile <ChevronRight size={12} className="ml-1" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Manage Full Directory
                </button>
              </div>
            </div>
          )}
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
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
