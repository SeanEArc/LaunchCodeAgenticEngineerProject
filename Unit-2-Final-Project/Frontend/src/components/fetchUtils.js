// Fetch all data.
export async function fetchGetData(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
}

// Post new user
export async function postUserData(url, name, username, password, calorieGoal, proteinGoal) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            username: username,
            password: password,
            calorieGoal: calorieGoal,
            proteinGoal: proteinGoal,
        }),
    });

    const data = await response.json();
    return data;
}

// Call user by id
export async function getUserByID(userId) {
    const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const userData = await response.json();

    return userData;
}

// Create Logged-Food Item
export async function createNewDailyId(date, user) {
    const postResponse = await fetch('http://localhost:8080/logged-foods/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            date: date,
            user: { id: user },
            loggedFoodItems: [],
        }),
    });

    const data = await postResponse.json();
    return data;
}

//Delete foodItem
export async function deleteFoodItem(id) {
    const response = await fetch(`http://localhost:8080/food-item/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete: ${errorText}`);
    }

    return await response.text();
}

// Delete's DailyLoggedFood DailyLog is empty.
export async function deleteDailyLog(id) {
    // Get the loggedFood by ID
    const responseGet = await fetch(`http://localhost:8080/logged-foods/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!responseGet.ok) {
        const errorText = await responseGet.text();
        throw new Error(`Failed to fetch log: ${errorText}`);
    }

    const userData = await responseGet.json();

    //Only delete's DailyLog if no food items
    if (userData.loggedFoodItems.length === 0) {
        const responseDelete = await fetch(`http://localhost:8080/logged-foods/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!responseDelete.ok) {
            const errorText = await responseDelete.text();
            throw new Error(`Failed to delete: ${errorText}`);
        }

        const message = await responseDelete.text();

        return message;
    }
}

//Edit's userResponse
export async function updateFoodItem(foodId, updatedData) {
    const response = await fetch(`http://localhost:8080/food-item/update/${foodId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update: ${errorText}`);
    }

    return await response.json();
}

// Updated user information
export async function updateUser(userId, updatedData) {
    const response = await fetch(`http://localhost:8080/users/update/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update: ${errorText}`);
    }

    return await response.json();
}

// Delete Account:
export async function deleteUser(id) {
    //Only delete's DailyLog if no food items

    const responseDelete = await fetch(`http://localhost:8080/users/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!responseDelete.ok) {
        const errorText = await responseDelete.text();
        throw new Error(`Failed to delete: ${errorText}`);
    }

    const message = await responseDelete.text();

    return message;
}
