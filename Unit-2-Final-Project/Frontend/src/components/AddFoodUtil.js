// padStart is a string method which is why we convert it here.
export function getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Converts ingredients string into an array
export function convertIngredientStringToArray(ingredientsString) {
    const splitString = ingredientsString.split(',');
    const strippedIngredients = [];

    for (let i = 0; i < splitString.length; i++) {
        let ingredient = splitString[i].trim();
        if (ingredient.length > 1) {
            strippedIngredients.push(ingredient);
        }
    }

    return strippedIngredients;
}
