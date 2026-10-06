import { useState, useRef, useContext } from 'react';
import { UserContext } from './UserContext';
import { getFormattedDate, convertIngredientStringToArray } from './AddFoodUtil';
import { createFoodItem, createNewDailyId, getUserByID } from './fetchUtils';

// When onClose is equal to true, AddFoodModal will close
const AddFoodModal = ({ onClose, onFoodAdded }) => {
    const { user, triggerRefreshKey } = useContext(UserContext);

    const [foodName, setFoodName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [date, setDate] = useState(getFormattedDate());
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const modalRef = useRef();

    // Closes AddFoodModal if clicked outside of the AddFoodModal
    const closeModal = event => {
        if (modalRef.current === event.target) onClose();
    };

    // Handle's submit
    const handleSubmit = async event => {
        event.preventDefault();

        const cleanedIngredients = convertIngredientStringToArray(ingredients);

        setError(null);
        setIsSaving(true);

        try {
            let existingDate = false;
            let loggedFoodId = null;

            // Fetching data
            // Calls user data by id.
            const getUser = await getUserByID(user.id);

            //Checks if date under loggedFoods exsist
            for (let i = 0; i < getUser.loggedFoods.length; i++) {
                if (getUser.loggedFoods[i].date == date) {
                    existingDate = true;
                    loggedFoodId = getUser.loggedFoods[i].foodId;
                    break;
                }
            }

            // Create's new daily log if it does not exsist yet.
            if (!existingDate) {
                await createNewDailyId(date, user.id);
            }

            if (!loggedFoodId) {
                // Calls user data by id to check again.
                const reloadedUser = await getUserByID(user.id);

                for (let i = 0; i < reloadedUser.loggedFoods.length; i++) {
                    if (reloadedUser.loggedFoods[i].date == date) {
                        loggedFoodId = reloadedUser.loggedFoods[i].foodId;
                        break;
                    }
                }
            }

            // Creates new food item.
            await createFoodItem(loggedFoodId, {
                foodName: foodName,
                calories: Number(calories),
                protein: Number(protein),
                carbs: Number(carbs),
                fat: Number(fat),
                ingredients: cleanedIngredients,
            });

            triggerRefreshKey();
        } catch (saveError) {
            // The entry was not saved, so the form keeps its values and stays
            // open instead of reporting success.
            setError(saveError.message);
            return;
        } finally {
            setIsSaving(false);
        }

        // Clear's form after submit
        setFoodName('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        setIngredients('');

        // Tell's the useEffect that displayAllUsers needs to be updated
        onFoodAdded?.();

        // Closes Modal
        onClose();
    };

    return (
        // modalRef is now equal to the AddFoodModal Backdrop
        <div
            ref={modalRef}
            onClick={closeModal}
            className="flex fixed inset-0 backdrop-blur-sm items-center justify-center z-50"
        >
            <div className="grid grid-row-6 bg-zinc-50 p-6 rounded-lg shadow-xl w-[550px] max-w-[1000px] border">
                <form id="Log Food Item" onSubmit={handleSubmit} className="flex flex-col gap-1">
                    <h2 className="text-xl font-semibold text-center"> Log Food </h2>

                    <label className="font-bold flex flex-col text-md mb-1">
                        Name of food:
                        <input
                            type="text"
                            value={foodName}
                            placeholder="Required"
                            onChange={event => setFoodName(event.target.value)}
                            required
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                        />
                    </label>

                    <label className="font-bold flex flex-col text-md">
                        {' '}
                        Calories:
                        <input
                            type="number"
                            value={calories}
                            placeholder="Required"
                            onChange={event => setCalories(event.target.value)}
                            required
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                        />
                    </label>

                    <label className="font-bold flex flex-col text-md mb-1">
                        Select Date
                        <input
                            type="date"
                            value={date}
                            placeholder="Required"
                            onChange={event => setDate(event.target.value)}
                            required
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                        />
                    </label>

                    <h2 className="text-center font-bold mt-4 mb-2 "> Macro's </h2>

                    <div className="grid grid-cols-3 text-center mb-2">
                        <label className="font-bold flex flex-col text-md mb-1 ">
                            Protein
                            <input
                                type="number"
                                value={protein}
                                placeholder="Optional"
                                onChange={event => setProtein(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 text-shadow-white"
                            />
                        </label>

                        <label className="font-bold flex flex-col text-md mb-1">
                            Carbs
                            <input
                                type="number"
                                value={carbs}
                                placeholder="Optional"
                                onChange={event => setCarbs(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>

                        <label className="font-bold flex flex-col text-md mb-1">
                            Fats
                            <input
                                type="number"
                                value={fat}
                                placeholder="Optional"
                                onChange={event => setFat(event.target.value)}
                                className="mt-1 p-1 rounded-md border border-zinc-300 "
                            />
                        </label>
                    </div>

                    <h2 className="text-center font-bold mt-4 mb-2 "> Ingredients </h2>
                    <p className="text-sm"> *Separate each ingredient by a comma </p>

                    <label className="font-bold flex flex-col text-md">
                        <input
                            type="text"
                            value={ingredients}
                            placeholder="Optional"
                            onChange={event => setIngredients(event.target.value)}
                            className="mt-1 p-1 rounded-md border border-zinc-300 "
                        />
                    </label>

                    <hr className="mb-1 border-t border-zinc-300 opacity-50" />

                    {error && <p className="text-red-500 font-medium text-center">{error}</p>}

                    <input
                        type="submit"
                        value={isSaving ? 'Saving...' : 'Submit'}
                        disabled={isSaving}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white shadow-md rounded hover:cursor-pointer hover:bg-blue-600 hover:scale-101 disabled:opacity-60"
                    />

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-2 px-4 py-2 bg-red-500 text-white shadow-md rounded hover:bg-red-600 hover:scale-101"
                    >
                        Close
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddFoodModal;
