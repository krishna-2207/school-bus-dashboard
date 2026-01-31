
import React from 'react';
import { User, Phone, FileText, Bus, Map, School, Users, Mail, UserCheck, MessageCircle } from 'lucide-react';
import { STUDENT_PARENT_DATA } from '../constants';

const DriverDetails: React.FC = () => {
  const driver = {
    name: 'Robert Jenkins',
    photo: 'https://picsum.photos/seed/driver/300/300',
    phone: '+1 (555) 012-3456',
    license: 'L-9843-221-0',
    busNumber: 'BUS-204A',
    route: 'Westside - Central Loop',
    capacity: 52,
    school: 'Greenwood Elementary'
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        
        <div className="px-8 pb-8">
          {/* Profile Header */}
          <div className="relative -mt-12 flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6 mb-12">
            <img 
              src={driver.photo} 
              alt={driver.name} 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover"
            />
            <div className="flex-1 pb-2">
              <h2 className="text-2xl font-bold text-slate-800">{driver.name}</h2>
              <div className="flex items-center text-slate-500 text-sm mt-1">
                <Bus size={14} className="mr-1.5" />
                Senior Driver • 8 Years Exp.
              </div>
            </div>
            <div className="pb-2">
               <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center">
                 <Phone size={18} className="mr-2" />
                 Contact Driver
               </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Personal Information</h3>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-800">{driver.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">License Number</p>
                  <p className="text-sm font-semibold text-slate-800">{driver.license}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Vehicle & Route Info</h3>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <Bus size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Bus Number</p>
                  <p className="text-sm font-semibold text-slate-800">{driver.busNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <Map size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Route Name</p>
                  <p className="text-sm font-semibold text-slate-800">{driver.route}</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
               <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b pb-2">Institutional Details</h3>
               <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <School size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">School Name</p>
                  <p className="text-sm font-semibold text-slate-800">{driver.school}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Route Capacity</p>
                  <p className="text-sm font-semibold text-slate-800">{driver.capacity} Students</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* NEW: Parent & Student Directory Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center space-x-3 text-slate-800">
            <UserCheck size={20} className="text-blue-600" />
            <h3 className="text-xl font-bold tracking-tight">Parent & Student Directory</h3>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {STUDENT_PARENT_DATA.length} Active Profiles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDENT_PARENT_DATA.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-sm font-black text-blue-600 shadow-sm transition-transform group-hover:scale-110">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{item.studentName}</h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.grade}</span>
                  </div>
                </div>
                <div className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest">
                  Verified
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{item.parentName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium italic">Primary Parent</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{item.phone}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <MessageCircle size={14} />
                    </button>
                    <button className="p-1.5 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Mail size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DriverDetails;
