# Running the Agent Safely

Claude Code runs inside a Docker container, so it can only touch this project folder and not the rest of the host machine.

## Build

```bash
docker build -t calorie-counter-agent .
```

The `Dockerfile` at the repo root starts from `node:22-bookworm-slim`. It copies in JDK 21 from `eclipse-temurin:21-jdk-jammy`, installs `bash`, `ca-certificates`, `curl`, `git` and `maven`, and installs Claude Code globally. Then it switches to the non-root `node` user, with `/workspace` as the working directory.

## Run

```bash
docker run -it --rm \
  --network bridge \
  -v "C:\path\to\Unit-2-Final-Project":/workspace \
  calorie-counter-agent
```

Then start the agent inside the container:

```bash
claude
```

> **TODO:** replace `C:\path\to\Unit-2-Final-Project` with the real path on your host, and the image name with the one you built. The container can't show the host-side path; it only sees the mount at `/workspace`.

| Setting | Value |
|---|---|
| **Mounted path** | Host project folder → `/workspace` (read-write). This is the **only** host folder mounted. |
| **Network mode** | `bridge` (Docker's default). The container has its own IP (`172.17.0.2`) and outbound internet access, which the agent needs for the Claude API, Maven and npm. It reaches services on the host, like PostgreSQL, through `host.docker.internal`. |
| **User** | `node` (uid 1000), not root. No `sudo`. |
| **Docker socket** | Not mounted |
| **Linux capabilities** | None effective (`CapEff: 0000000000000000`) |
| **Lifetime** | `--rm`: the container is deleted when it exits |

## Smoke test

**Prompt given to the agent:** "Summarize the repository structure and write the summary to /workspace/agent-summary.md". It passes if the file appears in the project folder on the host.

**Command:** a shell check that the user, tools, mount, socket isolation and network are as expected. Run it inside the container:

```bash
id
java -version 2>&1 | head -1; node -v; mvn -v | head -1; claude --version
ls /workspace
echo ok > /workspace/.smoke && cat /workspace/.smoke && rm /workspace/.smoke
ls /var/run/docker.sock
hostname -I
timeout 3 bash -c '</dev/tcp/host.docker.internal/5432' && echo "host.docker.internal:5432 open"
```

**Output (2026-10-03):**

```
== whoami ==
uid=1000(node) gid=1000(node) groups=1000(node)
== tools ==
openjdk version "21.0.12.1" 2026-08-18 LTS
v22.23.3
Apache Maven 3.8.7
2.1.288 (Claude Code)
== mount ==
Backend
DEVELOPMENT.md
Dockerfile
Frontend
README.md
agent-summary.md
container-check.txt
== write test ==
ok
== docker socket ==
ls: cannot access '/var/run/docker.sock': No such file or directory
== network ==
172.17.0.2 
== host db reachable ==
host.docker.internal:5432 open
```

All checks passed:
- The agent runs as a non-root user.
- The tools are present.
- The project is mounted and writable.
- The Docker socket is not reachable.
- The container is on the bridge network and can reach the host's database.

Another test confirmed the boundary. When the agent was asked to create a file in `LaunchCodeAgenticEngineer`, a folder that exists on the host but isn't mounted, it couldn't find the folder and didn't create the file.

## Security decisions (provisional)

These answers are for this first setup and will change as the course goes on.

**What can the agent access, and why?**
Only the project folder, mounted at `/workspace`. It can't see the rest of the `C:` drive, other projects, SSH keys or browser data. That limits the damage from a bad command to this one repo, which git can restore.

**What is persisted, and what is ephemeral?**
- **Persisted:** `/workspace`, meaning the source code and everything the agent writes (summaries, docs, tests). The PostgreSQL data also persists, because the database lives on the host, outside the container.
- **Ephemeral:** everything else in the container, which is deleted with `--rm` when the container exits. That includes the installed tools (rebuilt from the `Dockerfile`), Claude Code's login and session history in `~/.claude`, the Maven and npm caches, git config, and temp files.

So the agent can't leave anything hidden behind between runs. The cost is logging in again and re-downloading packages each time.

**Why a non-root user?**
The `node` user has no `sudo` and no effective Linux capabilities. That means the agent can't install system packages, change system files, or easily break out of the container.

**Why no Docker socket?**
Mounting `/var/run/docker.sock` would let the agent start containers that mount any host path, which is effectively root on the host. It's deliberately left out.

**Why bridge networking rather than `none` or `host`?**
- `none` would block the Claude API, Maven and npm, so the agent couldn't work.
- `host` would expose every service on the host's network interfaces to the agent.

Bridge is the middle ground: outbound internet access, plus the host only through `host.docker.internal`. Outbound traffic isn't filtered yet. Locking it down to an allowlist (the Anthropic API, Maven Central, the npm registry) is a later step.

**What secrets are exposed to the agent?**
- Claude Code's own login, kept in the container and deleted with it.
- The database password committed in `Backend/src/main/resources/application.properties`. The agent can read it because it's in the mounted repo. It should move to environment variables (see `DEVELOPMENT.md`).
- No cloud credentials, SSH keys or git push credentials are mounted, so the agent can't push to GitHub.

**What would I tighten next?**
- Restrict outbound traffic to an allowlist.
- Add `--cap-drop=ALL --security-opt no-new-privileges`. `NoNewPrivs` is currently `0`.
- Set resource limits (`--memory`, `--cpus`).
- Move the database password out of the repo.
- Consider a named volume for `~/.claude`, if keeping the login between runs is worth that state persisting.
