# Development Guide

How to set up, run and test the Calorie Counter app locally. For what the app does, see [README.md](README.md).

> **Draft.** Items marked **TODO** need a decision or confirmation from the maintainers.

## Repository layout

```
.
├── Backend/      Spring Boot REST API (Java 21, Maven)       → http://localhost:8080
├── Frontend/     React 19 + Vite + Tailwind 4 single-page app → http://localhost:5173
├── Dockerfile    Optional dev container (Java 21 + Node 22 + Maven)
└── README.md
```

Both apps live in this one repository on `master`. The README's instructions to check out the `Finished-Back-End` and `Finished-Front-End` branches are out of date.

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| Java (JDK) | **21** | Required by `Backend/pom.xml` (`<java.version>21</java.version>`) |
| Maven | Optional | Use the bundled wrapper `Backend/mvnw` instead |
| Node.js | **22** recommended | Vite 6 needs Node 18 or later. The dev container uses Node 22. |
| npm | 10+ | Comes with Node |
| PostgreSQL | 14+ recommended | **TODO:** confirm the minimum version that has been tested |

## 1. Database setup

The backend connects using the settings in `Backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/Final_Project_2
spring.datasource.username=postgres
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
```

1. Start PostgreSQL on port `5432`.
2. Create the database. The backend does **not** create it for you:

   ```bash
   createdb -U postgres Final_Project_2
   # or, in psql:
   # CREATE DATABASE "Final_Project_2";
   ```

3. Make sure the `postgres` user's password matches `application.properties`, or change the file to match your setup (see "Overriding settings" below).

You don't need to create tables. `ddl-auto=update` makes Hibernate create and update the `users`, `logged_foods`, `food_item` and `food_item_ingredients` tables when the backend starts.

### Overriding settings without editing the file

Spring Boot reads environment variables in place of matching properties. Use them for local credentials instead of editing and committing `application.properties`:

```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/Final_Project_2
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your-password
```

> Set `SPRING_DATASOURCE_PASSWORD` to your local database password before starting the backend. The password is not included in this repository.

## 2. Run the backend

```bash
cd Backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

The API starts on **http://localhost:8080**. A quick check:

```bash
curl http://localhost:8080/users/all     # should return [] on an empty database
```

### API endpoints

| Resource | Endpoints |
|---|---|
| Users | `POST /users/add`, `GET /users/all`, `GET /users/{id}`, `PUT /users/update/{id}`, `DELETE /users/delete/{id}` |
| Logged foods (one per user per day) | `POST /logged-foods/add`, `GET /logged-foods/all`, `GET /logged-foods/{id}`, `PUT /logged-foods/update/{id}`, `DELETE /logged-foods/{id}` |
| Food items | `POST /food-item/add/{loggedFoodId}`, `GET /food-item/all`, `GET /food-item/{id}`, `PUT /food-item/update/{id}`, `DELETE /food-item/{id}` |

Data model: **Users 1 → N LoggedFoods 1 → N FoodItem**. See the [dbdiagram](https://dbdiagram.io/d/Copy-of-Final-Project-2-68924f78dd90d1786593b7ba).

## 3. Run the frontend

```bash
cd Frontend
npm install       # first time only
npm run dev
```

Open **http://localhost:5173**. The first screen is the login page. Click through to register, because the database starts empty.

| Script | Purpose |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Build for production into `Frontend/dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

Formatting follows `Frontend/.prettierrc`.

### Ports must match

- The frontend calls the backend at a **hardcoded** `http://localhost:8080`. The URL appears in `fetchUtils.js`, `AddFoodModal.jsx`, `auth/LoginPage.jsx` and `auth/Registration.jsx`.
- Every backend controller allows requests (CORS) **only** from `http://localhost:5173`.

If Vite moves to another port (for example because 5173 is in use), the browser will block the API calls with a CORS error. Free port 5173, or run `npm run dev -- --port 5173 --strictPort`.

**TODO:** move the API URL into a Vite environment variable (`VITE_API_URL`), and put the allowed CORS origin in a single backend setting.

## 4. Run the tests

### Backend

```bash
cd Backend
./mvnw test                     # every test
./mvnw test -Dtest=UsersTest    # one test class
```

| Test | Needs PostgreSQL? | What it covers |
|---|---|---|
| `models/UsersTest` | No | Creating a `Users` object through its constructors and setters |
| `FinalProjectApplicationTests.contextLoads` | **Yes** | That the full Spring app starts and connects to the database |

> **Warning:** `contextLoads` connects to the **same** `Final_Project_2` database the app uses, with `ddl-auto=update`, so a test run can change its schema. **TODO:** add a test profile that uses a separate test database, H2 or Testcontainers.

When `contextLoads` can't reach the database, it fails with `PSQLException: Connection to localhost:5432 refused`. Start PostgreSQL, or run only the unit tests with `-Dtest=UsersTest`.

### Frontend

There are no frontend tests and no `test` script yet. **TODO:** add Vitest, starting with the plain helper functions in `foodStorage.js`.

## 5. Using the dev container (optional)

The `Dockerfile` builds an image with Java 21, Node 22, Maven, git and Claude Code. It doesn't include PostgreSQL.

```bash
docker build -t calorie-counter-dev .
docker run -it --rm \
  -v "$PWD":/workspace \
  -p 5173:5173 -p 8080:8080 \
  calorie-counter-dev
```

Container-specific setup:

- **PostgreSQL on the host.** Inside the container, `localhost` is the container itself, so `localhost:5432` is refused. Point the backend at the host instead:

  ```bash
  export SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/Final_Project_2
  ```

  On Linux without Docker Desktop, add `--add-host=host.docker.internal:host-gateway` to `docker run`.
- **Vite inside a container** listens only on the container's own `localhost`, so the browser on the host can't reach it. Run `npm run dev -- --host`.
- **"dubious ownership" errors from git.** The mounted folder is owned by a different user than the container's `node` user. Run:

  ```bash
  git config --global --add safe.directory /workspace
  ```

- **`Operation not permitted` under `Backend/target/`.** On some mounts (for example WSL2 with Docker Desktop), build files show up as owned by `root`, and Maven can't overwrite them on the next run. Delete `Backend/target/` from the host, then build again.
- **`./mvnw: Permission denied`.** The mount may drop the file's executable permission. Run `sh ./mvnw ...` instead.

## 6. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| `Connection to localhost:5432 refused` | PostgreSQL isn't running, or you're in the container and need `host.docker.internal` (see section 5) |
| `FATAL: database "Final_Project_2" does not exist` | Create the database (section 1, step 2) |
| `password authentication failed for user "postgres"` | Credentials don't match. Set `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`. |
| CORS error in the browser console | The frontend isn't on port 5173, or the backend isn't running on 8080 |
| Login always says "Invalid username or password" | No users exist yet. Register first. Login fetches `/users/all` and compares the username and password in the browser. |
| `release version 21 not supported` | Maven is using an older JDK. Set `JAVA_HOME` to JDK 21. |

## Known limitations for developers

- Passwords are stored as **plain text**, and login checks them in the browser against the full user list from `/users/all`. Use dummy credentials only. There is no Spring Security.
- `App.jsx` `handleAddEntry` calls an undefined `setEntries`.
- `Frontend/README.md` is still the stock Vite template README.
