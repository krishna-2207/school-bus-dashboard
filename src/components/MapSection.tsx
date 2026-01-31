
import React, { useState, useMemo } from 'react';
import { Bus, Crosshair, Plus, Minus, Navigation, Home, Search, Info, TrafficCone, AlertTriangle } from 'lucide-react';
import { BusState, StudentMarker } from '../types';
import { SCHOOL_LOCATION, ACTIVE_BUS_ROUTE_PATH, TRAFFIC_ZONES, DIVERSION_POINTS } from '../constants';

interface MapSectionProps {
  busState: BusState & { heading?: number };
  studentLocations: StudentMarker[];
}

const MapSection: React.FC<MapSectionProps> = ({ busState, studentLocations }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(2.2);

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.3, 5));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.3, 1.0));
  };

  const BASE_WIDTH = 800;
  const BASE_HEIGHT = 600;
  const viewBoxWidth = BASE_WIDTH / zoomLevel;
  const viewBoxHeight = BASE_HEIGHT / zoomLevel;
  
  const viewBoxX = Math.max(0, Math.min(BASE_WIDTH - viewBoxWidth, busState.x - viewBoxWidth / 2));
  const viewBoxY = Math.max(0, Math.min(BASE_HEIGHT - viewBoxHeight, busState.y - viewBoxHeight / 2));

  const urbanElements = useMemo(() => {
    const elements = [];
    const blockSize = 100;
    const roadWidth = 24;
    const buildingPadding = 18;
    
    for (let bx = 0; bx < 8; bx++) {
      for (let by = 0; by < 6; by++) {
        const blockStartX = bx * blockSize + roadWidth / 2 + buildingPadding;
        const blockStartY = by * blockSize + roadWidth / 2 + buildingPadding;
        const blockAvailableWidth = blockSize - roadWidth - buildingPadding * 2;
        const blockAvailableHeight = blockSize - roadWidth - buildingPadding * 2;

        const clusterType = Math.random() > 0.7 ? 'commercial' : 'residential';
        const numBuildings = clusterType === 'commercial' ? 1 : 2;

        for (let i = 0; i < numBuildings; i++) {
          const w = clusterType === 'commercial' ? blockAvailableWidth * 0.9 : blockAvailableWidth * 0.45;
          const h = clusterType === 'commercial' ? blockAvailableHeight * 0.9 : blockAvailableHeight * 0.45;
          
          const offsetX = i * (w + 4);
          const offsetY = Math.random() * (blockAvailableHeight - h);

          if (offsetX + w <= blockAvailableWidth) {
             elements.push({
              id: `block-${bx}-${by}-${i}`,
              x: blockStartX + offsetX,
              y: blockStartY + offsetY,
              w, h,
              type: clusterType,
              color: clusterType === 'commercial' ? '#2d3340' : '#212630',
              stories: clusterType === 'commercial' ? 3 : 1
            });
          }
        }
      }
    }
    return elements;
  }, []);

  return (
    <div className="relative bg-[#0d0f14] rounded-[2.5rem] h-full min-h-[500px] overflow-hidden border border-slate-800 shadow-2xl">
      {/* Search & UI Overlay */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <div className="bg-[#1a1e28]/95 backdrop-blur-xl rounded-2xl border border-white/10 p-4 shadow-2xl pointer-events-auto flex items-center space-x-4 w-72 transition-all hover:scale-[1.02]">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
            <Bus size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Route Intelligence</h3>
            <p className="text-sm font-black text-white">{busState.trafficStatus === 'Rerouting' ? 'Diverted Path' : 'Standard Route'}</p>
          </div>
        </div>
      </div>

      {/* Traffic Legend Overlay */}
      <div className="absolute top-6 right-6 z-20 bg-[#1a1e28]/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5 shadow-lg flex flex-col space-y-1">
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Heavy</span>
         </div>
         <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Moderate</span>
         </div>
      </div>

      {/* Navigation Controls Overlay */}
      <div className="absolute bottom-8 right-8 flex flex-col space-y-3 z-30">
        <div className="bg-[#1a1e28]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
          <button onClick={zoomIn} className="p-4 text-slate-300 hover:text-white hover:bg-white/5 transition-all active:scale-90"><Plus size={22} strokeWidth={2.5} /></button>
          <div className="h-px bg-white/5 mx-2" />
          <button onClick={zoomOut} className="p-4 text-slate-300 hover:text-white hover:bg-white/5 transition-all active:scale-90"><Minus size={22} strokeWidth={2.5} /></button>
        </div>
        <button className="p-5 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-900/60 hover:bg-blue-500 transition-all active:scale-95 flex items-center justify-center">
          <Navigation size={24} fill="currentColor" strokeWidth={0} />
        </button>
      </div>

      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
        style={{ transition: 'viewBox 0.1s ease-out' }}
      >
        <defs>
          <pattern id="roadMarkings" x="0" y="0" width="10" height="20" patternUnits="userSpaceOnUse">
            <rect x="4.5" y="4" width="1" height="12" fill="rgba(255,255,255,0.08)" />
          </pattern>
          <radialGradient id="busShadowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Base Map Layers */}
        <rect width="800" height="600" fill="#0b0d11" />

        {/* Professional Road Network Layer */}
        <g id="road-network">
          {[100, 200, 300, 400, 500, 600, 700].map(x => (
            <g key={`v-road-${x}`}>
              <rect x={x - 12} y="0" width="24" height="600" fill="#1c212b" />
              <rect x={x - 0.5} y="0" width="1" height="600" fill="url(#roadMarkings)" />
            </g>
          ))}
          {[100, 200, 300, 400, 500].map(y => (
            <g key={`h-road-${y}`}>
              <rect x="0" y={y - 12} width="800" height="24" fill="#1c212b" />
              <rect x="0" y={y - 0.5} width="800" height="1" fill="rgba(255,255,255,0.04)" />
            </g>
          ))}
        </g>

        {/* Live Traffic Overlay */}
        <g id="traffic-highlights">
          {TRAFFIC_ZONES.map(tz => (
            <line 
              key={tz.id} 
              x1={tz.x1} y1={tz.y1} x2={tz.x2} y2={tz.y2} 
              stroke={tz.level === 'Heavy' ? '#ef4444' : (tz.level === 'Moderate' ? '#f59e0b' : '#b91c1c')} 
              strokeWidth="10" 
              strokeOpacity="0.4" 
              strokeLinecap="round" 
            />
          ))}
        </g>

        {/* Navigation Route Highlight */}
        <g id="nav-path">
          <path d={busState.routePath || ACTIVE_BUS_ROUTE_PATH} stroke="#1d4ed8" strokeWidth="12" fill="none" strokeLinecap="round" opacity="0.15" />
          <path d={busState.routePath || ACTIVE_BUS_ROUTE_PATH} stroke="#3b82f6" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Diversion Markers */}
        <g id="diversions">
          {DIVERSION_POINTS.map((dp, i) => (
            <g key={i} transform={`translate(${dp.x}, ${dp.y})`}>
               <rect x="-12" y="-12" width="24" height="24" rx="4" fill="#b91c1c" />
               <AlertTriangle size={14} color="white" x="-7" y="-7" />
               <text y="24" fontSize="7" fontWeight="bold" fill="#ef4444" textAnchor="middle" className="uppercase tracking-widest">{dp.label}</text>
            </g>
          ))}
        </g>

        {/* Urban Architecture Layer */}
        <g id="buildings">
          {urbanElements.map(el => (
            <g key={el.id}>
              <rect x={el.x + 1} y={el.y + 1} width={el.w} height={el.h + (el.stories * 3)} fill="rgba(0,0,0,0.5)" rx="3" />
              <rect x={el.x} y={el.y} width={el.w} height={el.h} fill={el.color} rx="3" stroke="#ffffff08" strokeWidth="0.5" />
            </g>
          ))}
        </g>

        {/* Indicators */}
        {studentLocations.map((student) => (
          <g key={student.id} transform={`translate(${student.x}, ${student.y})`}>
            <circle r="14" fill="rgba(16, 185, 129, 0.08)" className="animate-pulse" />
            <circle r="4.5" fill="#10b981" />
            <text y="-14" fontSize="7.5" fontWeight="900" fill="#94a3b8" textAnchor="middle" className="uppercase tracking-tighter">
              {student.name}
            </text>
          </g>
        ))}

        <g transform={`translate(${SCHOOL_LOCATION.x}, ${SCHOOL_LOCATION.y})`}>
          <rect x="-16" y="-16" width="32" height="32" rx="10" fill="#2563eb" />
          <Home size={16} color="white" x="-8" y="-8" />
        </g>

        {/* Bus Marker */}
        <g style={{ 
          transition: 'transform 0.1s ease-out',
          transform: `translate(${busState.x}px, ${busState.y}px) rotate(${busState.heading || 0}deg)` 
        }}>
          <circle r="24" fill="url(#busShadowGlow)" />
          <path 
            d="M -18 -10 L 14 -10 C 19 -10 21 -5 21 0 C 21 5 19 10 14 10 L -18 10 Z" 
            fill={busState.isDiverted ? "#fb923c" : "#facc15"} 
            stroke="#a16207" 
            strokeWidth="1.8" 
          />
          <rect x="-12" y="-8" width="18" height="16" rx="1.5" fill="#1e293b" opacity="0.65" />
          <rect x="8" y="-7" width="6" height="14" rx="2" fill="#fff" opacity="0.25" />
          <circle cx="18" cy="-6" r="1.8" fill="white" />
          <circle cx="18" cy="6" r="1.8" fill="white" />
        </g>
      </svg>

      {/* Floating Telemetry Box */}
      <div className="absolute bottom-8 left-8 bg-[#1a1e28]/95 backdrop-blur-xl px-6 py-4 rounded-3xl border border-white/10 shadow-2xl pointer-events-none flex items-center space-x-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Traffic Impact</span>
          <div className="flex items-baseline space-x-1.5">
            <span className={`text-2xl font-black ${busState.trafficStatus === 'Heavy' ? 'text-red-500' : 'text-emerald-500'}`}>
              {busState.trafficStatus || 'Stable'}
            </span>
          </div>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1.5">Current Route</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2.5 h-2.5 rounded-full ${busState.isDiverted ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
            <span className="text-xs font-black text-white uppercase tracking-widest">
              {busState.isDiverted ? 'Diverted' : 'On Track'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
