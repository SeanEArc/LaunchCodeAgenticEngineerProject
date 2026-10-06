# Session A Notes - Backend Auth, Round 1

**Date:** 2026-10-06
**Session:** A (backend)
**Intended branch:** `feature/backend-auth-round-1`
**Worktree:** `../fitness-backend-auth` (mounted at `/workspace` in the container)
**Status:** Code complete and verified. **Not committed** - see "Next steps" below.

Full API contract, environment variables and the verification table live in
`Backend/HANDOFF.md`. This file is the shorter story: what changed, why, and
what is left for you.

---

## 1. What changed, and why

26 files, all under `Backend/`. Nothing in `Backend/src/test/` or `Frontend/`
was touched.

### Authentication and sessions

| Change | Reasoning |
|---|---|
| Added `spring-boot-starter-security` | The project had no auth framework at all. Sessions, CSRF and password hashing all come from here rather than being hand-rolled. |
| New `config/SecurityConfig.java` | One place that owns the filter chain, CORS, CSRF and the password encoder, instead of per-controller annotations. |
| New `controller/AuthController.java` - `/auth/csrf`, `/auth/register`, `/auth/login`, `/auth/me`, `/auth/logout` | The contract both sessions agreed on. Auth is a separate concern from the legacy CRUD controllers, so it lives in its own controller. |
| New `security/DatabaseUserDetailsService.java` | Lets Spring Security authenticate against the existing `users` table. It also refuses any account with a missing hash, so there is no accidental plaintext-login path. |
| Session held in an `HttpOnly`, `SameSite=Lax` cookie | Required by the contract. `HttpOnly` keeps the cookie out of JavaScript, so nothing is ever put in browser storage. `Secure` is configurable and off locally so plain HTTP works. |
| Login rotates the session id **and** the CSRF token | Session fixation protection: an identifier handed out before login must not stay valid afterwards. This is why the frontend has to re-fetch the CSRF token after login. |
| Logout is reachable without a session and always returns 204 | If logout required a live session, a client whose session had already expired would get a 401 while trying to clean up - which the frontend would then misread as "session expired" and loop. A valid CSRF token is still required. |

### Passwords

| Change | Reasoning |
|---|---|
| BCrypt hashing in `service/AuthService.java` | Passwords were previously stored and compared in plain text. |
| `Users.password` marked `@JsonIgnore` | This single annotation blocks **both** directions: the hash can never be serialized into a response, and no incoming request body can ever set it. That is stronger than filtering each endpoint by hand, because a future endpoint cannot forget to filter. |
| Password capped at 72 characters | BCrypt silently ignores bytes past 72. Rejecting is honest; silently truncating would mean a user's "long" password is not what they think it is. |
| Minimum length 6 | Matches the frontend's existing rule, so the two layers cannot disagree and produce a confusing rejection. |

### Registration

| Change | Reasoning |
|---|---|
| **Removed `POST /users/add`** | It saved whatever the client sent, including a plaintext password, with no validation. Registration is now `POST /auth/register`. Requesting the old path returns 405. |
| Registration takes a narrow DTO (`RegisterRequest`) | Only `name`, `username`, `password`, `calorieGoal`, `proteinGoal` are read. A client cannot supply an `id` or nested `loggedFoods` to hijack ownership - verified by sending `id: 999` and getting `id: 1` back. |
| Registration does **not** log you in | Per the contract: it returns 201 and the frontend redirects to login. |
| Usernames trimmed, compared case-sensitively | Per the contract for this round. A database uniqueness constraint and a final normalization policy are deferred to Round 3, so today's check is application-level only. |

### Keeping the existing features working

| Change | Reasoning |
|---|---|
| `GET /users/{id}` still returns the full entity with nested `loggedFoods` | The dashboard and calorie history read `getUser.loggedFoods[i].loggedFoodItems`. Switching this to a flat DTO would have broken both pages. The password is excluded by the `@JsonIgnore` above rather than by reshaping the response. |
| `GET /users/all` now returns public fields only | This endpoint used to be how login worked - the browser downloaded every user and compared passwords locally. It must never expose passwords again. |
| `PUT /users/update/{id}` takes a DTO with **no** password field | Makes it structurally impossible for a profile or goal save to overwrite the stored hash. Verified: sending `password: "HIJACK"` is ignored and the original password still logs in. |
| Omitted fields on update are preserved | The old code overwrote every field with whatever was sent, so a partial save wiped the rest. Now `null` means "not supplied". |
| Removed `@CrossOrigin` from the three controllers | They did not allow credentials, which the session cookie needs. CORS is now configured once, for the origin in `APP_CORS_ALLOWED_ORIGINS`. |
| CSRF applies to food and profile mutations too | Session B is sending the header on all mutations, so this is consistent rather than carving out exceptions. |

### Configuration and errors

| Change | Reasoning |
|---|---|
| Database, CORS, session timeout and cookie settings moved to environment variables with documented defaults | Asked for by the round, and it keeps the local Postgres password out of the repo. |
| `SPRING_DATASOURCE_PASSWORD` has **no** default | The app fails fast rather than quietly starting with a guessable password. |
| Default database is now `fitness_round1_dev` | A fresh, disposable database for this round. No existing database is touched and no migration tooling was written. |
| Added `Backend/.env.example`, and `.env` to `.gitignore` | Placeholders are committed; real values are not. |
| `exception/RestExceptionHandler.java` plus JSON handlers in the filter chain | The contract says every error is `{"message": "..."}`. CSRF rejections and access denials happen inside the filter chain, where `@RestControllerAdvice` does not apply, so those needed separate handlers to avoid returning Spring's default error body. |

---

## 2. Environment problems I hit

Worth knowing, because they will affect you or the next session.

1. **Git does not work in this container.** `/workspace/.git` is a worktree
   pointer to a Windows path
   (`C:/Users/.../LaunchCodeAgenticEngineerProject/.git/worktrees/fitness-backend-auth`)
   that is not mounted, so every git command fails with
   `fatal: not a git repository`. **This is why nothing is committed.**
2. **No JDK and no Maven were installed**, despite `setup.md` describing a
   container with Java 21 and Maven. I installed Temurin JDK 21 into
   `/opt/jdk` to build and run. That install is ephemeral and disappears with
   the container; it is not part of the deliverable.
3. **No PostgreSQL credentials.** Port 5432 was reachable on the host. I tried
   two obvious local defaults, both were rejected, and I stopped rather than
   keep guessing at your database.

---

## 3. What was verified, and what was not

**Verified:** the package build passes with tests skipped, and 30 manual HTTP
checks pass against the exact built jar - CSRF enforcement, registration
validation and duplicates, login success and failure, session id and CSRF
rotation on login, session restoration via `/auth/me`, 30-minute expiry
behaviour (checked with a temporary 1-minute override, default restored),
logout, food logging and history, profile updates preserving the hash, CORS
allow and deny, and no password or hash in any response. The table is in
`Backend/HANDOFF.md`.

**Not verified - please confirm:**

- **The backend has never run against PostgreSQL.** Verification used an
  in-memory H2 database because no credentials were available. The H2
  dependency was temporary and is **not** in the committed `pom.xml` (confirmed
  absent from the final jar). Everything I checked is database-independent, but
  **Hibernate's schema generation against `fitness_round1_dev` is unverified**
  and is the first thing to confirm.
- No browser or UI integration - that is Session B's.
- No automated tests were created, modified or run, as the round required.

**Not claimed:** cross-user backend protection is **not** complete.
`/users`, `/logged-foods` and `/food-item` are still unauthenticated with no
ownership checks. Anyone who can reach port 8080 can read or modify any
account's data regardless of what the UI shows. Keep this local until Round 2.

---

## 4. Next steps on your end

**1. Commit the work (it is only on disk right now).** On Windows, in the
`../fitness-backend-auth` worktree:

```bash
git status                                   # expect ~26 changed/new files under Backend/
git add Backend/
git commit -m "Add session auth, CSRF and password hashing (Round 1 backend)"
git log --oneline main..feature/backend-auth-round-1
```

Paste that `git log` output into the **Session A -> Results** section of
`session_tasks.md`.

> Note: this file (`session_a_notes.md`) sits at the repo root, outside Session
> A's assigned `Backend/` scope. Commit it separately, or not at all, so the
> backend branch stays limited to its assigned files.

**2. Create the database and start the backend.**

```bash
createdb -U postgres fitness_round1_dev

cd Backend
set SPRING_DATASOURCE_PASSWORD=your-local-postgres-password
.\mvnw.cmd spring-boot:run
```

Watch the startup log for Hibernate creating the `users`, `logged_foods`,
`food_item` and `food_item_ingredients` tables. **This is the unverified
step** - if the schema fails to generate, that is the one thing my H2 run could
not have caught.

Smoke test once it is up:

```bash
curl -i http://localhost:8080/auth/csrf      # expect 200 and a JSESSIONID cookie
```

**3. Hand `Backend/HANDOFF.md` to Session B.** Two changes need their
attention:

- `PUT /users/update/{id}` now returns a public user object (no `loggedFoods`)
  and accepts no `password` field.
- `GET /users/all` no longer returns passwords, so the old browser-side login
  cannot work - it must call `POST /auth/login`.

**4. Run the integration checks** from `session_tasks.md` once Session B's
frontend is up on `localhost:5173`. Use the **same hostname** in the browser as
the configured origin - `localhost` and `127.0.0.1` are different origins and
mixing them breaks both CORS and the cookie.

**5. Update `DEVELOPMENT.md`.** It is now stale: it documents plaintext
passwords, `POST /users/add`, browser-side login and the `Final_Project_2`
database. It is shared documentation outside Session A's write scope, so I left
it alone deliberately.

**6. Keep the app local** until Round 2 adds authentication and ownership
checks to the legacy endpoints.
