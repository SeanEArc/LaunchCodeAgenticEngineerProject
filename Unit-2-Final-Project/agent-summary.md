# Repository Summary

A full-stack **calorie tracker** web app. It has a React (Vite + Tailwind) frontend and a Spring Boot (Java 21) backend backed by PostgreSQL. Users register or log in, log food items (calories, protein, carbs, fat) against a date, and view their calorie history.

68 files in total (excluding `.git`).

## Top level

| Path | Purpose |
|---|---|
| `README.md` | Project overview, tech stack, setup steps, links to the DB diagram and wireframes, and a list of planned features |
| `Dockerfile` | Dev container: Node 22 plus Temurin JDK 21, Maven and git, with Claude Code installed; runs as `node` in `/workspace` |
| `container-check.txt` | One-line marker file ("Created inside the container.") |
| `Backend/` | Spring Boot REST API |
| `Frontend/` | React single-page app |

## Backend (`Backend/`)

- **Build:** Maven (`pom.xml`, `mvnw`/`mvnw.cmd`, `.mvn/wrapper/`). Spring Boot parent 3.5.3, Java 21. Dependencies: `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `postgresql` 42.7.3 and `spring-boot-starter-test`.
- **Config:** `src/main/resources/application.properties` points to `jdbc:postgresql://localhost:5432/Final_Project_2` and sets `ddl-auto=update` and `show-sql=true`. The file contains a committed username and password.
- **Package:** `com.example.Final_Project.Final_Project` (under `src/main/java/...`)
  - `FinalProjectApplication.java`: the Spring Boot entry point.
  - `models/`: JPA entities
    - `Users`: id, name, username, password, calorieGoal, proteinGoal; one-to-many `loggedFoods`
    - `LoggedFoods`: id, date (`LocalDate`); many-to-one `user`; one-to-many `loggedFoodItems`
    - `FoodItem`: id, foodName, calories, protein, carbs, fat, ingredients (`List<String>`); many-to-one `loggedFoods`
    - Relationship chain: **Users 1→N LoggedFoods 1→N FoodItem** (cascade all, orphan removal)
  - `repositories/`: one plain `JpaRepository<Entity, Integer>` per entity, with no custom queries.
  - `controller/`: REST controllers, all with `@CrossOrigin("http://localhost:5173")`

    | Controller | Base path | Endpoints |
    |---|---|---|
    | `UserController` | `/users` | `POST /add`, `GET /all`, `GET /{id}`, `PUT /update/{id}`, `DELETE /delete/{id}` |
    | `LoggedFoodsController` | `/logged-foods` | `GET /all`, `GET /{id}`, `POST /add`, `PUT /update/{id}`, `DELETE /{id}` |
    | `FoodItemController` | `/food-item` | `GET /all`, `GET /{id}`, `POST /add/{loggedFoodId}`, `PUT update/{id}`, `DELETE /{id}` |
- **Tests:** `src/test/.../FinalProjectApplicationTests.java`, the default context-load test only.

## Frontend (`Frontend/`)

- **Tooling:** Vite 6 with `@vitejs/plugin-react` and `@tailwindcss/vite` (Tailwind 4), React 19, `react-router-dom` 7, ESLint 9 (`eslint.config.js`) and Prettier (`.prettierrc`). Scripts: `dev`, `build`, `lint`, `preview`. `Frontend/README.md` is the stock Vite template README.
- **Entry:** `index.html` loads `src/main.jsx`, which wraps the app in `UserProvider` and `BrowserRouter` and renders `App.jsx`.
- **Routing (`App.jsx`):** `TopOfPage` header (with quick log), the routes below, then `Footer`.

  | Route | Component |
  |---|---|
  | `/` | `auth/LoginPage` |
  | `/register` | `auth/Registration` |
  | `/dashboard` | `Dashboard` |
  | `/calorieHistory` | `CalorieHistory` |
  | `/howItWorks` | `HowItWorks` |
  | `/about` | `AboutPage` |
  | `/accountDetails` | `AccountDetails` |

- **`src/components/`**
  - Pages and UI: `Dashboard`, `CalorieHistory`, `AccountDetails`, `HowItWorks`, `AboutPage`, `TopOfPage`, `Footer`, `AddFoodModal`, `EditingForm`, `ConfirmationModal`, plus their CSS files (`DashboardStyling.css`, `CalorieHistoryStyling.css`, `TopOfPageStyling.css`).
  - `auth/`: `LoginPage.jsx` and `Registration.jsx`.
  - State: `UserContext.jsx` is a React context holding `user`, `isLoggedIn` and a `refreshKey` / `triggerRefreshKey` used to force refetches.
  - Helpers:
    - `fetchUtils.js`: fetch wrappers that call the backend at `http://localhost:8080`.
    - `AddFoodUtil.js`: food-adding helpers.
    - `foodStorage.js`: number formatting, summing macros across items, and today's date string.
- **`src/assets/`**: logo, `foodIcons/` (macro icons plus an index `foodIcons.js`), `HowItWorksImages/` (tutorial screenshots) and `StockPhotos/`.
- About 1,800 lines of JSX in total. The largest files are `CalorieHistory` (290 lines), `HowItWorks` (275) and `AccountDetails` (237).

## How it runs

1. Start PostgreSQL with a database named `Final_Project_2`. Adjust `application.properties` if your setup differs.
2. Run the backend with `./mvnw spring-boot:run` from `Backend/`. It serves on port 8080.
3. Run the frontend with `npm install && npm run dev` from `Frontend/`. It serves on port 5173, the only origin the backend's CORS setting allows.

## Test results (run 2026-10-03)

The repo's only test command is the backend's Maven test run. `Frontend/package.json` has no `test` script (only `dev`, `build`, `lint` and `preview`) and contains no test files.

**Command:** `cd Backend && sh ./mvnw -B test`. It runs through `sh` because `mvnw` sits on a mount where its executable bit isn't honored.

**Result: BUILD FAILURE.** 1 test ran: 0 failures, 1 error, 0 skipped. It took about 33 seconds.

| Test | Outcome |
|---|---|
| `FinalProjectApplicationTests.contextLoads` | **Error.** `IllegalStateException: Failed to load ApplicationContext` |

- **Root cause:** `PSQLException: Connection to localhost:5432 refused`. The test is a full `@SpringBootTest`, so Hibernate tries to reach PostgreSQL at startup. No database is running in this container, and no Postgres binaries are installed.
- **What still worked:** the main and test sources both compiled (`target/classes` and `target/test-classes` were produced). The failure comes from the environment, not from a compile or logic error.
- **Reports:** `Backend/target/surefire-reports/`
- **To make it pass:**
  - Run a PostgreSQL instance that matches `application.properties` (DB `Final_Project_2`, user `postgres`), or
  - add a test profile that uses an in-memory database (for example H2) or Testcontainers, so the test doesn't depend on a local database.

### Re-run with PostgreSQL running (2026-10-03)

**Result: BUILD SUCCESS.** 1 test ran: 0 failures, 0 errors, 0 skipped. `contextLoads` passed in about 3 seconds, and the whole build took about 5 seconds.

Two environment issues had to be worked around first:

1. **Database host.** Postgres runs on the Docker host, not inside the container. `localhost:5432` was still refused from inside the container, but `host.docker.internal:5432` was reachable. The URL was overridden for this run only with `SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/Final_Project_2`. `application.properties` was not changed. The username and password in that file worked.
2. **Unwritable `target/`.** Re-running in `Backend/` failed during the resources step with `FileSystemException: .../target/classes/application.properties: Operation not permitted`. The files the first run created in `target/` appear as `root`-owned on the mount, and the `node` user can't overwrite them. To get around this, the tests ran on a copy of `Backend/` (without `target/`) in the session scratchpad. Deleting `Backend/target/` from the host would fix in-place runs.

The test only checks that the Spring context starts and connects to the database. No controller, repository or other behavior is tested.

## New low-risk unit test: `UsersTest` (added 2026-10-03)

**File:** `Backend/src/test/java/com/example/Final_Project/Final_Project/models/UsersTest.java`

This is a plain JUnit 5 test of creating a `Users` object. It doesn't start Spring, doesn't touch the database, adds no dependencies and changes no app code.

| Test | What it checks |
|---|---|
| `createUserWithAllFields` | The 6-argument constructor sets id, name, username, password, calorie goal and protein goal |
| `createUserWithoutGoalsLeavesGoalsNull` | The 4-argument constructor leaves `calorieGoal` and `proteinGoal` as `null` |
| `createUserWithSetters` | A user built with the no-argument constructor plus setters returns those values from its getters. This is how Jackson builds a user from the JSON body of `POST /users/add`. |

**Run:** `sh ./mvnw -B test -Dtest=UsersTest`, on a scratchpad copy of `Backend/` because `target/` isn't writable.

**Result: BUILD SUCCESS.** 3 tests ran: 0 failures, 0 errors, 0 skipped. The tests took 0.026 seconds and the whole build about 2 seconds.

**Scope:** this checks the `Users` model only. It doesn't save a user through `UserController` or the database. Option 2 (a `@WebMvcTest` with a fake repository) would cover the `POST /users/add` endpoint itself.

## Setup documentation (added 2026-10-03)

A draft `DEVELOPMENT.md` at the repo root fills these gaps in the README:

- The README says to check out the `Finished-Back-End` and `Finished-Front-End` branches, but both apps now live on `master`.
- It gives no Java, Node or Postgres versions.
- It never says to create the `Final_Project_2` database.
- It has no `npm install` step and no command for starting the backend.
- It doesn't mention the hardcoded `localhost:8080` URL or the CORS rule that only allows port 5173.
- It has no test instructions, and doesn't warn that `contextLoads` uses the real database.
- It has no dev container instructions (`host.docker.internal`, `git safe.directory`, the unwritable `target/`, `mvnw` permissions, `vite --host`).
- It has no troubleshooting section.

Open questions are marked **TODO** in that file.

## Lint results (check-only, 2026-10-03)

**Command:** `npx eslint .` in `Frontend/`, the same as `npm run lint`. It ran without `--fix`, so it only reported problems and changed no files. Dependencies were installed with `npm ci` in a scratchpad copy of `Frontend/`, so no `node_modules` was written into the repo. The backend has no linter configured.

**Result: 17 problems (15 errors, 2 warnings).** ESLint exited with code 1.

### Real bugs (2)

| Location | Rule | Problem |
|---|---|---|
| `src/components/AccountDetails.jsx:85` | `no-undef` | `navigate` is never defined (no `useNavigate`). After `deleteUser()` succeeds, `navigate('/login')` throws. The `catch` block then shows "Failed to delete account" even though the account was deleted. `/login` isn't a route either; the login page is `/`. |
| `src/App.jsx:16` | `no-undef` | `setEntries` is not defined in `handleAddEntry`, the quick log handler passed to `TopOfPage` |

### Cleanup (13 errors, 2 warnings)

| File | Line(s) | Rule | Problem |
|---|---|---|---|
| `AccountDetails.jsx` | 1 | `no-unused-vars` | `useEffect` is imported but never used |
| `AccountDetails.jsx` | 20, 36, 61 | `no-unused-vars` | `updatedUser` is assigned but never used |
| `AccountDetails.jsx` | 27, 42, 69, 86 | `no-unused-vars` | The caught `error` is never used |
| `AddFoodModal.jsx` | 32 | `no-unused-vars` | `newItemLogged` is assigned but never used |
| `AddFoodModal.jsx` | 60 | `no-unused-vars` | `newLoggedDate` is assigned but never used |
| `CalorieHistory.jsx` | 154 | `no-unused-vars` | The `index` argument is never used |
| `auth/LoginPage.jsx` | 15 | `no-unused-vars` | `user` from the context is never used |
| `auth/Registration.jsx` | 46 | `no-unused-vars` | `postingUserData` is assigned but never used |
| `CalorieHistory.jsx` | 71 | `react-hooks/exhaustive-deps` (warning) | The `useEffect` dependency list is missing `displayAllUserFoodItems` |
| `UserContext.jsx` | 3 | `react-refresh/only-export-components` (warning) | The file exports both the context and the provider component, which breaks Vite's hot reload for that file |

**Not run:** a Prettier format check. `.prettierrc` exists, but Prettier isn't a project dependency.

## Issues noticed while reading

- `App.jsx` `handleAddEntry` calls `setEntries`, but `setEntries` is never defined. The quick log would throw an error if this handler were called. ESLint confirms it (see Lint results).
- `AccountDetails.jsx` uses `navigate` without defining it. As a result, deleting an account shows an error message even though the deletion succeeded (found by ESLint).
- Passwords are stored and sent as plain text, and there is no auth or security layer (no Spring Security).
- The database credentials are committed in `application.properties`.
- The backend URL `http://localhost:8080` is hardcoded in the frontend instead of coming from an environment variable or Vite proxy.
- Testing is minimal: the backend has only the default test, and the frontend has none.
- `git` commands fail inside the container with a "dubious ownership" error for `/workspace`. Fix it with `git config --global --add safe.directory /workspace`.
