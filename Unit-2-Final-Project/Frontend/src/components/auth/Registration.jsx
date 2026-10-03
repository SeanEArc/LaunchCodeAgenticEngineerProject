import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUserData, fetchGetData } from '../fetchUtils';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [calorieGoal, setCalorieGoal] = useState('');
    const [proteinGoal, setProteinGoal] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async event => {
        event.preventDefault();
        setError('');
        setIsValid(true);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsValid(false);
            return;
        }

        if (username.length < 5 || password.length <= 5) {
            setError('Username or Password is not valid');
            setIsValid(false);
            return;
        }

        try {
            const getAllUsers = await fetchGetData('http://localhost:8080/users/all');

            for (let i = 0; i < getAllUsers.length; i++) {
                if (username == getAllUsers[i].username) {
                    setError('This username is already taken, please try another one');
                    setIsValid(false);
                    return;
                }
            }

            if (isValid) {
                const postingUserData = await postUserData(
                    'http://localhost:8080/users/add',
                    name,
                    username,
                    password,
                    calorieGoal,
                    proteinGoal
                );
                navigate('/');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 text-center">
            <hr className="mx-10 my-5 bg-gray-300 border-0.5" />

            <div className="my-5">
                <h1 className="text-3xl font-bold mb-1"> - Create an Account - </h1>
                <p className="text-gray-600 col-span-2 mx-auto max-w-4xl text-center font-semibold">
                    The first step towards your dietary goals
                </p>

                <hr className="mx-10 my-5 bg-gray-300 border-0.5" />
            </div>

            <div className="mt-10 mx-20">
                <form onSubmit={handleSubmit} className="border p-10 shadow-lg mb-15">
                    <h3 className="pb-4"> Account Details </h3>

                    <label className="font-semibold flex flex-col text-md">
                        Name:
                        <input
                            type="text"
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </label>

                    <label className="font-semibold flex flex-col text-md pt-2">
                        Username:
                        <input
                            type="text"
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </label>

                    <label className="font-semibold flex flex-col text-md pt-2">
                        Password:
                        <input
                            type="password"
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </label>

                    <label className="font-semibold flex flex-col text-md pt-2">
                        Confirm Password:
                        <input
                            type="password"
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    <hr className="mx-10 my-5 bg-gray-300 border-0.5" />

                    <h3 className="pb-4 "> Caloric Goals </h3>

                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3">
                        <label className="font-semibold flex flex-col text-md">
                            Calorie Goal:
                            <input
                                type="number"
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                                placeholder="Optional"
                                value={calorieGoal}
                                onChange={e => setCalorieGoal(e.target.value)}
                            />
                        </label>

                        <label className="font-semibold flex flex-col text-md">
                            Protein Goal:
                            <input
                                type="number"
                                className="mt-1 p-1 rounded-md border border-zinc-300"
                                placeholder="Optional"
                                value={proteinGoal}
                                onChange={e => setProteinGoal(e.target.value)}
                            />
                        </label>

                        <p className="text-gray-600 col-span-2 mx-auto text-center font-semibold text-sm">
                            *The average maintenance caloric intake is around 2000kcal
                        </p>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-green-500 text-white shadow-md rounded hover:cursor-pointer hover:bg-blue-600 hover:scale-101"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
