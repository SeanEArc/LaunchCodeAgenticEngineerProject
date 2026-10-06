// Shared API helper. Every backend call in the app goes through here so that the
// base URL, cookie credentials, CSRF headers and error shapes stay in one place.

// Configurable backend URL. Set VITE_API_URL in Frontend/.env.local to point at a
// different backend; the local default matches the Round 1 development backend.
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(
    /\/+$/,
    ''
);

const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

// The backend answered, but with a non-2xx status.
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

// The backend could not be reached at all (offline, server down, CORS failure).
export class NetworkError extends Error {
    constructor(message, cause) {
        super(message);
        this.name = 'NetworkError';
        this.cause = cause;
    }
}

export const NETWORK_ERROR_MESSAGE =
    'Could not reach the server. Check that the backend is running and try again.';

// ------------------------------ CSRF token ---------------------------------
// Kept in memory only. Never written to localStorage/sessionStorage.

let csrf = null;
let csrfRequest = null;

export function clearCsrfToken() {
    csrf = null;
    csrfRequest = null;
}

async function requestCsrfToken() {
    let response;

    try {
        response = await fetch(`${API_BASE_URL}/auth/csrf`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (cause) {
        throw new NetworkError(NETWORK_ERROR_MESSAGE, cause);
    }

    if (!response.ok) {
        throw new ApiError(response.status, 'Could not get a security token from the server.');
    }

    const data = await response.json();

    if (!data || !data.token || !data.headerName) {
        throw new ApiError(response.status, 'The server returned an unusable security token.');
    }

    return { token: data.token, headerName: data.headerName };
}

// Returns the cached token, fetching one if needed. Concurrent callers share a
// single in-flight request.
export async function ensureCsrfToken() {
    if (csrf) return csrf;

    if (!csrfRequest) {
        csrfRequest = requestCsrfToken()
            .then(token => {
                csrf = token;
                return token;
            })
            .finally(() => {
                csrfRequest = null;
            });
    }

    return csrfRequest;
}

// Drops the cached token and fetches a new one. The session identifier rotates on
// login and logout, so the token has to be retrieved again at both points.
export async function refreshCsrfToken() {
    clearCsrfToken();
    return ensureCsrfToken();
}

// ------------------------- Expired-session handling -------------------------
// UserContext registers a handler so a 401 on any private request can clear
// authentication once, instead of every caller repeating that logic.

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

// ------------------------------- Requests -----------------------------------

function defaultMessageForStatus(status) {
    if (status === 400) return 'The server rejected that request as invalid.';
    if (status === 401) return 'You are not signed in.';
    if (status === 403) return 'That request was rejected for security reasons. Please try again.';
    if (status === 404) return 'That item could not be found.';
    if (status === 409) return 'That value is already taken.';
    return `The server responded with an error (${status}).`;
}

async function readErrorMessage(response) {
    let text = '';

    try {
        text = await response.text();
    } catch {
        text = '';
    }

    if (!text) return defaultMessageForStatus(response.status);

    try {
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.message === 'string' && parsed.message) {
            return parsed.message;
        }
    } catch {
        // Not JSON. Legacy endpoints answer with plain text.
    }

    return text;
}

async function readBody(response, parseAs) {
    if (response.status === 204) return null;

    if (parseAs === 'text') {
        return response.text();
    }

    const text = await response.text();
    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

/**
 * Makes a request against the backend.
 *
 * Always sends the session cookie, attaches the CSRF header to mutations, and
 * turns failures into ApiError (the server answered) or NetworkError (it did not),
 * so callers can tell an expired session from an unreachable backend.
 */
export async function apiRequest(path, options = {}) {
    const {
        method = 'GET',
        body,
        headers = {},
        parseAs = 'json',
        // Login, registration and the session probe handle their own 401s; they
        // must not be mistaken for an expired session.
        notifyUnauthorized = true,
    } = options;

    const upperMethod = method.toUpperCase();
    const requestHeaders = { ...headers };

    if (body !== undefined) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    if (MUTATING_METHODS.includes(upperMethod)) {
        const token = await ensureCsrfToken();
        requestHeaders[token.headerName] = token.token;
    }

    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: upperMethod,
            credentials: 'include',
            headers: requestHeaders,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch (cause) {
        throw new NetworkError(NETWORK_ERROR_MESSAGE, cause);
    }

    if (!response.ok) {
        const message = await readErrorMessage(response);

        if (response.status === 401 && notifyUnauthorized && unauthorizedHandler) {
            unauthorizedHandler();
        }

        throw new ApiError(response.status, message);
    }

    return readBody(response, parseAs);
}
