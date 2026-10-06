# Backend Handoff - Round 1 (Session A)

Authentication, sessions, CSRF and password hashing for local development.
Written for Session B (frontend) and for whoever combines the two branches.

> **Local only.** The legacy `/users`, `/logged-foods` and `/food-item`
> endpoints still have no authentication and no ownership checks. Anyone who
> can reach port 8080 can read and modify any account's data, regardless of
> what the frontend shows. Round 2 fixes this. Do not host this build.

---

## 1. Provision the development database

Round 1 uses a fresh, disposable database. Nothing is migrated, and no existing
database is touched.

```bash
createdb -U postgres fitness_round1_dev
# or, in psql:
#   CREATE DATABASE fitness_round1_dev;
```

Hibernate runs with `ddl-auto=update`, so the `users`, `logged_foods`,
`food_item` and `food_item_ingredients` tables are created on first start. No
migration tooling is included.

There are no seeded accounts. Register disposable ones through
`POST /auth/register`.

## 2. Environment variables

Defaults live in `src/main/resources/application.properties`. Placeholders are
in `.env.example`. **No secret is committed**, and `.env` is git-ignored.

| Variable | Default | Notes |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/fitness_round1_dev` | Use `host.docker.internal` instead of `localhost` from inside a container. |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | |
| `SPRING_DATASOURCE_PASSWORD` | *(none - required)* | Deliberately has no default, so the app fails fast rather than starting with a guessable one. |
| `APP_CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated. Must match the browser address bar exactly, hostname included. |
| `APP_SESSION_TIMEOUT` | `30m` | Inactivity timeout. Shorten only to check expiry handling, then restore. |
| `APP_SESSION_COOKIE_SECURE` | `false` | `false` for local HTTP; `true` once served over HTTPS. |
| `APP_SESSION_COOKIE_SAME_SITE` | `Lax` | |
| `SERVER_PORT` | `8080` | |

## 3. Start the backend

From `Backend/`:

```bash
export SPRING_DATASOURCE_PASSWORD='your-local-postgres-password'

# Windows (the worktree's documented command)
.\mvnw.cmd spring-boot:run

# macOS / Linux
./mvnw spring-boot:run
```

Build only, tests skipped:

```bash
.\mvnw.cmd package -Dmaven.test.skip=true     # Windows
./mvnw package -Dmaven.test.skip=true         # macOS / Linux
```

Quick check once it is up:

```bash
curl -i http://localhost:8080/auth/csrf
```

**Use the same hostname in the browser as the frontend origin you configured.**
`localhost` and `127.0.0.1` are different origins to the browser, and mixing
them breaks both CORS and the session cookie.

---

## 4. Final API contract

All responses are JSON. Errors are always `{"message": "..."}`.

Public user fields, everywhere a user is returned:
`id`, `name`, `username`, `calorieGoal`, `proteinGoal`.
**No endpoint returns a password or a hash.**

### Session and CSRF

- Authentication lives in the backend session, carried by a `JSESSIONID`
  cookie: `HttpOnly`, `SameSite=Lax`, `Secure` configurable (off locally).
- The session expires after **30 minutes of inactivity**.
- Send `credentials: 'include'` on every request.
- Send the CSRF header on **every mutation** - `POST`, `PUT`, `PATCH`,
  `DELETE` - including login, registration and logout, and including all food
  and profile endpoints. `GET` and `OPTIONS` are exempt.
- The CSRF token is stored in the session, never in a readable cookie. Keep it
  in memory only.
- **Re-fetch the token after login and after logout.** Login rotates it
  (alongside the session identifier) and logout destroys it. A stale token
  gives `403`.

| Method | Path | Auth | Body | Success | Errors |
|---|---|---|---|---|---|
| `GET` | `/auth/csrf` | public | - | `200 {"token": "...", "headerName": "X-CSRF-TOKEN"}` | - |
| `POST` | `/auth/register` | public | `name`, `username`, `password`, optional `calorieGoal`, `proteinGoal` | `201` public user, **no session created** | `400` invalid, `409` duplicate username, `403` bad CSRF |
| `POST` | `/auth/login` | public | `username`, `password` | `200` public user, session established | `401` invalid credentials, `403` bad CSRF |
| `GET` | `/auth/me` | session | - | `200` public user | `401` no/expired session |
| `POST` | `/auth/logout` | public | - | `204`, session invalidated | `403` bad CSRF |

Notes:

- `/auth/register` does **not** log the user in. Redirect to login afterwards.
- `/auth/me` is profile-only: no `loggedFoods`, no nested data.
- `/auth/logout` is permitted without a session and always returns `204`, so a
  client whose session already expired can still clear its own state without
  seeing a spurious `401`. A valid CSRF token is still required.
- Usernames are trimmed; comparison is **case-sensitive** this round.
  `devtester` and `DevTester` are two different accounts. Uniqueness is
  enforced in the application only - a database constraint and a final
  normalization policy are Round 3.
- Validation: name required (<= 100 chars), username 3-50 chars, password
  6-72 chars (BCrypt ignores bytes past 72, so longer is rejected rather than
  silently truncated), goals must be >= 0 if present. An empty-string goal
  (`""`) is accepted and stored as `null`.
- Login returns the same `401` message for an unknown username and a wrong
  password, so the response does not reveal which accounts exist.

### Legacy endpoints (unchanged paths, Round 2 will add auth + ownership)

| Method | Path | Change in Round 1 |
|---|---|---|
| `POST` | `/users/add` | **Removed.** Returns `405`. Registration is `POST /auth/register`. |
| `GET` | `/users/all` | Now returns **public user fields only** - no passwords, no hashes, no nested `loggedFoods`. |
| `GET` | `/users/{id}` | Unchanged shape, **minus** the password field. Still returns nested `loggedFoods` -> `loggedFoodItems`, which the dashboard and history views read. |
| `PUT` | `/users/update/{id}` | Accepts `name`, `username`, `calorieGoal`, `proteinGoal` only. **Returns a public user object** (previously the full entity). See the coordination note below. |
| `DELETE` | `/users/delete/{id}` | Unchanged. Frontend control is disabled this round; an authenticated replacement is Round 3. |
| | `/logged-foods/**`, `/food-item/**` | Unchanged, apart from CSRF now being required on their mutations. |

### Coordination notes for Session B

Two response-shape changes affect the frontend:

1. **`PUT /users/update/{id}` returns the public user object**, not the full
   entity. It no longer includes `loggedFoods`. Use the returned object to
   update context directly.
2. **`PUT /users/update/{id}` has no password field.** Any `password` sent in
   the body is ignored and the stored hash is preserved - verified. Omitted
   fields keep their stored values, so a partial body such as
   `{"calorieGoal": 2400}` is safe. Password changes are deferred to Round 3;
   disable the control.
3. **`GET /users/all` no longer returns passwords**, so the old
   "download every user and compare in the browser" login cannot work. Use
   `POST /auth/login`.

CORS is configured once in `SecurityConfig` for the configured origin, with
credentials allowed and `Content-Type`, `Accept`, `X-Requested-With` and
`X-CSRF-TOKEN` on the allow-list. The per-controller `@CrossOrigin`
annotations were removed. A request from an unconfigured origin is rejected
with `403` at the preflight.

---

## 5. What was verified, and how

Backend package build with tests skipped: **passes**.

The HTTP contract below was exercised with manual `curl` requests against a
locally running backend. **The verification run used an in-memory H2 database
rather than PostgreSQL**, because this environment had no PostgreSQL
credentials. Everything checked is database-independent (security wiring,
status codes, JSON shapes, session and CSRF behaviour, BCrypt verification),
but see "Not verified" below.

| # | Check | Result |
|---|---|---|
| 1 | `GET /auth/csrf` returns `{token, headerName: "X-CSRF-TOKEN"}` | pass |
| 2 | Session cookie is `HttpOnly; SameSite=Lax`, no `Secure` on local HTTP | pass |
| 3 | Mutation with no CSRF header -> `403` + `{"message"}` (login, register and food endpoints) | pass |
| 4 | `POST /auth/register` -> `201`, public fields only | pass |
| 5 | Client-supplied `id` and `loggedFoods` in the register body are ignored | pass (sent `id: 999`, got `id: 1`) |
| 6 | Registration does **not** create a session (`/auth/me` -> `401` afterwards) | pass |
| 7 | Duplicate username -> `409`, including when only surrounding whitespace differs | pass |
| 8 | Different case registers as a separate account (case-sensitive this round) | pass |
| 9 | Invalid input -> `400` (blank name, short username, short password, negative goal) | pass |
| 10 | `calorieGoal: ""` accepted, stored as `null` | pass |
| 11 | Wrong password -> `401`; unknown username -> identical `401` | pass |
| 12 | Valid login -> `200` + public user; leading/trailing spaces in username tolerated | pass |
| 13 | **Session identifier rotates on login** | pass (id before != id after) |
| 14 | CSRF token rotates on login; the pre-login token is then rejected with `403` | pass |
| 15 | `GET /auth/me` with a session -> `200`, profile only | pass |
| 16 | `POST /logged-foods/add` then `POST /food-item/add/{id}` -> `201` each | pass |
| 17 | `GET /users/{id}` still nests `loggedFoods` -> `loggedFoodItems` | pass |
| 18 | Profile/goal update with a `password` in the body ignores it; the old password still logs in and the injected one does not | pass |
| 19 | Partial update preserves omitted fields | pass |
| 20 | Renaming to a taken username -> `409` | pass |
| 21 | No `password` field or BCrypt hash in any of `/users/all`, `/users/{id}`, `/auth/me` | pass |
| 22 | `POST /users/add` is gone | pass (`405`) |
| 23 | `POST /auth/logout` -> `204`; `/auth/me` afterwards -> `401`; repeat logout still `204` | pass |
| 24 | CORS preflight from `http://localhost:5173` returns the credentialed headers | pass |
| 25 | CORS preflight from another origin -> `403` | pass |
| 26 | Passwords are stored BCrypt-hashed (login verifies through `BCryptPasswordEncoder`; no "does not look like BCrypt" warning in the log) | pass |
| 27 | No Spring Security default user is generated | pass |
| 28 | Session expiry: with `APP_SESSION_TIMEOUT=1m`, a session left idle for 100s returns `401` on `/auth/me` and is issued a fresh, empty session | pass |
| 29 | Unknown route -> `404 {"message": "Endpoint not found."}` | pass |
| 30 | `POST /users/add` with a valid CSRF token -> `405 {"message": "..."}`, and no account is created | pass |

The timeout override in check 28 was temporary. The committed default is
`30m`.

Checks 1-27 and 29-30 were re-run against the exact built jar after the
verification-only H2 dependency was removed from `pom.xml`; all passed.

### Error-body shape

Every error the API produces uses `{"message": "..."}`, including CSRF
rejections and access denials raised inside the filter chain (where
`@RestControllerAdvice` does not apply, so `SecurityConfig` installs JSON
handlers), unknown routes (`404`), unsupported methods (`405`) and unexpected
failures (`500`, with the cause logged rather than returned).

### Not verified

- **Not run against PostgreSQL.** The verification used H2. Schema generation
  and the `fitness_round1_dev` setup instructions in section 1 are **unverified
  on PostgreSQL** and should be confirmed on first real start.
- **No browser/UI integration.** Session B owns that.
- **The real 30-minute timeout** was not waited out; only the 1-minute override
  was observed.
- **No automated tests** were created, modified or run, as required.
- **Concurrent duplicate registration** is not prevented. The uniqueness check
  is application-level only; two simultaneous registrations of the same
  username could both succeed until the Round 3 database constraint lands.
- **Cross-user backend protection is not complete and is not claimed.** The
  legacy endpoints remain open. See the warning at the top.

### Known rough edges left alone

- `POST /food-item/add/{loggedFoodId}` with an id that does not exist calls
  `Optional.get()` on an empty optional. It now answers `500` in the documented
  error shape rather than Spring's default body, but a `404` would be more
  honest. Pre-existing behaviour, left for a round that touches food
  endpoints.
- Round 1 leaves `DELETE /users/delete/{id}` and the rest of the legacy
  surface unauthenticated.
