import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

// Gates a private route. It waits for session restoration to finish before
// deciding, so a browser refresh never redirects a logged-in user to the login
// page and never mounts account-dependent components without a user.
const ProtectedRoute = ({ children }) => {
    const { authStatus, restoreError, restoreSession } = useContext(UserContext);

    if (authStatus === 'loading') {
        return (
            <div className="max-w-6xl mx-auto p-10 text-center">
                <p className="text-lg font-semibold text-gray-700"> Checking your session... </p>
            </div>
        );
    }

    // The backend is unreachable. Treating this as a logout would hide the real
    // problem, so offer a retry instead.
    if (authStatus === 'error') {
        return (
            <div className="max-w-6xl mx-auto p-10 text-center">
                <h2 className="text-2xl font-bold mb-2"> We could not load your account </h2>

                <p className="text-gray-700 mb-4">{restoreError}</p>

                <button
                    onClick={restoreSession}
                    className="px-4 py-2 bg-blue-500 text-white shadow-md rounded hover:cursor-pointer hover:bg-blue-600"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (authStatus !== 'authenticated') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
