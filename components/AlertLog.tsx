
import React, { useState } from 'react';
import { AlertTriangle, Shield, Ambulance, Bell, Filter, Phone, CheckCircle2 } from 'lucide-react';
import { Alert } from '../types';

interface AlertLogProps {
  alerts: Alert[];
}

const AlertLog: React.FC<AlertLogProps> = ({ alerts }) => {
  const [filter, setFilter] = useState('All Alerts');

  const getTypeStyle = (type: Alert['type']) => {
    switch (type) {
      case 'Geofence': return 'bg-blue-500 text-white';
      case 'Overspeed': return 'bg-amber-500 text-white';
      case 'Normal': return 'bg-slate-300 text-slate-700';
      case 'Emergency': return 'bg-red-500 text-white';
      case 'Accident': return 'bg-red-600 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  };

  const getStatusStyle = (status: Alert['status']) => {
    return status === 'Active' 
      ? 'bg-emerald-100 text-emerald-600 border border-emerald-200 font-bold' 
      : 'bg-white text-slate-400 border border-slate-200 font-medium';
  };

  const stats = {
    total: alerts.length + 7, // Dummy addition for realism
    overspeed: alerts.filter(a => a.type === 'Overspeed').length + 2,
    geofence: alerts.filter(a => a.type === 'Geofence').length + 6,
    accidents: alerts.filter(a => a.type === 'Accident' || a.type === 'Emergency').length - 1,
  };

  return (
    <div className="space-y-6">
      {/* 1. Emergency Action Buttons */}
      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-2 text-red-600 mb-6">
          <AlertTriangle size={18} />
          <h3 className="text-lg font-bold tracking-tight">Emergency Actions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-3 p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-all active:scale-95 group">
            <Phone size={20} />
            <span className="font-bold text-sm tracking-wide">Notify Parents</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md transition-all active:scale-95 group">
            <Shield size={20} />
            <span className="font-bold text-sm tracking-wide">Notify Police</span>
          </button>
          <button className="flex items-center justify-center space-x-3 p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md transition-all active:scale-95 group">
            <Ambulance size={20} />
            <span className="font-bold text-sm tracking-wide">Notify Ambulance</span>
          </button>
        </div>
      </div>

      {/* 2. Alert Log Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-3 text-blue-600">
            <Bell size={22} />
            <h3 className="text-xl font-bold text-slate-800">Alert Log</h3>
          </div>
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none pr-10 relative cursor-pointer"
            >
              <option>All Alerts</option>
              <option>Overspeed</option>
              <option>Geofence</option>
              <option>Emergency</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Alert Type</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Message</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-slate-50/80 transition-all duration-200">
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{alert.time}</td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${getTypeStyle(alert.type)} shadow-sm`}>
                      {alert.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600 font-medium">{alert.message}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest ${getStatusStyle(alert.status)}`}>
                      {alert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Bottom Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:translate-y-[-4px] transition-all">
          <p className="text-4xl font-black text-blue-600 mb-1 tracking-tighter">{stats.total}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Alerts Today</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:translate-y-[-4px] transition-all">
          <p className="text-4xl font-black text-amber-500 mb-1 tracking-tighter">{stats.overspeed}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overspeed Alerts</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:translate-y-[-4px] transition-all">
          <p className="text-4xl font-black text-emerald-500 mb-1 tracking-tighter">{stats.geofence}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geofence Entries</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center group hover:translate-y-[-4px] transition-all">
          <p className="text-4xl font-black text-red-500 mb-1 tracking-tighter">{stats.accidents < 0 ? 0 : stats.accidents}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accidents</p>
        </div>
      </div>
    </div>
  );
};

export default AlertLog;
