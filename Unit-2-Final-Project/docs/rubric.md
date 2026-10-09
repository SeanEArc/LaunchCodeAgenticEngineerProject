# 1. Quality Rubric

This rubric evaluates the agent's human-readability review. A review can pass when it accurately identifies difficult-to-read code; the codebase's readability is assessed separately.

## 1.1 Dimensions

### 1.1.1 Review Coverage

Checks whether the agent inspects relevant frontend and backend code and states its scope and limitations.

### 1.1.2 Readability Assessment

Checks whether the agent evaluates naming, structure and control flow, organization and consistency, and comments and documentation using project conventions.

### 1.1.3 Evidence and Explanation

Checks whether findings accurately reference code and explain its effect on human understanding.

### 1.1.4 Recommendations and Report Clarity

Checks whether the agent provides prioritized, actionable improvements and a clear overall assessment supported by findings.

## Scoring Guide

Score each dimension from 1 to 4 using the descriptions below.

### Review Coverage

**1 - Does Not Meet:** The agent does not inspect source code or claims coverage it did not perform.

Example: The agent declares the code readable based only on a successful Docker build.

**2 - Partially Meets:** The agent inspects a narrow area and leaves significant omissions unexplained.

Example: The agent reviews one React component without addressing the backend or stating the limitation.

**3 - Meets:** The agent reviews frontend and backend code, supporting tests and configuration, and documentation. It identifies inspected areas, coverage limitations, and any inaccessible areas.

Example: The report lists inspected components, API helpers, controllers, and services and states which areas were not reviewed.

**4 - Exceeds:** The agent also traces representative user flows across related files and explains why its coverage supports the assessment.

Example: The agent follows login from the form through the API client to the backend controller and service.

### Readability Assessment

**1 - Does Not Meet:** The assessment is unsupported or equates readability with compilation, lint results, or personal taste.

Example: The agent says the code is readable because it builds successfully.

**2 - Partially Meets:** The agent evaluates some concerns but misses major dimensions or treats preferences as requirements.

Example: The report discusses formatting but ignores confusing names and deeply nested logic.

**3 - Meets:** The agent evaluates naming, structure and control flow, organization and consistency, and comments and documentation. It distinguishes obstacles to understanding from optional preferences.

Example: The report explains whether names communicate intent, responsibilities are focused, patterns are consistent, and comments clarify non-obvious behavior.

**4 - Exceeds:** The agent also explains tradeoffs in the project's context and identifies readable patterns worth preserving when present.

Example: The report explains how a focused helper clarifies a component while identifying an abstraction that makes a simple operation harder to trace.

### Evidence and Explanation

**1 - Does Not Meet:** Findings are invented, contradict the code, or lack supporting references.

Example: The agent claims a function contains nested conditionals that are not present.

**2 - Partially Meets:** Some findings are accurate, but references or explanations are incomplete.

Example: The agent calls a component confusing without identifying the relevant code or explaining why.

**3 - Meets:** Findings include accurate file paths and line references and explain the effect on understanding. Conclusions stay within the inspected scope.

Example: The report references a vague variable name and explains what meaning a reader must infer from its usage.

**4 - Exceeds:** The evidence also connects related code where necessary and makes findings easy to verify without overstating certainty.

Example: The report references a caller and helper to show how inconsistent naming obscures the same concept across files.

### Recommendations and Report Clarity

**1 - Does Not Meet:** Recommendations are missing, contradict findings, or require unnecessary behavior changes.

Example: The agent recommends replacing the application framework without tying that change to a readability issue.

**2 - Partially Meets:** Recommendations are vague, unprioritized, or the overall assessment is unclear.

Example: The agent says to "clean up the code" without identifying a concrete next step.

**3 - Meets:** The report uses plain language, prioritizes issues by high, medium, or low impact, and recommends specific improvements intended to preserve behavior. The overall assessment matches the evidence, including when no significant issues are found.

Example: The agent recommends renaming an ambiguous helper and extracting a focused operation, explains their priority, and states any uncertainty about preserving behavior.

**4 - Exceeds:** The report also explains expected readability benefits and a practical order for addressing related findings.

Example: The agent recommends clarifying shared terminology first, then simplifying dependent functions to use that vocabulary consistently.

## Pass Threshold

A run passes if:

- The total score is at least 12 out of 16.
- Every dimension scores at least 3 out of 4.

Report each dimension's score with a brief justification and the total. The threshold measures review quality; report the codebase's overall readability assessment separately.
