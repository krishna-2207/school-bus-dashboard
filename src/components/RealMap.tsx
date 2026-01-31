import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface BusLocation {
    id: string;
    busId: string;
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    timestamp: Date;
}

interface Route {
    id: string;
    name: string;
    stops: Array<{
        name: string;
        location: { latitude: number; longitude: number };
        order: number;
    }>;
    path: Array<{ latitude: number; longitude: number }>;
}

interface RealMapProps {
    buses: BusLocation[];
    routes: Route[];
    selectedBusId?: string;
    onSelectBus?: (busId: string) => void;
}

// Traffic zones data (Hyderabad area)
const TRAFFIC_ZONES = [
    { id: 'tz1', center: [17.390, 78.490] as [number, number], radius: 300, level: 'Heavy', color: '#ef4444' },
    { id: 'tz2', center: [17.382, 78.483] as [number, number], radius: 200, level: 'Moderate', color: '#f59e0b' },
    { id: 'tz3', center: [17.378, 78.492] as [number, number], radius: 250, level: 'Light', color: '#22c55e' },
];

// Create bus icon
const createBusIcon = (isSelected: boolean, speed: number) => {
    const size = isSelected ? 48 : 38;
    const color = speed > 50 ? '#ef4444' : speed > 0 ? '#facc15' : '#6b7280';

    return L.divIcon({
        className: 'custom-bus-icon',
        html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border: 3px solid ${isSelected ? '#3b82f6' : '#ffffff'};
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.35), 0 0 0 ${isSelected ? '6px' : '0px'} rgba(59, 130, 246, 0.4);
        transition: all 0.3s ease;
        position: relative;
      ">
        <svg width="${size * 0.55}" height="${size * 0.55}" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2.5">
          <path d="M8 6v6M16 6v6M2 12h20M7 18h10"/>
          <rect x="4" y="4" width="16" height="14" rx="2"/>
          <circle cx="7" cy="18" r="1"/>
          <circle cx="17" cy="18" r="1"/>
        </svg>
        ${speed > 0 ? `<div style="position: absolute; top: -5px; right: -5px; width: 12px; height: 12px; background: #22c55e; border-radius: 50%; border: 2px solid white; animation: pulse 1s infinite;"></div>` : ''}
      </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
    });
};

// Stop marker icon
const createStopIcon = (order: number, isCompleted: boolean) => {
    const bgColor = isCompleted ? '#10b981' : '#3b82f6';
    return L.divIcon({
        className: 'custom-stop-icon',
        html: `
      <div style="
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        color: white;
      ">${order}</div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

// School marker icon
const schoolIcon = L.divIcon({
    className: 'custom-school-icon',
    html: `
    <div style="
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      border: 4px solid white;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    ">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="0">
        <path d="m4 6 8-4 8 4"/>
        <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
        <path d="M14 22v-4a2 2 0 0 0-4 0v4"/>
        <circle cx="12" cy="9" r="2"/>
      </svg>
    </div>
  `,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
});

// Auto-pan controller
const MapController: React.FC<{ center?: [number, number]; zoom?: number }> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom || map.getZoom(), { animate: true, duration: 0.5 });
        }
    }, [center, zoom, map]);

    return null;
};

const RealMap: React.FC<RealMapProps> = ({ buses, routes, selectedBusId, onSelectBus }) => {
    const [autoPan, setAutoPan] = useState(true);
    const [showTraffic, setShowTraffic] = useState(true);
    const [showGeofences, setShowGeofences] = useState(true);

    // Default center (Hyderabad, India)
    const defaultCenter: [number, number] = [17.385044, 78.486671];
    const schoolLocation: [number, number] = [17.385044, 78.486671];

    // Get selected bus location for auto-pan
    const selectedBus = buses.find(b => b.busId === selectedBusId);
    const mapCenter = autoPan && selectedBus
        ? [selectedBus.latitude, selectedBus.longitude] as [number, number]
        : undefined;

    // Generate default route path if none provided
    const defaultRoutePath: [number, number][] = [
        [17.385044, 78.486671], // School
        [17.388, 78.484],
        [17.392, 78.482],
        [17.395, 78.486],
        [17.390, 78.492],
        [17.385, 78.495],
        [17.380, 78.490],
        [17.378, 78.485],
        [17.385044, 78.486671], // Back to school
    ];

    return (
        <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            {/* Map Controls - Top Left */}
            <div className="absolute top-4 left-4 z-[1000] space-y-3">
                {/* Active Buses Indicator */}
                <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50"></div>
                        <span className="text-sm font-bold text-slate-800">
                            {buses.length} Active {buses.length === 1 ? 'Bus' : 'Buses'}
                        </span>
                    </div>
                </div>

                {/* Layer Controls */}
                <div className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-slate-100 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Layers</p>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showTraffic}
                            onChange={(e) => setShowTraffic(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-xs font-medium text-slate-700">Traffic Zones</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showGeofences}
                            onChange={(e) => setShowGeofences(e.target.checked)}
                            className="w-4 h-4 rounded text-blue-600"
                        />
                        <span className="text-xs font-medium text-slate-700">Geofences</span>
                    </label>
                </div>
            </div>

            {/* Auto-Pan Toggle */}
            <div className="absolute top-4 right-4 z-[1000]">
                <button
                    onClick={() => setAutoPan(!autoPan)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg transition-all ${autoPan
                            ? 'bg-blue-600 text-white shadow-blue-600/30'
                            : 'bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                >
                    {autoPan ? '📍 Following Bus' : '🗺️ Free View'}
                </button>
            </div>

            {/* Traffic Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Traffic Status</p>
                <div className="flex items-center space-x-4 text-xs font-medium">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow"></div>
                        <span className="text-slate-600">Clear</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow"></div>
                        <span className="text-slate-600">Moderate</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 shadow"></div>
                        <span className="text-slate-600">Heavy</span>
                    </div>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center space-x-4 text-xs font-medium">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-yellow-400 shadow"></div>
                            <span className="text-slate-600">Moving</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded bg-gray-400 shadow"></div>
                            <span className="text-slate-600">Stopped</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Bus Info */}
            {selectedBus && (
                <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl px-5 py-4 shadow-lg border border-slate-100 min-w-[220px]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selected Bus</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedBus.speed > 50 ? 'bg-red-100 text-red-600' :
                                selectedBus.speed > 0 ? 'bg-green-100 text-green-600' :
                                    'bg-gray-100 text-gray-600'
                            }`}>
                            {selectedBus.speed > 50 ? '⚠️ OVERSPEED' : selectedBus.speed > 0 ? '🚌 ON ROUTE' : '🅿️ STOPPED'}
                        </span>
                    </div>
                    <p className="text-2xl font-black text-slate-800">{selectedBus.busId}</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-slate-50 rounded-lg p-2">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Speed</span>
                            <p className={`text-lg font-bold ${selectedBus.speed > 50 ? 'text-red-600' : 'text-slate-800'}`}>
                                {Math.round(selectedBus.speed)} <span className="text-xs text-slate-400">km/h</span>
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Heading</span>
                            <p className="text-lg font-bold text-slate-800">
                                {Math.round(selectedBus.heading)}° <span className="text-xs text-slate-400">N</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Route Progress</p>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">65% Complete • ETA: 8 mins</p>
                    </div>
                </div>
            )}

            {/* Leaflet Map */}
            <MapContainer
                center={selectedBus ? [selectedBus.latitude, selectedBus.longitude] : defaultCenter}
                zoom={15}
                className="h-full w-full"
                zoomControl={false}
            >
                {/* OpenStreetMap Tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Auto-pan controller */}
                {mapCenter && <MapController center={mapCenter} />}

                {/* Traffic Zones */}
                {showTraffic && TRAFFIC_ZONES.map(zone => (
                    <Circle
                        key={zone.id}
                        center={zone.center}
                        radius={zone.radius}
                        pathOptions={{
                            color: zone.color,
                            fillColor: zone.color,
                            fillOpacity: 0.2,
                            weight: 2,
                            dashArray: '5, 5'
                        }}
                    >
                        <Popup>
                            <div className="text-center p-2">
                                <p className="font-bold" style={{ color: zone.color }}>⚠️ {zone.level} Traffic</p>
                                <p className="text-sm text-slate-500">Expect delays</p>
                            </div>
                        </Popup>
                    </Circle>
                ))}

                {/* Geofence circles around stops */}
                {showGeofences && routes.flatMap(route =>
                    route.stops?.map((stop, idx) => (
                        <Circle
                            key={`geofence-${route.id}-${idx}`}
                            center={[stop.location.latitude, stop.location.longitude]}
                            radius={100}
                            pathOptions={{
                                color: '#3b82f6',
                                fillColor: '#3b82f6',
                                fillOpacity: 0.1,
                                weight: 1,
                                dashArray: '3, 3'
                            }}
                        />
                    )) || []
                )}

                {/* School geofence */}
                {showGeofences && (
                    <Circle
                        center={schoolLocation}
                        radius={200}
                        pathOptions={{
                            color: '#10b981',
                            fillColor: '#10b981',
                            fillOpacity: 0.15,
                            weight: 2,
                        }}
                    />
                )}

                {/* Route polylines */}
                {routes.length > 0 ? routes.map(route => (
                    route.path && route.path.length > 0 && (
                        <Polyline
                            key={route.id}
                            positions={route.path.map(p => [p.latitude, p.longitude] as [number, number])}
                            pathOptions={{
                                color: '#3b82f6',
                                weight: 5,
                                opacity: 0.8,
                                lineCap: 'round',
                                lineJoin: 'round',
                            }}
                        />
                    )
                )) : (
                    // Default route if none provided
                    <Polyline
                        positions={defaultRoutePath}
                        pathOptions={{
                            color: '#3b82f6',
                            weight: 5,
                            opacity: 0.8,
                            lineCap: 'round',
                            lineJoin: 'round',
                        }}
                    />
                )}

                {/* Bus stop markers */}
                {routes.flatMap(route =>
                    route.stops?.map((stop, idx) => (
                        <Marker
                            key={`${route.id}-stop-${idx}`}
                            position={[stop.location.latitude, stop.location.longitude]}
                            icon={createStopIcon(stop.order, idx < 2)}
                        >
                            <Popup>
                                <div className="text-center p-2 min-w-[120px]">
                                    <p className="font-bold text-slate-800">📍 {stop.name}</p>
                                    <p className="text-sm text-slate-500">Stop #{stop.order}</p>
                                    <div className="mt-2 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">
                                        Geofence: 100m radius
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    )) || []
                )}

                {/* School marker */}
                <Marker position={schoolLocation} icon={schoolIcon}>
                    <Popup>
                        <div className="text-center p-3 min-w-[150px]">
                            <p className="font-bold text-blue-600 text-lg">🏫 Central School</p>
                            <p className="text-sm text-slate-500">Main Campus</p>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-slate-50 rounded-lg p-2">
                                    <p className="font-bold text-slate-800">52</p>
                                    <p className="text-slate-400">Students</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-2">
                                    <p className="font-bold text-slate-800">4</p>
                                    <p className="text-slate-400">Buses</p>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {/* Bus markers */}
                {buses.map(bus => (
                    <Marker
                        key={bus.busId}
                        position={[bus.latitude, bus.longitude]}
                        icon={createBusIcon(bus.busId === selectedBusId, bus.speed)}
                        eventHandlers={{
                            click: () => onSelectBus?.(bus.busId)
                        }}
                    >
                        <Popup>
                            <div className="p-3 min-w-[180px]">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-lg text-slate-800">🚌 {bus.busId}</p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bus.speed > 50 ? 'bg-red-100 text-red-600' :
                                            bus.speed > 0 ? 'bg-green-100 text-green-600' :
                                                'bg-gray-100 text-gray-600'
                                        }`}>
                                        {bus.speed > 50 ? 'OVERSPEED' : bus.speed > 0 ? 'MOVING' : 'STOPPED'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-slate-400 text-xs">Speed</p>
                                        <p className={`font-bold ${bus.speed > 50 ? 'text-red-600' : 'text-slate-800'}`}>
                                            {Math.round(bus.speed)} km/h
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs">Heading</p>
                                        <p className="font-bold text-slate-800">{Math.round(bus.heading)}°</p>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-slate-100">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Driver</p>
                                    <p className="text-sm font-medium text-slate-700">Robert Martinez</p>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* CSS for pulse animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }
      `}</style>
        </div>
    );
};

export default RealMap;
