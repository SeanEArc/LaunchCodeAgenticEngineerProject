import { createContext, useCallback, useEffect, useState } from 'react';
import { ApiError, setUnauthorizedHandler } from '../api/client';
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest } from '../api/auth';

export const UserContext = createContext();

// authStatus moves through:
//   'loading'          - restoring the session from the backend, nothing decided yet
//   'authenticated'    - /auth/me returned a user
//   'unauthenticated'  - /auth/me returned 401, or the user logged out
//   'error'            - the backend could not be reached; the user can retry

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState('loading');
    const [restoreError, setRestoreError] = useState(null);
    const [sessionMessage, setSessionMessage] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefreshKey = () => setRefreshKey(prev => prev + 1);

    // Asks the backend who we are. A 401 is a normal answer, not a failure.
    const restoreSession = useCallback(async () => {
        setAuthStatus('loading');
        setRestoreError(null);

        try {
            const currentUser = await fetchCurrentUser();
            setUser(currentUser);
            setAuthStatus('authenticated');
        } catch (error) {
            setUser(null);

            if (error instanceof ApiError && error.status === 401) {
                setAuthStatus('unauthenticated');
            } else {
                setRestoreError(error.message);
                setAuthStatus('error');
            }
        }
    }, []);

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    // Called by the API helper when any private request comes back 401, which
    // means the session expired underneath us.
    useEffect(() => {
        const handleExpiredSession = () => {
            setUser(null);
            setAuthStatus('unauthenticated');
            setRestoreError(null);
            setSessionMessage('Your session expired. Please log in again.');
        };

        setUnauthorizedHandler(handleExpiredSession);

        return () => setUnauthorizedHandler(null);
    }, []);

    // Errors are thrown so the login form can tell bad credentials (401) apart
    // from an unreachable backend.
    const login = useCallback(async (username, password) => {
        const loggedInUser = await loginRequest(username, password);

        setUser(loggedInUser);
        setAuthStatus('authenticated');
        setRestoreError(null);
        setSessionMessage(null);

        return loggedInUser;
    }, []);

    // Local state is cleared even when the backend call fails, so the browser
    // never keeps showing a session the user asked to end. The error is re-thrown
    // for the caller to display.
    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } finally {
            setUser(null);
            setAuthStatus('unauthenticated');
            setRestoreError(null);
            setSessionMessage(null);
            setRefreshKey(prev => prev + 1);
        }
    }, []);

    const clearSessionMessage = useCallback(() => setSessionMessage(null), []);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                authStatus,
                isLoggedIn: authStatus === 'authenticated',
                isRestoringSession: authStatus === 'loading',
                restoreError,
                restoreSession,
                sessionMessage,
                clearSessionMessage,
                login,
                logout,
                refreshKey,
                setRefreshKey,
                triggerRefreshKey,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
