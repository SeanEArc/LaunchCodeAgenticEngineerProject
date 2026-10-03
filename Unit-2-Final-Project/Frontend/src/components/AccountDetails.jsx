import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { deleteUser, updateUser } from './fetchUtils';

const AccountDetails = () => {
    const { user, setUser } = useContext(UserContext);

    const [name, setName] = useState(user.name);
    const [username, setUsername] = useState(user.username);
    const [password, setPassword] = useState(user.password);
    const [calorieGoal, setCalorieGoal] = useState(user.calorieGoal);
    const [proteinGoal, setProteinGoal] = useState(user.proteinGoal);

    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');

    const updateUserInformation = async event => {
        event.preventDefault();
        try {
            const updatedUser = await updateUser(user.id, {
                ...user,
                name,
                username,
                password,
            });
            alert('User info updated successfully!');
        } catch (error) {
            alert('Failed to update user info.');
        }
    };

    const updateUserGoal = async event => {
        event.preventDefault();

        try {
            const updatedUser = await updateUser(user.id, {
                ...user,
                calorieGoal: parseInt(calorieGoal) || 0,
                proteinGoal: parseInt(proteinGoal) || 0,
            });
            alert('Goals updated successfully!');
        } catch (error) {
            alert('Failed to update goals.');
        }
    };

    const changePassword = async event => {
        event.preventDefault();

        if (password !== user.password) {
            alert('Passwords do not match.');
            return;
        }

        if (newPassword !== newPasswordConfirmation) {
            alert('New password and confirmation do not match.');
            return;
        }

        try {
            const updatedUser = await updateUser(user.id, {
                ...user,
                password: newPassword,
            });

            setPassword('');
            setNewPassword('');
            setNewPasswordConfirmation('');
        } catch (error) {
            alert('Failed to update goals.');
        }
    };

    const deleteAccount = async event => {
        event.preventDefault();

        const confirmed = window.confirm('Are you sure you want to delete your account?');
        if (!confirmed) return;

        try {
            await deleteUser(user.id);

            alert('Your account has been deleted');
            setUser(null);
            navigate('/login');
        } catch (error) {
            alert('Failed to delete account. Please try again later.');
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 text-center">
            <hr className="mx-10 my-5 bg-gray-300 border-0.5" />

            <div className="my-5">
                <h1 className="text-3xl font-bold mb-1"> - Account Details - </h1>
                <hr className="mx-10 my-5 bg-gray-300 border-0.5" />
            </div>

            <div className="mt-10 mx-20">
                <div className="mb-10 shadow-lg">
                    <h2 className="mb-3"> Update Intake Goal's </h2>

                    <form id="Intake Goal" onSubmit={updateUserGoal} className="border p-10">
                        <h3> Calorie Goal </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="number"
                                min="0"
                                value={calorieGoal}
                                placeholder="Optional"
                                onChange={event => setCalorieGoal(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <h3> Protein Goal </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="number"
                                min="0"
                                value={proteinGoal}
                                placeholder="Optional"
                                onChange={event => setProteinGoal(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <input
                            type="submit"
                            value="Submit"
                            className="mt-2 px-4 py-2 mt-4 bg-blue-500 text-white shadow-md rounded hover:cursor-pointer hover:bg-blue-600 hover:scale-101"
                        />
                    </form>
                </div>

                <div className="mt-10 shadow-lg">
                    <h2 className="mb-3"> Update User Details </h2>

                    <form
                        id="User Details"
                        onSubmit={updateUserInformation}
                        className="border p-10"
                    >
                        <h3> Name: </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="text"
                                value={name}
                                placeholder="Optional"
                                onChange={event => setName(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <h3 className="mt-3"> Username: </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="text"
                                value={username}
                                placeholder="Username"
                                onChange={event => setUsername(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <input
                            type="submit"
                            value="Submit"
                            className="mt-2 px-4 py-2 bg-blue-500 text-white shadow-md rounded hover:cursor-pointer hover:bg-blue-600 hover:scale-101"
                        />
                    </form>
                </div>

                <div className="mt-10 shadow-lg">
                    <h2 className="mb-3"> Update Password </h2>

                    <form id="Update Password" onSubmit={changePassword} className="border p-10">
                        <h3 className="mt-3"> Current Password </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="password"
                                placeholder="Enter Current Password"
                                onChange={event => setPassword(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <h3 className="mt-3"> Enter new password: </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                onChange={event => setNewPassword(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <label className="font-bold flex flex-col text-md mt-2">
                            <input
                                type="password"
                                placeholder="Re-enter New Password"
                                onChange={event => setNewPasswordConfirmation(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>
                        <input
                            type="submit"
                            value="Submit"
                            className="mt-2 px-4 py-2 bg-blue-500 text-white shadow-md rounded hover:cursor-pointer hover:bg-blue-600 hover:scale-101"
                        />
                    </form>
                </div>

                <div className="mt-10">
                    <button
                        onClick={deleteAccount}
                        className="mt-2 px-4 py-2 bg-red-500 text-white shadow-md rounded hover:bg-red-600 hover:scale-101"
                    >
                        Delete Account
                    </button>
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 my-10 md:mx-10 sm:w-full">
                    <p className="text-gray-600 col-span-2 pt-10 mx-auto max-w-4xl text-center font-semibold">
                        {' '}
                        *This feature is still in progress. Our team of 1 person is still learning,
                        we are trying our best to deliver you the features that you deserve in an
                        overall health and fitness app!{' '}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
