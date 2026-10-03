// This is for the editing popup
const EditingForm = ({ editForm, setEditForm, handleUpdate, cancelEdit }) => {
    return (
        <div className="p-4 border rounded bg-gray-100 mt-4">
            <h2 className="font-bold mb-2 text-center"> Edit Food Entry </h2>

            {[
                { label: 'Food Name', key: 'foodName', type: 'text' },
                { label: 'Calories', key: 'calories', type: 'number' },
                { label: 'Protein', key: 'protein', type: 'number' },
                { label: 'Carbs', key: 'carbs', type: 'number' },
                { label: 'Fat', key: 'fat', type: 'number' },
            ].map(({ label, key, type }) => (
                <label className="font-bold" key={key}>
                    {label}:
                    <input
                        className="mb-2 p-1 w-full font-normal"
                        placeholder={label}
                        type={type}
                        value={editForm[key]}
                        onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                    />
                </label>
            ))}

            <label className="font-bold">
                Ingredients (comma separated):
                <textarea
                    className="mb-2 p-1 w-full font-normal"
                    placeholder="Enter ingredients separated by commas"
                    value={editForm.ingredients.join(', ')}
                    onChange={e =>
                        setEditForm({
                            ...editForm,
                            ingredients: e.target.value.split(',').map(i => i.trim()),
                        })
                    }
                />
            </label>

            <div className="flex justify-center items-center">
                <button
                    className="bg-blue-500 text-zinc-200 px-20 py-2 mr-2 rounded font-semibold hover:bg-blue-600 hover:text-white"
                    onClick={handleUpdate}
                >
                    Save
                </button>

                <button
                    className="bg-red-500 text-gray-900 px-20 py-2 rounded hover:bg-red-600 font-semibold hover:text-black"
                    onClick={cancelEdit}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};
export default EditingForm;
