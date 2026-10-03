import './DashboardStyling.css';
import AddFoodModal from './AddFoodModal';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const { user, setIsLoggedIn } = useContext(UserContext);

    const navigate = useNavigate();

    //Reusable button
    const buttonStylings =
        'text-2xl font-bold md:text-2xl h-24 md:h-40 lg:h-40 px-4 md:px-6 w-full flex items-center justify-center bg-blue-400 text-white rounded-2xl shadow-xl hover:bg-blue-500 transition-transform transition-colors duration-300 ease-in-out';

    return (
        <div className="flex w-full h-full md:justify-center sm:justify-center items-center my-auto bg-zinc-50 mt-6">
            <div className="dashboard-grid grid grid-cols-2 grid-rows-3 gap-6 max-w-6xl">
                <div className="flex col-span-2 justify-center items-center">
                    {user ? (
                        <p className="text-5xl font-bold text-center mt-0 pt-0">
                            {' '}
                            Welcome back, {user.name}{' '}
                        </p>
                    ) : (
                        <p className="text-5xl font-bold text-center mt-0 pt-0">
                            Welcome to Calorie Counter!
                        </p>
                    )}
                </div>

                <div>
                    <button
                        onClick={() => setShowModal(true)}
                        className={`${buttonStylings} small-log-food-button `}
                    >
                        Log Calories
                    </button>
                </div>

                <div>
                    <Link to="/caloriehistory" className={`${buttonStylings} small-link-styles`}>
                        Calorie History
                    </Link>
                </div>

                <div>
                    <Link to="/howitworks" className={`${buttonStylings} small-link-styles`}>
                        How does this work?
                    </Link>
                </div>

                <div>
                    <Link to="/about" className={`${buttonStylings} small-link-styles`}>
                        Want to Learn More About Us?
                    </Link>
                </div>

                <div>
                    <Link to="/accountDetails" className={`${buttonStylings} small-link-styles`}>
                        User Details
                    </Link>
                </div>

                <div>
                    <button
                        onClick={() => {
                            setIsLoggedIn(false);
                            navigate('/');
                        }}
                        className={`${buttonStylings} small-log-food-button `}
                    >
                        Log Out
                    </button>
                </div>

                {showModal && <AddFoodModal onClose={() => setShowModal(false)} />}
            </div>
        </div>
    );
};

export default Dashboard;
