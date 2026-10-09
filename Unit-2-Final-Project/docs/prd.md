# PRD (Product Requirements Document)

The agent will review the codebase for human readability and report how easily a developer can understand, navigate, and maintain it.

## Trigger

The workflow starts when the agent is asked to review the codebase for human readability.

## Review Scope

- Review frontend and backend source code, tests, configuration, and supporting documentation.
- Exclude dependencies, generated files, build output, and binary assets.
- Identify sampled files and areas not reviewed. Do not claim full coverage from a sample.
- Review without changing code unless changes are separately requested. A successful build or lint check alone does not establish readability.

## Decision Events

The agent needs to determine:

- Whether variable, function, component, class, and file names communicate their purpose.
- Whether functions and components have focused responsibilities and control flow is easy to follow.
- Whether organization, formatting, and patterns are consistent and help readers find related code.
- Whether comments and documentation accurately explain non-obvious intent and assumptions.
- Which issues most obstruct understanding and what improvements would help.

## Actions

1. Read project documentation and identify the codebase structure and existing conventions.
2. Inspect frontend and backend code, including representative user flows and supporting tests and configuration.
3. Evaluate naming, responsibilities, nesting, duplication, unexplained values, organization, and formatting.
4. Check whether comments and documentation clarify non-obvious decisions without merely repeating code.
5. Record strengths and issues with file paths and line references. Explain their effect on understanding.
6. Prioritize issues as high, medium, or low impact based on how much they obstruct understanding. Separate observed problems from optional style preferences.
7. Recommend concrete improvements intended to preserve behavior and provide an overall readability assessment.

## Acceptance Criteria

The workflow is successful if:

- The report states the scope, inspected files or areas, and coverage limitations.
- Both frontend and backend are reviewed, or inaccessible areas are explicitly identified.
- The assessment covers naming, structure and control flow, organization and consistency, and comments and documentation.
- Findings include accurate file and line references and explain their effect on readability.
- The report identifies readable patterns worth keeping as well as issues, when supported by the code.
- Recommendations are specific, prioritized, and intended to preserve behavior. Any uncertainty about behavior is stated.
- The overall assessment matches the evidence. If no significant issues are found, the report says so without inventing findings.
- The report uses plain language a developer unfamiliar with the project can follow.
