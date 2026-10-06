# Round 1 Frontend Handoff (Session B)

Branch: `feature/frontend-auth-round-1`
Worktree: `../fitness-frontend-auth`

Covers registration, login, session restoration, private-route protection and
logout. Round 2 (authenticated food/history endpoints and ownership checks) and
Round 3 (dedicated profile/password/deletion endpoints) are not in here.

## Running it

```bash
cd Frontend
npm ci
npm run dev        # http://localhost:5173
```

Use the same hostname in the browser that the backend allows as its CORS origin.
`localhost` and `127.0.0.1` are different origins, so the session cookie will not
be sent if they are mixed.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8080` | Base URL of the backend. |

`.env.example` is the template. Copy it to `.env.local` to override; `.env.local`
is already git-ignored. There are no secrets on this side: the session lives in an
HttpOnly cookie the backend sets, and the CSRF token is fetched at runtime.

## What changed

### New

| File | Purpose |
|---|---|
| `src/api/client.js` | The shared API helper. Configurable base URL, `credentials: 'include'` on every request, CSRF header on every mutation, and typed failures (`ApiError` with a status, `NetworkError` when the backend cannot be reached). |
| `src/api/auth.js` | `register`, `login`, `fetchCurrentUser`, `logout`. |
| `src/components/ProtectedRoute.jsx` | Gates private routes on the restored session. |
| `.env.example` | Template for `VITE_API_URL`. |

### Modified

| File | Change |
|---|---|
| `src/components/UserContext.jsx` | Restores the session through `GET /auth/me` on mount and exposes `authStatus` (`loading` / `authenticated` / `unauthenticated` / `error`), plus `login`, `logout`, `restoreSession` and `sessionMessage`. |
| `src/components/auth/LoginPage.jsx` | Calls `POST /auth/login`. No longer downloads every user or compares stored passwords. |
| `src/components/auth/Registration.jsx` | Calls `POST /auth/register` and reads 409 for a duplicate username instead of scanning `/users/all`. |
| `src/components/Dashboard.jsx` | Log Out calls `POST /auth/logout`, then redirects to `/`. |
| `src/components/AccountDetails.jsx` | Profile and goal forms send only their own fields and never a password. Password-change and account-deletion controls are disabled. |
| `src/components/AddFoodModal.jsx` | Food posts go through the API helper; a failed save keeps the form open with an error instead of closing as if it worked. |
| `src/components/CalorieHistory.jsx` | Load/update/delete failures surface with a retry instead of throwing. |
| `src/components/fetchUtils.js` | Rewritten on top of the API helper. `postUserData`, `fetchGetData` and `deleteUser` are gone. |
| `src/App.jsx` | `/dashboard`, `/calorieHistory` and `/accountDetails` are wrapped in `ProtectedRoute`. The unused `setEntries` callback is removed. |

## Behaviour notes

**Session restoration.** `UserProvider` calls `/auth/me` on mount. A 401 means
unauthenticated, which is a normal answer. Anything else (backend down, CORS
failure) becomes the `error` state, which `ProtectedRoute` renders as a message
with a Try again button rather than bouncing the user to the login page.

**Expired sessions.** `client.js` lets `UserContext` register a handler that fires
on a 401 from any private request. It clears the user, and `ProtectedRoute` then
redirects to `/` where the login page shows "Your session expired. Please log in
again." Login, registration and `/auth/me` opt out of that handler, so wrong
credentials stay an ordinary login error and the first `/auth/me` probe does not
look like an expiry.

**Network failures.** A `NetworkError` is never treated as a logout. The login
page offers a Retry button, the protected routes offer Try again, and the food
history offers Try again.

**Failed saves.** No form reports success unless the request succeeded, and
nothing is replayed automatically after a later login. Preserving drafts across a
login is deferred, as agreed.

**CSRF.** The token is fetched from `GET /auth/csrf` on the first mutation and
cached in memory only. It is re-fetched after login and after logout, because the
session identifier rotates at both points. It is never written to localStorage or
sessionStorage. There is deliberately **no** automatic retry on a 403, so a
rejected mutation stays visible instead of silently succeeding on a second try.

**No credentials in browser storage.** The only `fetch` calls in the app are the
two inside `src/api/client.js`, both with `credentials: 'include'`.

## Integration dependencies on Session A

These have to be true on the backend for the frontend to work as written:

1. **`PUT /users/update/{id}` must preserve omitted fields and ignore incoming
   passwords.** The profile form now sends only `{ name, username }` and the goal
   form only `{ calorieGoal, proteinGoal }`. Against the pre-Round-1 controller,
   which calls every setter unconditionally, a partial body would null out the
   fields left out, including the password. This is the single highest-risk
   integration point.
2. **`GET /users/{id}` must stop returning `password`.** The food and history
   screens still use this endpoint for its nested `loggedFoods`, which `/auth/me`
   does not carry. The frontend keeps only the public fields in context, but the
   field should not be on the wire at all.
3. **CORS must allow credentials from `http://localhost:5173`** and must accept
   the CSRF header name that `/auth/csrf` reports.
4. **`/auth/csrf` must be reachable while unauthenticated**, since the login and
   registration forms are mutations and need the header.
5. **CSRF must not block the food endpoints.** Every food mutation now sends the
   header, but the backend has to accept it on `/logged-foods/**` and
   `/food-item/**` as well as on `/auth/**`.
6. **`POST /auth/register` must return 409 for a duplicate username** and 400 for
   invalid input, both as `{ "message": "..." }`. The old client-side duplicate
   scan over `/users/all` is gone.
7. **`POST /auth/logout` must answer 204** and invalidate the session.

## Verification status

Run in this container:

| Check | Result |
|---|---|
| `npm ci` | Passed |
| `npm run lint` | 0 errors, 1 warning. Baseline was 15 errors, 2 warnings. |
| `npm run build` | Passed (`vite build`, 77 modules) |
| `npm run dev` + HTTP request to `http://localhost:5173/` | Server starts and serves the app |

The one remaining lint warning is pre-existing: `react-refresh/only-export-components`
on `UserContext.jsx`, because the file exports both the context and the provider.
Splitting it would touch every consumer's imports, so it is left alone.

### Not verified

No browser and no Round 1 backend were available in this container, so **none of
the runtime behaviour below has been exercised**. All of it needs a manual pass
against Session A's backend:

1. Register a disposable account, log in, and confirm invalid credentials show an
   error.
2. Refresh a private page and confirm the session is restored.
3. Log food, view history, update profile and goals; log out and back in and
   confirm the updates persisted.
4. Confirm the password-change and deletion controls are unavailable.
5. Log out and confirm private pages redirect to `/`, including after a refresh.
6. Confirm no backend response contains a password or hash.
7. Confirm an expired session redirects with the session-expired message, that a
   stopped backend offers a retry, and that a mutation without a valid CSRF token
   is rejected. For the expiry check, drop the backend session timeout
   temporarily and restore the 30-minute default afterwards.

Cross-user backend protection is **not** complete. Legacy `/users/**`,
`/logged-foods/**` and `/food-item/**` endpoints still lack ownership checks, so
disabling a control in this UI does not stop a direct API call. Keep the app
local until Round 2 lands.

## Housekeeping

`npx prettier --write "src/**/*.{js,jsx}"` was run over `src/`. Prettier's default
`endOfLine: "lf"` rewrote the repository's CRLF endings, so every file under
`src/` was converted back to CRLF afterwards, and `src/main.jsx`, the only file
that was not already Prettier-clean, was restored to its original formatting.
`AboutPage.jsx`, `HowItWorks.jsx`, `assets/foodIcons/foodIcons.js` and
`assets/StockPhotos/stockPhotos.js` were checked by Prettier but are not expected
to differ; worth a glance in `git diff` before committing.

## Commit status

The commit could not be made from inside the container. This worktree's `.git`
file points at
`C:/Users/seana/Desktop/LaunchCode/.../.git/worktrees/fitness-frontend-auth`,
and only the project folder is mounted at `/workspace`, so the real git directory
is not reachable and every git command fails with
`fatal: not a git repository`. Stage and commit from the host:

```bash
cd ../fitness-frontend-auth/Unit-2-Final-Project/Frontend
git add src/api src/App.jsx src/components .env.example HANDOFF-ROUND1.md
git commit -m "Connect frontend to Round 1 session auth"
```
