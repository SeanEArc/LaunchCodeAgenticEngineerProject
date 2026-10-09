# 1. Quality Rubric

## 1.1 Dimensions

### 1.1.1 Build Command

Checks whether the agent finds and runs the correct Docker build command.

### 1.1.2 Build Result

Checks whether the agent correctly reports the result of the Docker build.

### 1.1.3 Warnings and Errors

Checks whether the agent reports important warnings and errors from the build.

### 1.1.4 Recommendation

Checks whether the agent gives the correct recommendation based on the build result.

## Scoring Guide

### Build Command

**1 - Does Not Meet:** The agent runs the wrong build command.

Example: The project documents one Docker build command, but the agent guesses and runs a different command.

**2 - Partially Meets:** The agent finds the correct command but runs it incorrectly or from the wrong location.

Example: The agent finds the documented command but runs it from the wrong directory.

**3 - Meets:** The agent runs the correct documented command from the correct location.

Example: The agent finds the build command in the project documentation and runs it correctly.

**4 - Exceeds:** The agent runs the correct command and clearly explains where it found the command.

Example: The agent states that it found the command in the README and then runs it from the correct directory.

### Build Result

**1 - Does Not Meet:** The agent reports the wrong result.

Example: The build fails, but the agent reports that it succeeded.

**2 - Partially Meets:** The agent's result is unclear or incomplete.

Example: The build succeeds, but the agent does not clearly state whether it passed or failed.

**3 - Meets:** The agent correctly reports whether the build succeeded or failed.

Example: The build completes successfully and the agent reports that it succeeded.

**4 - Exceeds:** The agent correctly reports the result and provides evidence from the build output.

Example: The agent reports that the build succeeded and points to the successful completion of the Docker build as evidence.

### Warnings and Errors

**1 - Does Not Meet:** The agent misses important warnings or errors.

Example: The build contains an error, but the agent reports that no errors were found.

**2 - Partially Meets:** The agent reports some issues but misses others.

Example: The agent reports an error but ignores an important warning from the build output.

**3 - Meets:** The agent reports all important warnings and errors.

Example: The agent lists the important warnings and errors shown during the build.

**4 - Exceeds:** The agent reports the issues and explains why they matter.

Example: The agent identifies a warning and explains how it could affect the Docker image or application.

### Recommendation

**1 - Does Not Meet:** The recommendation does not match the build result.

Example: The build fails, but the agent recommends moving forward.

**2 - Partially Meets:** The recommendation is unclear.

Example: The agent reports that the build succeeded but does not clearly say whether the project should move forward.

**3 - Meets:** The recommendation matches the build result.

Example: The build succeeds and the agent recommends moving forward.

**4 - Exceeds:** The recommendation matches the result and explains what should happen next.

Example: The build fails, the agent recommends not moving forward, and explains what issue should be fixed first.

## Pass Threshold

A run passes if:

- The total score is at least 12 out of 16.
- Build Result must score at least 3 out of 4.
- Recommendation must score at least 3 out of 4.
