// React Hook for Bus Tracking
// This hook handles all Firebase real-time subscriptions

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
    subscribeToAllLocations,
    subscribeToBusLocation,
    subscribeToAlerts,
    subscribeToBuses,
    getAllRoutes,
    getDriver,
    signInAnonymousUser,
    subscribeToAuthState,
    seedInitialData
} from '../firebase';
import type { LiveLocation, Bus, Route, Driver, FirestoreAlert } from '../types/firebase';

// ========================================
// HOOK: useAuth
// ========================================
export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuthState((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = useCallback(async () => {
        try {
            await signInAnonymousUser();
        } catch (error) {
            console.error('Auth error:', error);
        }
    }, []);

    return { user, loading, signIn };
}

// ========================================
// HOOK: useBusLocations
// ========================================
export function useBusLocations() {
    const [locations, setLocations] = useState<LiveLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
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

// ========================================
// HOOK: useSingleBusLocation
// ========================================
export function useSingleBusLocation(busId: string) {
    const [location, setLocation] = useState<LiveLocation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!busId) return;

        const unsubscribe = subscribeToBusLocation(busId, (loc) => {
            setLocation(loc);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [busId]);

    return { location, loading };
}

// ========================================
// HOOK: useBuses
// ========================================
export function useBuses() {
    const [buses, setBuses] = useState<Bus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToBuses((data) => {
            setBuses(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { buses, loading };
}

// ========================================
// HOOK: useRoutes
// ========================================
export function useRoutes() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRoutes = async () => {
            try {
                const data = await getAllRoutes();
                setRoutes(data);
            } catch (error) {
                console.error('Error loading routes:', error);
            } finally {
                setLoading(false);
            }
        };

        loadRoutes();
    }, []);

    return { routes, loading };
}

// ========================================
// HOOK: useDriver
// ========================================
export function useDriver(driverId: string | null) {
    const [driver, setDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!driverId) {
            setLoading(false);
            return;
        }

        const loadDriver = async () => {
            try {
                const data = await getDriver(driverId);
                setDriver(data);
            } catch (error) {
                console.error('Error loading driver:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDriver();
    }, [driverId]);

    return { driver, loading };
}

// ========================================
// HOOK: useAlerts
// ========================================
export function useAlerts(limit: number = 20) {
    const [alerts, setAlerts] = useState<FirestoreAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAlerts((data) => {
            setAlerts(data);
            setLoading(false);
        }, limit);

        return () => unsubscribe();
    }, [limit]);

    return { alerts, loading };
}

// ========================================
// HOOK: useBusTracking (Combined hook)
// ========================================
export function useBusTracking() {
    const { user, loading: authLoading, signIn } = useAuth();
    const { locations, loading: locationsLoading, error } = useBusLocations();
    const { buses, loading: busesLoading } = useBuses();
    const { routes, loading: routesLoading } = useRoutes();
    const { alerts, loading: alertsLoading } = useAlerts();

    const loading = authLoading || locationsLoading || busesLoading || routesLoading;

    // Auto sign in on mount
    useEffect(() => {
        if (!authLoading && !user) {
            signIn();
        }
    }, [authLoading, user, signIn]);

    // Helper: Get location for a specific bus
    const getBusLocation = useCallback((busId: string) => {
        return locations.find(loc => loc.busId === busId) || null;
    }, [locations]);

    // Helper: Get bus details
    const getBusDetails = useCallback((busId: string) => {
        return buses.find(bus => bus.id === busId) || null;
    }, [buses]);

    // Helper: Get route details
    const getRouteDetails = useCallback((routeId: string) => {
        return routes.find(route => route.id === routeId) || null;
    }, [routes]);

    return {
        // Auth
        user,
        isAuthenticated: !!user,

        // Data
        locations,
        buses,
        routes,
        alerts,

        // Loading states
        loading,
        error,

        // Helpers
        getBusLocation,
        getBusDetails,
        getRouteDetails,

        // Actions
        seedData: seedInitialData
    };
}
