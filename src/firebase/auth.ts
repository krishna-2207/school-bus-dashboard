// Firebase Authentication Service
import {
    signInAnonymously,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth } from './config';

// Sign in anonymously (for passengers/parents viewing dashboard)
export const signInAnonymousUser = async (): Promise<User> => {
    const result = await signInAnonymously(auth);
    console.log('✅ Signed in anonymously:', result.user.uid);
    return result.user;
};

// Sign in with email/password (for drivers/admins)
export const signInWithEmail = async (
    email: string,
    password: string
): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Signed in as:', result.user.email);
    return result.user;
};

// Sign out
export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
    console.log('✅ Signed out');
};

// Get current user
export const getCurrentUser = (): User | null => {
    return auth.currentUser;
};

// Subscribe to auth state changes
export const subscribeToAuthState = (
    callback: (user: User | null) => void
): (() => void) => {
    return onAuthStateChanged(auth, callback);
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return auth.currentUser !== null;
};
