import { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefreshKey = () => setRefreshKey(prev => prev + 1);

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                isLoggedIn,
                setIsLoggedIn,
                refreshKey,
                setRefreshKey,
                triggerRefreshKey,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
