import { useContext, useState } from 'react';
import { UserContext } from './UserContext';
import { updateUser } from './fetchUtils';

// Keeps the context holding the same public fields as /auth/me, whatever else a
// legacy endpoint happens to echo back.
const toPublicUser = updated => ({
    id: updated.id,
    name: updated.name,
    username: updated.username,
    calorieGoal: updated.calorieGoal,
    proteinGoal: updated.proteinGoal,
});

const AccountDetails = () => {
    const { user, setUser } = useContext(UserContext);

    const [name, setName] = useState(user.name ?? '');
    const [username, setUsername] = useState(user.username ?? '');
    const [calorieGoal, setCalorieGoal] = useState(user.calorieGoal ?? '');
    const [proteinGoal, setProteinGoal] = useState(user.proteinGoal ?? '');

    // One status per form, so a failed save never leaves a success message up.
    const [detailsStatus, setDetailsStatus] = useState(null);
    const [goalStatus, setGoalStatus] = useState(null);

    // Only the fields the form owns are sent. Passwords are never included, so
    // the stored hash cannot be overwritten from here.
    const updateUserInformation = async event => {
        event.preventDefault();
        setDetailsStatus(null);

        try {
            const updatedUser = await updateUser(user.id, {
                name,
                username: username.trim(),
            });

            setUser(toPublicUser(updatedUser));
            setUsername(updatedUser.username ?? '');
            setDetailsStatus({ ok: true, message: 'User info updated successfully.' });
        } catch (error) {
            setDetailsStatus({
                ok: false,
                message: `Failed to update user info: ${error.message}`,
            });
        }
    };

    const updateUserGoal = async event => {
        event.preventDefault();
        setGoalStatus(null);

        try {
            const updatedUser = await updateUser(user.id, {
                calorieGoal: parseInt(calorieGoal) || 0,
                proteinGoal: parseInt(proteinGoal) || 0,
            });

            setUser(toPublicUser(updatedUser));
            setGoalStatus({ ok: true, message: 'Goals updated successfully.' });
        } catch (error) {
            setGoalStatus({ ok: false, message: `Failed to update goals: ${error.message}` });
        }
    };

    const statusClasses = status =>
        status.ok ? 'mt-3 font-medium text-green-700' : 'mt-3 font-medium text-red-500';

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

                        {goalStatus && (
                            <p className={statusClasses(goalStatus)}>{goalStatus.message}</p>
                        )}
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

                        {detailsStatus && (
                            <p className={statusClasses(detailsStatus)}>{detailsStatus.message}</p>
                        )}
                    </form>
                </div>

                {/*
                    Changing a password and deleting an account both need backend
                    endpoints that do not exist yet. The controls stay visible but
                    disabled so the gap is obvious rather than silent.
                */}
                <div className="mt-10 shadow-lg">
                    <h2 className="mb-3"> Update Password </h2>

                    <div className="border p-10">
                        <h3 className="mt-3"> Current Password </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="password"
                                placeholder="Enter Current Password"
                                disabled
                                className="mt-1 p-1 rounded-md border border-zinc-300 bg-gray-100 text-gray-500"
                            />
                        </label>

                        <h3 className="mt-3"> Enter new password: </h3>
                        <label className="font-bold flex flex-col text-md">
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                disabled
                                className="mt-1 p-1 rounded-md border border-zinc-300 bg-gray-100 text-gray-500"
                            />
                        </label>

                        <label className="font-bold flex flex-col text-md mt-2">
                            <input
                                type="password"
                                placeholder="Re-enter New Password"
                                disabled
                                className="mt-1 p-1 rounded-md border border-zinc-300 bg-gray-100 text-gray-500"
                            />
                        </label>

                        <button
                            type="button"
                            disabled
                            className="mt-4 px-4 py-2 bg-gray-300 text-gray-600 shadow-md rounded cursor-not-allowed"
                        >
                            Submit
                        </button>

                        <p className="mt-3 font-medium text-gray-600">
                            Changing your password is temporarily unavailable.
                        </p>
                    </div>
                </div>

                <div className="mt-10">
                    <button
                        type="button"
                        disabled
                        className="mt-2 px-4 py-2 bg-gray-300 text-gray-600 shadow-md rounded cursor-not-allowed"
                    >
                        Delete Account
                    </button>

                    <p className="mt-3 font-medium text-gray-600">
                        Deleting your account is temporarily unavailable.
                    </p>
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
