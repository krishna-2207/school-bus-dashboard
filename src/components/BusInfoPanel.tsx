// Real-time Bus Info Panel
// Shows live bus status, speed, driver info, etc.

import React from 'react';
import { Activity, MapPin, Gauge, User, Phone, Clock, Navigation, AlertTriangle } from 'lucide-react';
import type { LiveLocation, Bus, Driver, Route } from '../types/firebase';

interface BusInfoPanelProps {
    location: LiveLocation | null;
    bus: Bus | null;
    driver: Driver | null;
    route: Route | null;
    loading?: boolean;
}

const BusInfoPanel: React.FC<BusInfoPanelProps> = ({
    location,
    bus,
    driver,
    route,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    if (!location) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No bus selected or no location data available</p>
                <p className="text-sm mt-2">Make sure the simulator is running</p>
            </div>
        );
    }

    const statusColor = {
        normal: 'bg-green-100 text-green-800',
        stopped: 'bg-gray-100 text-gray-800',
        overspeed: 'bg-red-100 text-red-800',
        emergency: 'bg-red-100 text-red-800'
    };

    const speedPercentage = Math.min((location.speed / 60) * 100, 100);
    const isOverspeed = location.speed > 50;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">🚌</div>
                        <div>
                            <h3 className="text-xl font-bold">{bus?.busNumber || 'Bus'}</h3>
                            <p className="text-blue-100 text-sm">{route?.routeName || 'Unknown Route'}</p>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[location.status]}`}>
                        {location.isMoving ? '● Moving' : '○ Stopped'}
                    </div>
                </div>
            </div>

            {/* Speed Gauge */}
            <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Current Speed
                    </span>
                    <span className={`text-2xl font-bold ${isOverspeed ? 'text-red-500' : 'text-gray-900'}`}>
                        {location.speed.toFixed(1)} km/h
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${isOverspeed ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${speedPercentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>Speed Limit: 50 km/h</span>
                    <span>60</span>
                </div>
                {isOverspeed && (
                    <div className="mt-2 flex items-center gap-2 text-red-500 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        Exceeding speed limit!
                    </div>
                )}
            </div>

            {/* Info Grid */}
            <div className="p-4 grid grid-cols-2 gap-4">
                {/* Location */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Location
                    </div>
                    <div className="text-sm font-mono">
                        {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </div>
                </div>

                {/* Next Stop */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <Navigation className="w-3 h-3" /> Next Stop
                    </div>
                    <div className="text-sm font-medium">{location.nextStop}</div>
                </div>

                {/* Heading */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> Heading
                    </div>
                    <div className="text-sm">{location.heading.toFixed(0)}°</div>
                </div>

                {/* Last Update */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated
                    </div>
                    <div className="text-sm">
                        {location.timestamp instanceof Date
                            ? location.timestamp.toLocaleTimeString()
                            : 'Just now'}
                    </div>
                </div>
            </div>

            {/* Driver Info */}
            {driver && (
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-3">
                        {driver.photo ? (
                            <img
                                src={driver.photo}
                                alt={driver.name}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-gray-500">Driver</div>
                        </div>
                        <a
                            href={`tel:${driver.phone}`}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                            <Phone className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusInfoPanel;
