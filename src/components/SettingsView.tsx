
import React, { useState } from 'react';
import { Settings, MapPin, Gauge, Bell, Database, RotateCcw, Save, ShieldAlert } from 'lucide-react';

const SettingsView: React.FC = () => {
  const [geofenceRadius, setGeofenceRadius] = useState(1.0);
  const [settings, setSettings] = useState({
    enableGeofence: true,
    overspeedAlerts: true,
    accidentAlerts: true,
    routeDeviationAlerts: true,
    dailyReports: false,
    schoolName: 'Lincoln Elementary School',
    emergencyContact: '+1 (555) 911-0000',
    gpsInterval: 'Every 5 seconds',
    retention: '30 days'
  });

  const toggleSetting = (key: keyof typeof settings) => {
    if (typeof settings[key] === 'boolean') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center space-x-3 text-blue-600 mb-2">
        <Settings size={24} />
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-xs text-slate-400 font-medium">Configure your bus tracking system preferences</p>
        </div>
      </div>

      {/* Geofence Configuration */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex items-center space-x-3 text-blue-600">
          <MapPin size={20} />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Geofence Configuration</h3>
            <p className="text-[11px] text-slate-400 font-medium">Set the radius for student location geofences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Geofence Radius</label>
            <span className="text-xs font-black text-slate-400">{geofenceRadius.toFixed(1)} km</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="5.0" 
            step="0.1" 
            value={geofenceRadius} 
            onChange={(e) => setGeofenceRadius(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[10px] text-slate-400 font-medium italic">Parents will be notified when the bus enters this radius around their home</p>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
            <div>
              <p className="text-sm font-bold text-slate-800 tracking-tight">Enable Geofence Notifications</p>
              <p className="text-[11px] text-slate-400 font-medium">Send alerts when bus enters geofence</p>
            </div>
            <button 
              onClick={() => toggleSetting('enableGeofence')}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${settings.enableGeofence ? 'bg-blue-600' : 'bg-slate-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${settings.enableGeofence ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      {/* Speed Limit Thresholds */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex items-center space-x-3 text-blue-600">
          <Gauge size={20} />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Speed Limit Thresholds</h3>
            <p className="text-[11px] text-slate-400 font-medium">Configure speed limits for different zones</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'School Zone Speed Limit', val: 30 },
            { label: 'Residential Area Speed Limit', val: 40 },
            { label: 'Main Road Speed Limit', val: 50 },
            { label: 'Highway Speed Limit', val: 80 },
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <label className="text-xs font-bold text-slate-500">{item.label}</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  defaultValue={item.val}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 w-24 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="text-xs font-bold text-slate-400">km/h</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div className="flex items-center space-x-3 text-blue-600">
          <Bell size={20} />
          <div>
            <h3 className="text-lg font-bold text-slate-800">Notification Preferences</h3>
            <p className="text-[11px] text-slate-400 font-medium">Configure how and when notifications are sent</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { id: 'overspeedAlerts', label: 'Overspeed Alerts', desc: 'Notify when speed limit is exceeded', state: settings.overspeedAlerts },
            { id: 'accidentAlerts', label: 'Accident Detection Alerts', desc: 'Automatic emergency alerts on impact detection', state: settings.accidentAlerts },
            { id: 'routeDeviationAlerts', label: 'Route Deviation Alerts', desc: 'Notify when bus deviates from planned route', state: settings.routeDeviationAlerts },
            { id: 'dailyReports', label: 'Daily Summary Reports', desc: 'Send daily route summary to administrators', state: settings.dailyReports },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-100/50">
              <div>
                <p className="text-sm font-bold text-slate-800 tracking-tight">{pref.label}</p>
                <p className="text-[11px] text-slate-400 font-medium">{pref.desc}</p>
              </div>
              <button 
                onClick={() => toggleSetting(pref.id as keyof typeof settings)}
                className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${pref.state ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${pref.state ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* System Settings */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
        <div className="flex items-center space-x-3 text-blue-600">
          <Database size={20} />
          <div>
            <h3 className="text-lg font-bold text-slate-800">System Settings</h3>
            <p className="text-[11px] text-slate-400 font-medium">General system configuration</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">GPS Update Interval</label>
            <select 
              value={settings.gpsInterval}
              onChange={(e) => setSettings(prev => ({ ...prev, gpsInterval: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option>Every 5 seconds</option>
              <option>Every 10 seconds</option>
              <option>Every 30 seconds</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500">Data Retention Period</label>
            <select 
              value={settings.retention}
              onChange={(e) => setSettings(prev => ({ ...prev, retention: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500">School Name</label>
            <input 
              type="text" 
              value={settings.schoolName}
              onChange={(e) => setSettings(prev => ({ ...prev, schoolName: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-500">Emergency Contact Number</label>
            <input 
              type="text" 
              value={settings.emergencyContact}
              onChange={(e) => setSettings(prev => ({ ...prev, emergencyContact: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
          <RotateCcw size={18} />
          <span>Reset to Defaults</span>
        </button>
        <button className="flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-900/20">
          <Save size={18} />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsView;
