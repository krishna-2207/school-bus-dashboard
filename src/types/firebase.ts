// Firebase Data Types
// These types match the Firestore document structure

export interface Bus {
    id: string;
    busNumber: string;
    routeId: string;
    driverId: string | null;
    vehicleType: 'minibus' | 'standard' | 'double-decker';
    capacity: number;
    status: 'active' | 'inactive' | 'maintenance';
    licensePlate: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface RouteStop {
    stopName: string;
    stopOrder: number;
    latitude: number;
    longitude: number;
    estimatedArrival: number; // minutes from start
}

export interface Route {
    id: string;
    routeName: string;
    routeCode: string;
    startPoint: string;
    endPoint: string;
    stops: RouteStop[];
    estimatedDuration: number;
    isActive: boolean;
    color: string;
}

export interface Driver {
    id: string;
    uid: string;
    name: string;
    phone: string;
    email: string;
    licenseNumber: string;
    assignedBusId: string | null;
    status: 'available' | 'on-duty' | 'off-duty';
    photo?: string;
    createdAt: Date;
}

export interface LiveLocation {
    busId: string;
    driverId: string;
    latitude: number;
    longitude: number;
    heading: number; // 0-360 degrees
    speed: number; // km/h
    accuracy: number; // meters
    timestamp: Date;
    isMoving: boolean;
    routeId: string;
    nextStop: string;
    etaToNextStop?: number; // minutes
    status: 'normal' | 'stopped' | 'overspeed' | 'emergency';
}

export interface FirestoreAlert {
    id: string;
    busId: string;
    type: 'overspeed' | 'accident' | 'geofence' | 'emergency' | 'normal' | 'traffic' | 'diversion' | 'gps';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    status: 'active' | 'resolved';
    createdAt: Date;
    resolvedAt?: Date;
}

// Coordinates helper
export interface Coordinates {
    latitude: number;
    longitude: number;
}
