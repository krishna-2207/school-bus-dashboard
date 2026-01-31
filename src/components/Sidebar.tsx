
import React from 'react';
import { ICONS } from '../constants';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: NavigationTab[] = [
    'Dashboard',
    'Live Tracking',
    'Speed Monitor',
    'Alerts',
    'Driver Details',
    'Parents',
    'Settings'
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm z-20">
      <div className="p-6">
        <div className="flex items-center space-x-3 text-blue-600">
          <div className="bg-blue-100 p-2 rounded-lg">
            {ICONS.Bus}
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">BusGuard</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
              activeTab === item
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
            }`}
          >
            <span className={activeTab === item ? 'text-white' : 'text-slate-400'}>
              {ICONS[item as keyof typeof ICONS]}
            </span>
            <span>{item}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs text-slate-500 mb-2">School Status</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-semibold text-slate-700">All Buses Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
