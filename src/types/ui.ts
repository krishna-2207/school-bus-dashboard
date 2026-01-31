// UI Types - Merged from Replit design
export type NavigationTab =
    | 'Dashboard'
    | 'Live Tracking'
    | 'Speed Monitor'
    | 'Alerts'
    | 'Driver Details'
    | 'Parents'
    | 'Settings';

export interface Alert {
    id: string;
    time: string;
    type: 'Overspeed' | 'Accident' | 'Geofence' | 'Emergency' | 'Normal' | 'Traffic' | 'Diversion';
    message: string;
    status: 'Active' | 'Resolved';
}

export interface StudentMarker {
    id: string;
    name: string;
    x: number;
    y: number;
    route: string;
}

export interface StudentParentInfo {
    id: string;
    studentName: string;
    grade: string;
    parentName: string;
    phone: string;
    busId: string;
    avatar: string;
}

export interface BusStop {
    id: string;
    name: string;
    time: string;
    status: 'completed' | 'current' | 'upcoming';
    x: number;
    y: number;
}

export interface TrafficSegment {
    id: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    level: 'Moderate' | 'Heavy' | 'Standstill';
}

export interface BusState {
    x: number;
    y: number;
    speed: number;
    heading?: number;
    status: 'Normal' | 'Stopped' | 'Overspeed';
    accidentDetected: boolean;
    gpsSignal: 'Strong' | 'Weak' | 'None';
    routePath?: string;
    isDiverted?: boolean;
    trafficStatus?: 'Clear' | 'Heavy' | 'Rerouting';
}

export interface DriverInfo {
    name: string;
    photo: string;
    phone: string;
    license: string;
    busNumber: string;
    route: string;
    capacity: number;
    school: string;
}
