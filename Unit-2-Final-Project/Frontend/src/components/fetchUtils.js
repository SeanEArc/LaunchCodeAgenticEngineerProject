// Calls against the existing user/food endpoints. Everything goes through
// apiRequest so each one sends the session cookie and, for mutations, the CSRF
// header.

import { apiRequest } from '../api/client';

// Call user by id. Returns the user with their nested loggedFoods.
export async function getUserByID(userId) {
    return apiRequest(`/users/${userId}`);
}

// Create Logged-Food Item
export async function createNewDailyId(date, user) {
    return apiRequest('/logged-foods/add', {
        method: 'POST',
        body: {
            date: date,
            user: { id: user },
            loggedFoodItems: [],
        },
    });
}

// Create a food item under a daily log.
export async function createFoodItem(loggedFoodId, foodItem) {
    return apiRequest(`/food-item/add/${loggedFoodId}`, {
        method: 'POST',
        body: foodItem,
    });
}

//Delete foodItem
export async function deleteFoodItem(id) {
    return apiRequest(`/food-item/${id}`, {
        method: 'DELETE',
        parseAs: 'text',
    });
}

// Delete's DailyLoggedFood DailyLog is empty.
export async function deleteDailyLog(id) {
    const dailyLog = await apiRequest(`/logged-foods/${id}`);

    //Only delete's DailyLog if no food items
    if (dailyLog.loggedFoodItems.length === 0) {
        return apiRequest(`/logged-foods/${id}`, {
            method: 'DELETE',
            parseAs: 'text',
        });
    }
}

//Edit's userResponse
export async function updateFoodItem(foodId, updatedData) {
    return apiRequest(`/food-item/update/${foodId}`, {
        method: 'PUT',
        body: updatedData,
    });
}

// Updated user information. Only the fields being changed are sent; the backend
// keeps the stored password hash and any field left out.
export async function updateUser(userId, updatedData) {
    return apiRequest(`/users/update/${userId}`, {
        method: 'PUT',
        body: updatedData,
    });
}
