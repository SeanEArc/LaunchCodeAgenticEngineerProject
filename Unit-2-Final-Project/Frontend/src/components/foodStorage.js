// Format's food to decmial
export const formatNumber = number => {
    return new Intl.NumberFormat('en-US').format(number);
};

// Total's the values for each object in the array
export const addedItems = (array, key) => {
    return array.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
};

// Get's today's date
export const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
};
