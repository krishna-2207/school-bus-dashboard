// Firestore Service - All database operations
import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    Timestamp,
    DocumentData,
    Unsubscribe
} from 'firebase/firestore';
import { db } from './config';
import type {
    Bus,
    Route,
    Driver,
    LiveLocation,
    FirestoreAlert
} from '../types/firebase';

// ========================================
// COLLECTION REFERENCES
// ========================================
const busesRef = collection(db, 'buses');
const routesRef = collection(db, 'routes');
const driversRef = collection(db, 'drivers');
const liveLocationsRef = collection(db, 'liveLocations');
const alertsRef = collection(db, 'alerts');

// ========================================
// BUSES
// ========================================
export const getBus = async (busId: string): Promise<Bus | null> => {
    const docSnap = await getDoc(doc(busesRef, busId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Bus : null;
};

export const getAllBuses = async (): Promise<Bus[]> => {
    const snapshot = await getDocs(busesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Bus);
};

export const subscribeToBuses = (callback: (buses: Bus[]) => void): Unsubscribe => {
    return onSnapshot(busesRef, (snapshot) => {
        const buses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Bus);
        callback(buses);
    });
};

// ========================================
// ROUTES
// ========================================
export const getRoute = async (routeId: string): Promise<Route | null> => {
    const docSnap = await getDoc(doc(routesRef, routeId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Route : null;
};

export const getAllRoutes = async (): Promise<Route[]> => {
    const snapshot = await getDocs(routesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Route);
};

// ========================================
// DRIVERS
// ========================================
export const getDriver = async (driverId: string): Promise<Driver | null> => {
    const docSnap = await getDoc(doc(driversRef, driverId));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Driver : null;
};

// ========================================
// LIVE LOCATIONS (Real-time GPS)
// ========================================

// Write location (called by simulator or driver app)
export const updateBusLocation = async (
    busId: string,
    location: Omit<LiveLocation, 'timestamp'>
): Promise<void> => {
    await setDoc(doc(liveLocationsRef, busId), {
        ...location,
        timestamp: serverTimestamp()
    }, { merge: true });
};

// Subscribe to single bus location
export const subscribeToBusLocation = (
    busId: string,
    callback: (location: LiveLocation | null) => void
): Unsubscribe => {
    return onSnapshot(doc(liveLocationsRef, busId), (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            callback({
                ...data,
                busId: docSnap.id,
                // Convert Firestore Timestamp to Date
                timestamp: data.timestamp instanceof Timestamp
                    ? data.timestamp.toDate()
                    : new Date()
            } as LiveLocation);
        } else {
            callback(null);
        }
    });
};

// Subscribe to ALL active bus locations
export const subscribeToAllBusLocations = (
    callback: (locations: LiveLocation[]) => void
): Unsubscribe => {
    const q = query(liveLocationsRef, where('isMoving', '==', true));

    return onSnapshot(q, (snapshot) => {
        const locations = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
                ...data,
                busId: docSnap.id,
                timestamp: data.timestamp instanceof Timestamp
                    ? data.timestamp.toDate()
                    : new Date()
            } as LiveLocation;
        });
        callback(locations);
    });
};

// Subscribe to ALL bus locations (including stopped)
export const subscribeToAllLocations = (
    callback: (locations: LiveLocation[]) => void
): Unsubscribe => {
    return onSnapshot(liveLocationsRef, (snapshot) => {
        const locations = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
                ...data,
                busId: docSnap.id,
                timestamp: data.timestamp instanceof Timestamp
                    ? data.timestamp.toDate()
                    : new Date()
            } as LiveLocation;
        });
        callback(locations);
    });
};

// ========================================
// ALERTS
// ========================================
export const createAlert = async (
    alert: Omit<FirestoreAlert, 'id' | 'createdAt'>
): Promise<string> => {
    const docRef = doc(alertsRef);
    await setDoc(docRef, {
        ...alert,
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

export const subscribeToAlerts = (
    callback: (alerts: FirestoreAlert[]) => void,
    limit: number = 20
): Unsubscribe => {
    const q = query(alertsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(q, (snapshot) => {
        const alerts = snapshot.docs.slice(0, limit).map(docSnap => {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date()
            } as FirestoreAlert;
        });
        callback(alerts);
    });
};

// ========================================
// SEED DATA (For initial setup)
// ========================================
export const seedInitialData = async (): Promise<void> => {
    console.log('🌱 Seeding initial data...');

    // Add sample bus
    await setDoc(doc(busesRef, 'bus_001'), {
        busNumber: 'SB-042',
        routeId: 'route_001',
        driverId: 'driver_001',
        vehicleType: 'standard',
        capacity: 45,
        status: 'active',
        licensePlate: 'KA-01-AB-1234',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    await setDoc(doc(busesRef, 'bus_002'), {
        busNumber: 'SB-087',
        routeId: 'route_002',
        driverId: 'driver_002',
        vehicleType: 'minibus',
        capacity: 25,
        status: 'active',
        licensePlate: 'KA-01-CD-5678',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    // Add sample route (Bangalore coordinates)
    await setDoc(doc(routesRef, 'route_001'), {
        routeName: 'Central School Route',
        routeCode: 'R1',
        startPoint: 'Central School',
        endPoint: 'North Suburbs',
        stops: [
            { stopName: 'Central School', stopOrder: 1, latitude: 12.9716, longitude: 77.5946, estimatedArrival: 0 },
            { stopName: "Emma's Home", stopOrder: 2, latitude: 12.9750, longitude: 77.5980, estimatedArrival: 5 },
            { stopName: "Liam's Home", stopOrder: 3, latitude: 12.9800, longitude: 77.6020, estimatedArrival: 10 },
            { stopName: "Noah's Home", stopOrder: 4, latitude: 12.9850, longitude: 77.6060, estimatedArrival: 15 },
            { stopName: "Olivia's Home", stopOrder: 5, latitude: 12.9900, longitude: 77.6100, estimatedArrival: 20 }
        ],
        estimatedDuration: 25,
        isActive: true,
        color: '#3B82F6'
    });

    await setDoc(doc(routesRef, 'route_002'), {
        routeName: 'East Side Express',
        routeCode: 'R2',
        startPoint: 'Central School',
        endPoint: 'East Hills',
        stops: [
            { stopName: 'Central School', stopOrder: 1, latitude: 12.9716, longitude: 77.5946, estimatedArrival: 0 },
            { stopName: "Ava's Home", stopOrder: 2, latitude: 12.9680, longitude: 77.6000, estimatedArrival: 7 },
            { stopName: "Max's Home", stopOrder: 3, latitude: 12.9650, longitude: 77.6080, estimatedArrival: 14 }
        ],
        estimatedDuration: 20,
        isActive: true,
        color: '#10B981'
    });

    // Add sample driver
    await setDoc(doc(driversRef, 'driver_001'), {
        uid: 'driver_001',
        name: 'Robert Johnson',
        phone: '+91-9876543210',
        email: 'robert.driver@school.com',
        licenseNumber: 'DL-KA-2020-12345',
        assignedBusId: 'bus_001',
        status: 'on-duty',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        createdAt: serverTimestamp()
    });

    await setDoc(doc(driversRef, 'driver_002'), {
        uid: 'driver_002',
        name: 'Michael Chen',
        phone: '+91-9876543211',
        email: 'michael.driver@school.com',
        licenseNumber: 'DL-KA-2021-67890',
        assignedBusId: 'bus_002',
        status: 'on-duty',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        createdAt: serverTimestamp()
    });

    console.log('✅ Initial data seeded successfully!');
};
