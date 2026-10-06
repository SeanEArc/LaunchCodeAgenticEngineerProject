// Authentication calls. The session lives in an HttpOnly cookie set by the
// backend, so nothing here stores a user or a token in the browser.

import { apiRequest, clearCsrfToken, refreshCsrfToken } from './client';

// Optional goals come from number inputs, so they arrive as strings and are
// omitted entirely when left blank.
function optionalGoal(value) {
    if (value === undefined || value === null || value === '') return undefined;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

// POST /auth/register -> 201 with public user data, no session established.
export async function register({ name, username, password, calorieGoal, proteinGoal }) {
    const payload = { name, username, password };

    const calories = optionalGoal(calorieGoal);
    if (calories !== undefined) payload.calorieGoal = calories;

    const protein = optionalGoal(proteinGoal);
    if (protein !== undefined) payload.proteinGoal = protein;

    return apiRequest('/auth/register', {
        method: 'POST',
        body: payload,
        notifyUnauthorized: false,
    });
}

// POST /auth/login -> 200 with public user data, 401 on bad credentials.
export async function login(username, password) {
    const user = await apiRequest('/auth/login', {
        method: 'POST',
        body: { username, password },
        notifyUnauthorized: false,
    });

    // The session identifier rotates on login, so the old CSRF token is stale.
    await refreshCsrfToken();

    return user;
}

// GET /auth/me -> 200 with public user data, 401 when unauthenticated.
export async function fetchCurrentUser() {
    return apiRequest('/auth/me', {
        method: 'GET',
        notifyUnauthorized: false,
    });
}

// POST /auth/logout -> 204. The cached token is dropped and re-fetched either
// way, so the login page can submit again even if the call failed.
export async function logout() {
    let failure = null;

    try {
        await apiRequest('/auth/logout', {
            method: 'POST',
            notifyUnauthorized: false,
        });
    } catch (error) {
        failure = error;
    }

    clearCsrfToken();

    try {
        await refreshCsrfToken();
    } catch {
        // The backend is unreachable. apiRequest fetches a token lazily before
        // the next mutation, so there is nothing to report here.
    }

    if (failure) throw failure;
}
