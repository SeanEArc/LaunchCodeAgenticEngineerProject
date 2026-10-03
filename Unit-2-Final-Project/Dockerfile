# Get Java 21, which Backend/pom.xml requires
FROM eclipse-temurin:21-jdk-jammy AS java

# Provide Node.js and npm for the React frontend
FROM node:22-bookworm-slim

# Copy Java into the final image
COPY --from=java /opt/java/openjdk /opt/java/openjdk

# Make Java available to Maven and the terminal
ENV JAVA_HOME=/opt/java/openjdk
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Install tools needed to inspect and build the project
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    ca-certificates \
    curl \
    git \
    maven \
    && rm -rf /var/lib/apt/lists/*

# Install the coding agent
RUN npm install -g @anthropic-ai/claude-code

# Prepare the project mount location
RUN mkdir -p /workspace && chown node:node /workspace

# Use the non-root account included in the Node image
USER node

# Start inside the mounted project folder
WORKDIR /workspace

# Open an interactive Bash shell when the container starts
CMD ["/bin/bash"]