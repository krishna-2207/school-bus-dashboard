// React hooks for Firebase real-time data
import { useState, useEffect } from 'react';
import {
    subscribeToBuses,
    getAllRoutes,
    subscribeToAllLocations,
    subscribeToAlerts,
    subscribeToBusLocation
} from './firestore';
import { LiveLocation, Route as FirestoreRoute, FirestoreAlert, Bus } from '../types/firebase';

// Hook for real-time bus locations
export function useBusLocations() {
    const [locations, setLocations] = useState<LiveLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        try {
            const unsubscribe = subscribeToAllLocations((locs) => {
                setLocations(locs);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, []);

    return { locations, loading, error };
}

// Hook for real-time routes
export function useRoutes() {
    const [routes, setRoutes] = useState<FirestoreRoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const allRoutes = await getAllRoutes();
                setRoutes(allRoutes);
                setLoading(false);
            } catch (err) {
                setError(err as Error);
                setLoading(false);
            }
        };
        fetchRoutes();
    }, []);

    return { routes, loading, error };
}

// Hook for real-time buses
export function useBuses() {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        try {
            const unsubscribe = subscribeToBuses((allBuses) => {
                setBuses(allBuses);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, []);

    return { buses, loading, error };
}

// Hook for real-time alerts
export function useAlerts(limit: number = 20) {
    const [alerts, setAlerts] = useState<FirestoreAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setLoading(true);
        try {
            const unsubscribe = subscribeToAlerts((allAlerts) => {
                setAlerts(allAlerts);
                setLoading(false);
            }, limit);
            return () => unsubscribe();
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, [limit]);

    return { alerts, loading, error };
}

// Hook for single bus location
export function useBusLocation(busId: string) {
    const [location, setLocation] = useState<LiveLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!busId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const unsubscribe = subscribeToBusLocation(busId, (loc) => {
                setLocation(loc);
                setLoading(false);
            });
            return () => unsubscribe();
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, [busId]);

    return { location, loading, error };
}
