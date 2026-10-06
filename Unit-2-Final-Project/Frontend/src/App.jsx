import './index.css';
import Dashboard from './components/Dashboard';
import { Routes, Route } from 'react-router-dom';
import Footer from './components/Footer';
import AboutPage from './components/AboutPage';
import CalorieHistory from './components/CalorieHistory';
import TopOfPage from './components/TopOfPage';
import HowItWorks from './components/HowItWorks';
import LoginPage from './components/auth/LoginPage';
import Registration from './components/auth/Registration';
import AccountDetails from './components/AccountDetails.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
    return (
        <div className="App">
            {<TopOfPage />}

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/howItWorks" element={<HowItWorks />} />
                <Route path="/about" element={<AboutPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/calorieHistory"
                    element={
                        <ProtectedRoute>
                            <CalorieHistory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/accountDetails"
                    element={
                        <ProtectedRoute>
                            <AccountDetails />
                        </ProtectedRoute>
                    }
                />
            </Routes>

            <Footer />
        </div>
    );
};

export default App;
