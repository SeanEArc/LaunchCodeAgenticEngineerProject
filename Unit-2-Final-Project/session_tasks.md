# Parallel Agent Session Tasks

Round 1 covers registration, login, session restoration, and logout, with minimum compatibility changes for existing features. Do not create, modify, or run automated tests. Use build checks and manual verification; report unverified behavior.

There are no current users. Use a fresh, disposable local development database and newly registered accounts. Existing account migration and backward compatibility for old clients are not required. Do not delete or reset an existing database as part of this assignment.

This is a local development milestone toward eventual cloud hosting. Legacy user, food, and history endpoints still lack complete authentication and ownership enforcement after Round 1. Disabling frontend controls does not restrict direct API access. Keep the application local until those backend restrictions are implemented.

Configure database connection details, allowed frontend origins, frontend API URL, and cookie settings through environment variables with documented local defaults where appropriate. Never commit secrets. Hosting-provider setup and a full frontend/backend rewrite are outside Round 1.

Paths are relative to each repository worktree. Commit this document before creating both worktrees from the same commit. Worktree directories are siblings of LaunchCodeAgenticEngineerProject. Each agent commits only assigned files. Worktrees do not isolate databases or ports.

## Shared API contract

- Use backend sessions with an HttpOnly, SameSite=Lax cookie. Support local HTTP and configurable Secure cookies for deployment. Do not store passwords or session tokens in browser storage.
- GET /auth/csrf: publicly accessible; returns { "token": "...", "headerName": "..." }. Send the returned header on all mutations, including login and registration. Keep the token in memory and retrieve it again after login and logout.
- POST /auth/register: accepts name, username, password, and optional calorieGoal and proteinGoal; returns public user data with 201 without establishing a session. Redirect to login afterward.
- POST /auth/login: accepts username and password; establishes a session and returns public user data with 200. Invalid credentials return 401.
- GET /auth/me: returns public user data with 200, or 401 when unauthenticated.
- Sessions expire after 30 minutes of inactivity. Authentication must persist in the backend session so subsequent requests and browser refreshes recognize the user.
- POST /auth/logout: invalidates the session and returns 204.
- Public user fields: id, name, username, calorieGoal, proteinGoal. Never return passwords or hashes from any endpoint. /auth/me is profile-only.
- Errors use { "message": "..." }. Invalid input returns 400; duplicate usernames return 409; invalid CSRF tokens return 403.
- Trim usernames and keep comparisons case-sensitive for this round. Reject exact duplicates during registration. Database-enforced uniqueness and broader normalization are deferred.
- All frontend API requests include credentials: 'include'. Allow credentialed CORS from the configured frontend origin (locally http://localhost:5173), including the CSRF header.

## Existing-feature requirements

- Keep food logging, history, and profile/goal updates working for newly registered accounts. Reuse current endpoints and nested loggedFoods responses where convenient; old client compatibility is not required. Any necessary contract change must be agreed by both agents and documented in their handoff notes before implementation.
- Existing profile/goal updates ignore incoming passwords, retain the stored hash, and preserve omitted fields.
- Remove or disable POST /users/add and move registration to /auth/register. No alternate registration path may store plaintext passwords. Registration accepts only the documented fields, never client-supplied IDs or nested ownership relationships.
- Temporarily disable password changes and account deletion in the frontend. Their backend replacement is deferred.
- Do not build password migration tooling or support plaintext login. Use a fresh development database; old development accounts are outside this round.
- Backend security configuration must protect /auth/me while preserving legacy feature access for this local milestone. Apply CSRF to mutations without accidentally blocking food flows through framework defaults.

## Integration handoff

Session A hands off its committed backend with the startup command, database setup, environment variables, and final API contract, then runs it from its worktree on localhost:8080 using fitness_round1_dev. Session B runs the frontend from its worktree on localhost:5173 and owns manual UI integration verification. Use the same hostname for browser requests. If sessions run on separate computers, the repository owner combines the commits into an integration branch for local verification. Agents must not independently merge into the shared base branch.

Manually verify:

1. Register a disposable account, log in, and confirm invalid credentials show an error.
2. Refresh a private page and confirm session restoration.
3. Log food, view history, and update profile/goals. Log out and back in to confirm updates persist.
4. Confirm password-change and deletion controls are unavailable.
5. Log out and confirm private pages redirect to login, including after refresh.
6. Confirm backend responses contain no passwords or hashes.
7. Confirm an expired session redirects correctly, a temporarily unavailable backend offers retry, and a mutation without a valid CSRF token is rejected. A temporary local timeout override may be used to check expiration; restore the 30-minute default afterward.

Record failures and unverified behavior. Do not claim cross-user backend protection is complete.

## Deferred work

- Round 2: authenticated food/history endpoints, ownership checks, and user-scoped queries.
- Round 3: dedicated profile/goal, password-change, and deletion endpoints; database-enforced username uniqueness and final normalization policy.
- Later: automated tests, broader frontend/backend rework, and production hosting configuration, HTTPS, database migrations, and deployment hardening. Historical password migration is unnecessary unless requirements change.

## Session A

Branch name:
`feature/backend-auth-round-1`

Worktree directory:
`../fitness-backend-auth`

Task:
Implement authentication/session endpoints, the CSRF endpoint, password hashing, configurable local settings, and the existing-feature requirements. Do not implement food ownership, account migration, or new account-management endpoints.

Files or folders the agent may write to:

- Unit-2-Final-Project/Backend/, excluding src/test/.
- Backend build output and a backend-local setup/handoff note with environment variable names and placeholders, not secrets.

Files or folders the agent may read but not write to:

- Unit-2-Final-Project/Frontend/
- Unit-2-Final-Project/Backend/src/test/
- Shared project documentation and repository instructions.

Commands the agent may run:

- git status, git diff, git log, rg, and file-reading commands.
- From Backend/: .\mvnw.cmd package -Dmaven.test.skip=true
- From Backend/: .\mvnw.cmd spring-boot:run against an isolated development database.
- Manual HTTP requests against the local backend.
- Git staging and commits restricted to assigned files and branch.

Definition of done:

- New registrations store hashed passwords; every response excludes passwords and hashes.
- Registration, login, session restoration, logout, and CSRF match the shared contract. Login safely establishes a session and rotates its identifier.
- Food/history and profile/goal updates remain usable for new accounts; profile/goal updates cannot overwrite hashes. Necessary API changes are coordinated with Session B.
- Document how to provision a fresh database named fitness_round1_dev and supply connection settings through environment variables. No migration tooling or changes to existing databases are included.
- Backend package build passes with tests skipped.
- Manually verify registration, invalid/valid login, /auth/me, logout, and compatibility using disposable development data when available.
- Commit the deliverable and report branch, commit, exact startup command, database setup instructions, required environment variables, final API contract, and verified/unverified behavior.
- Do not create, modify, or run automated tests.

### Results

Merge decision: [Merged / Discarded]
Reason:
Commits on this branch: [Paste the output of git log --oneline main..your-branch-name here]

## Session B

Branch name:
`feature/frontend-auth-round-1`

Worktree directory:
`../fitness-frontend-auth`

Task:
Connect registration/login, restore sessions, protect private routes, and implement logout. Make only the account-form and API-helper changes needed to preserve logging, history, and profile/goal updates. Implement against the contract while Session A works; defer live checks until its backend is available.

Files or folders the agent may write to:

- Unit-2-Final-Project/Frontend/, excluding existing test files.
- Frontend dependency/build output and a frontend-local handoff note.

Files or folders the agent may read but not write to:

- Unit-2-Final-Project/Backend/
- Existing frontend test files.
- Shared project documentation and repository instructions.

Commands the agent may run:

- git status, git diff, git log, rg, and file-reading commands.
- From Frontend/: npm ci, npm run dev, npm run lint, npm run build.
- Browser-based manual verification against Session A's backend when available.
- Git staging and commits restricted to assigned files and branch.

Definition of done:

- Registration calls /auth/register; login calls /auth/login without downloading all users or comparing stored passwords.
- UserContext restores sessions through /auth/me and distinguishes loading, authenticated, unauthenticated, and recoverable errors.
- An expired-session 401 on a private operation clears authentication and redirects to / with a session-expired message. Invalid login credentials remain a login error. Network failures show a retry option without being treated as expiration. Failed saves never show success or automatically replay after login; preserving drafts across login is deferred.
- Private routes wait for restoration and redirect unauthenticated users to /. Refresh does not crash account-dependent components.
- Logout invalidates the backend session, clears user/private state, refreshes the CSRF token, and redirects to /. Failures display useful errors.
- A shared API helper provides a configurable backend URL, credentials, response-status handling, and CSRF headers for all existing mutations, including food operations.
- Logging/history and profile/goal updates work for newly registered accounts. Coordinate and document any necessary endpoint/response changes with Session A.
- Profile/goal forms omit passwords, send only intended fields, and update context from the returned user.
- Password-change and account-deletion controls are disabled with a short explanation that they are temporarily unavailable.
- Record initial lint output. Remove the unused setEntries callback in App.jsx. Fix related lint issues; report unrelated pre-existing errors instead of expanding scope.
- Build passes and lint introduces no new errors.
- Commit the deliverable and report branch, commit, verification results, and integration dependencies.
- Do not add mocks or create, modify, or run automated tests. Do not redesign pages or add fitness features.

### Results

Merge decision: [Merged / Discarded]
Reason:
Commits on this branch: [Paste the output of git log --oneline main..your-branch-name here]

