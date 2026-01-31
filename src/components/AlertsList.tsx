// Real-time Alerts Component
// Shows live alerts from Firebase with auto-refresh

import React from 'react';
import { AlertTriangle, AlertCircle, Bell, CheckCircle, X } from 'lucide-react';
import type { FirestoreAlert } from '../types/firebase';

interface AlertsListProps {
    alerts: FirestoreAlert[];
    loading?: boolean;
    onResolve?: (alertId: string) => void;
}

const alertStyles = {
    overspeed: { icon: AlertTriangle, bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', iconColor: 'text-orange-500' },
    accident: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconColor: 'text-red-500' },
    geofence: { icon: Bell, bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', iconColor: 'text-blue-500' },
    emergency: { icon: AlertCircle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconColor: 'text-red-500' },
    normal: { icon: CheckCircle, bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', iconColor: 'text-green-500' },
    traffic: { icon: AlertTriangle, bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', iconColor: 'text-yellow-500' },
    diversion: { icon: AlertTriangle, bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', iconColor: 'text-purple-500' },
    gps: { icon: AlertCircle, bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', iconColor: 'text-gray-500' }
};

const AlertsList: React.FC<AlertsListProps> = ({ alerts, loading = false, onResolve }) => {
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900">All Clear!</h3>
                <p className="text-gray-500 text-sm mt-1">No active alerts at the moment</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {alerts.map(alert => {
                const style = alertStyles[alert.type] || alertStyles.normal;
                const Icon = style.icon;

                return (
                    <div
                        key={alert.id}
                        className={`${style.bg} ${style.border} border rounded-lg p-4 transition-all hover:shadow-md`}
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${style.bg}`}>
                                <Icon className={`w-5 h-5 ${style.iconColor}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-semibold uppercase ${style.text}`}>
                                        {alert.type}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${alert.status === 'active'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {alert.status}
                                    </span>
                                </div>

                                <p className={`font-medium ${style.text}`}>{alert.message}</p>

                                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                    <span>Bus: {alert.busId}</span>
                                    <span>•</span>
                                    <span>
                                        {alert.createdAt instanceof Date
                                            ? alert.createdAt.toLocaleTimeString()
                                            : 'Just now'}
                                    </span>
                                </div>
                            </div>

                            {alert.status === 'active' && onResolve && (
                                <button
                                    onClick={() => onResolve(alert.id)}
                                    className="p-1 hover:bg-white rounded transition-colors"
                                    title="Resolve alert"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertsList;
