import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { HealthyPlate } from '../../assets/StockPhotos/stockPhotos';
import { ApiError, NetworkError } from '../../api/client';

// Log In Page Component

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    // Set when the backend could not be reached, so the user is offered a retry
    // instead of being told their credentials were wrong.
    const [canRetry, setCanRetry] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, isLoggedIn, sessionMessage, clearSessionMessage } = useContext(UserContext);

    // useNavigate to redirect after login
    const navigate = useNavigate();

    const attemptLogin = async () => {
        setError(null);
        setCanRetry(false);
        setIsSubmitting(true);

        try {
            await login(username.trim(), password);
        } catch (loginError) {
            if (loginError instanceof ApiError && loginError.status === 401) {
                setError('Invalid username or password');
            } else if (loginError instanceof NetworkError) {
                setError(loginError.message);
                setCanRetry(true);
            } else {
                setError(loginError.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogin = async event => {
        event.preventDefault();
        await attemptLogin();
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/dashboard');
        }
    }, [isLoggedIn, navigate]);

    // The expired-session notice belongs to the previous session, so it is
    // dismissed as soon as the user starts a new attempt.
    useEffect(() => {
        return () => clearSessionMessage();
    }, [clearSessionMessage]);

    return (
        <div className="login-page py-20 px-4 min-h-screen bg-gray-100">
            <div className="grid md:grid-cols-2 grid-cols-1 max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="hidden md:flex items-center justify-center bg-blue-50 p-6">
                    <img src={HealthyPlate} alt="Healthy Plate" className="max-w-full h-auto" />
                </div>

                <div className="p-10 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">User Login</h1>

                    {sessionMessage && (
                        <p className="mb-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 font-medium text-amber-800">
                            {sessionMessage}
                        </p>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-lg text-gray-700 mb-1">Username:</label>

                            <input
                                type="text"
                                value={username}
                                placeholder="Required"
                                onChange={event => setUsername(event.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></input>
                        </div>

                        <div>
                            <label className="block text-lg text-gray-700 mb-1">Password:</label>

                            <input
                                type="password"
                                value={password}
                                placeholder="Required"
                                onChange={event => setPassword(event.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></input>
                        </div>

                        {error && <p className="text-red-500 font-medium">{error}</p>}

                        {canRetry && (
                            <button
                                type="button"
                                onClick={attemptLogin}
                                disabled={isSubmitting}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded shadow transition disabled:opacity-60"
                            >
                                Retry
                            </button>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded shadow transition disabled:opacity-60"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>

                        <div className="text-center mt-4">
                            <p className="font-medium text-gray-700">Don't have an account?</p>

                            <Link
                                to="/register"
                                className="inline-block mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                            >
                                Create an account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
