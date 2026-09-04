# African Tourism Research Platform — Version 1 Implementation Prompt

## Instructions for AI Coding Agent

You are implementing **Version 1 of the African Tourism Research & Intelligence Platform**.

Before writing or modifying any code, you MUST read and understand:

1. `docs/AGENT-STANDARDS.md`
2. The repository's existing architecture and conventions.
3. `docs/AFRICAN-TOURISM-MASTER-PROJECT-CONCEPT.md` (or the equivalent master project concept document).
4. Existing package configuration and dependencies.
5. Existing database and environment configuration.

If there is any conflict between this implementation prompt and `AGENT-STANDARDS.md`, follow `AGENT-STANDARDS.md` for repository engineering standards, while treating this document as the source of truth for product scope and implementation requirements.

---

# 1. Your Role

You are acting as a senior software engineer responsible for implementing Version 1 of this product.

Your responsibility is NOT merely to generate code quickly.

You must:

* Understand the product problem.
* Inspect the existing repository before making assumptions.
* Design clean boundaries.
* Preserve extensibility without overengineering.
* Implement incrementally.
* Test rigorously.
* Respect strict scope boundaries.
* Identify architectural risks.
* Avoid unnecessary abstractions.
* Leave the repository in a stable state after every stage.

You must think like an engineer building a real product, not a prototype generator.

---

# 2. Critical Product Context

The product is called:

> **African Tourism Research & Intelligence Platform**

Version 1 is a focused research data collection and analytics platform supporting a specific African Tourism research initiative connected to understanding and supporting tourism development opportunities in South Western Nigeria.

This is NOT currently:

* A generic SurveyMonkey clone.
* A multi-tenant SaaS product.
* A public survey-builder platform.
* A platform where external organizations create accounts.
* A full tourism management system.
* An AI intelligence system.
* A geographic intelligence platform.

Those may become future versions.

They are NOT Version 1.

---

# 3. Long-Term Vision vs Current Scope

You MUST understand this distinction.

## Long-Term Vision

The product may eventually evolve into:

```text
Tourism Research
        ↓
Multiple Research Studies
        ↓
Research Intelligence
        ↓
Geographic Intelligence
        ↓
AI-Assisted Insights
        ↓
Tourism Development Intelligence
```

However:

> **Only Version 1 is authorized for implementation now.**

Future versions should influence architectural decisions where appropriate.

They must NOT cause speculative features to be implemented.

---

# 4. Version 1 Mission

Build a professional, production-quality research platform that enables:

```text
ADVERTISEMENT / CAMPAIGN
          ↓
PUBLIC RESEARCH WEBSITE
          ↓
PUBLIC SURVEY
          ↓
AUTOMATIC RESPONSE COLLECTION
          ↓
SECURE DATABASE
          ↓
PRIVATE ADMINISTRATION
          ↓
DATA TABLES + ANALYTICS
          ↓
RESEARCH INSIGHTS
```

The system must replace a manual workflow involving:

```text
Manual Forms
     ↓
Manual CSV / Excel Collection
     ↓
Manual Data Processing
     ↓
Manual Visualization
```

with a digital workflow.

---

# 5. Core Version 1 Product Requirements

The Version 1 implementation must provide the following major capabilities.

## Public Platform

* Professional African Tourism branded landing experience.
* Research/project introduction.
* Clear explanation of the research purpose.
* Public survey discovery where applicable.
* Direct survey access.
* Customer-care/inquiry channel.
* Stakeholder/partnership interest channel.

## Survey Experience

* Dedicated public survey URL.
* Stable survey slug.
* Professional custom survey interface.
* Mobile-first design.
* Multi-step survey experience where appropriate.
* Progress indication.
* Required-field validation.
* Previous/Next navigation.
* Final submission.
* Professional completion experience.

## Survey Administration

Authorized administrators must be able to:

* Access a protected dashboard.
* View surveys.
* Create surveys if included in the current Version 1 workflow.
* Edit survey details.
* Manage questions.
* Publish surveys.
* Hide surveys.
* Close surveys.
* Inspect survey responses.
* Access survey analytics.
* Share survey links.

## Survey Sharing

Every published survey must have:

* A stable public URL.
* Copy-link functionality.
* Open-survey functionality.

Example:

```text
https://example.com/survey/african-tourism-research
```

Administrators should see:

```text
Public Survey Link

https://example.com/survey/african-tourism-research

[ Copy Link ]    [ Open Survey ]
```

## Response Management

* Automatic response storage.
* Secure persistence.
* Paginated response tables.
* Sorting.
* Filtering.
* Individual response inspection.

## Analytics

* Total responses.
* Response trends.
* Bar charts where appropriate.
* Pie/donut charts where appropriate.
* Question distribution.
* Useful research metrics.
* Server/database aggregation where practical.

## Customer Care

Public visitors should be able to:

* Report issues.
* Ask questions.
* Make inquiries.

Requests must be persisted reliably.

## Stakeholder Interest

Relevant organizations or stakeholders should be able to submit partnership or programme interest.

---

# 6. Explicit Version 1 Non-Goals

Do NOT implement the following unless explicitly instructed later.

```text
❌ Multi-tenancy
❌ Organization workspaces
❌ Public user accounts
❌ Public survey-builder accounts
❌ Subscription billing
❌ Payment processing
❌ AI analytics
❌ LLM integration
❌ Geographic intelligence
❌ Interactive maps
❌ GIS infrastructure
❌ Microservices
❌ Event streaming
❌ Data warehouse
❌ Complex enterprise RBAC
❌ Native mobile applications
❌ Automated report generation
❌ Tourism programme management
❌ Complex collaboration workflows
```

Do not implement speculative infrastructure for these features.

---

# 7. Architecture Requirements

Use a **modular monolith** approach.

The architecture should conceptually separate:

```text
Application
│
├── Public Platform
│
├── Authentication
│
├── Administration
│
├── Surveys
│
├── Responses
│
├── Analytics
│
├── Customer Care
│
└── Stakeholder Requests
```

Do not create artificial abstractions without a concrete need.

Prefer:

> Simple, explicit, maintainable code.

over:

> Clever, highly abstract, speculative architecture.

---

# 8. Technology Decisions

Before introducing dependencies, inspect the existing repository.

Respect existing project choices unless there is a strong technical reason not to.

The intended stack is generally:

* Next.js
* TypeScript
* App Router
* Tailwind CSS
* PostgreSQL
* Supabase
* Zod
* Appropriate charting library

However:

> Do not blindly install packages.

First inspect what the repository already contains.

Do not duplicate functionality with unnecessary dependencies.

---

# 9. Database Architecture Requirements

The Version 1 database must support a flexible survey structure.

Do NOT hardcode the African Tourism questionnaire directly into database columns.

The questionnaire should be represented as data.

The core conceptual model is:

```text
SURVEY
   │
   ├── SECTIONS
   │
   └── QUESTIONS
          │
          └── OPTIONS


SURVEY
   │
   └── RESPONSES
          │
          └── ANSWERS
```

Recommended entities include:

```text
profiles
surveys
survey_sections
questions
question_options
survey_responses
response_answers
customer_care_requests
stakeholder_requests
```

The exact schema should be refined according to actual implementation needs.

Do not blindly copy this structure if repository conventions require reasonable adjustments.

---

# 10. Survey Status Requirements

Surveys should conceptually support:

```text
DRAFT
   ↓
PUBLISHED
   ├────→ HIDDEN
   ↓
CLOSED
   ↓
ARCHIVED
```

Recommended behavior:

## DRAFT

* Not publicly accessible.

## PUBLISHED

* Publicly accessible.
* Accepting responses.

## HIDDEN

* Removed from public survey listings.
* May remain directly accessible through its shareable URL if still open.

## CLOSED

* No new responses.
* Existing responses remain available internally.
* Public visitors receive a professional closed-survey message.

## ARCHIVED

* Historical/internal state.

Do not expose internal implementation states unnecessarily.

---

# 11. Survey URL Requirements

Each survey must have a stable unique slug.

Example:

```text
african-tourism-research
```

Public route:

```text
/survey/[slug]
```

Requirements:

* Unique slug.
* Public URL generation.
* Stable links.
* Server-side validation.
* Correct handling of invalid slugs.
* Correct handling of unpublished surveys.
* Correct handling of closed surveys.

Changing a survey title must not accidentally break a campaign URL.

---

# 12. Survey Sharing Requirements

This is a mandatory Version 1 feature.

The administration interface must expose the survey's public URL.

Administrators must be able to:

### Copy Link

Copy the canonical public survey URL.

The implementation must:

1. Generate the correct URL.
2. Copy it to the clipboard.
3. Provide visible feedback.
4. Gracefully handle clipboard API failures.

Example feedback:

```text
Survey link copied successfully
```

### Open Survey

Administrators must be able to open the actual public survey.

This enables:

* Testing.
* Previewing.
* Campaign verification.
* Advertisement linking.

Do not treat sharing as an afterthought.

Survey distribution is part of the core workflow.

---

# 13. Security Requirements

Security must be implemented from the beginning.

Do not postpone authorization until the end.

Public users must never be able to access:

* Private responses.
* Admin analytics.
* Draft surveys.
* Admin management operations.
* Internal requests.

Do not rely exclusively on hidden frontend navigation.

Authorization must be enforced server-side and/or at the database level.

If using Supabase:

* Implement Row Level Security intentionally.
* Avoid permissive policies such as unrestricted authenticated access.
* Separate public insertion permissions from administrative read permissions.
* Validate security policies against real access scenarios.

Never expose:

* Service-role keys.
* Private environment variables.
* Database secrets.

---

# 14. Validation Requirements

All important inputs must be validated.

Use existing repository validation conventions.

Where appropriate, validate:

* Survey creation.
* Survey updates.
* Question creation.
* Survey response submission.
* Customer-care requests.
* Stakeholder requests.

Validation must exist beyond frontend UI validation where security or data integrity requires it.

---

# 15. Analytics Requirements

Analytics must be derived from real database data.

Avoid loading every response into the browser merely to calculate basic metrics.

Prefer:

```text
Database
   ↓
Aggregation
   ↓
Analytics Query / Service
   ↓
Chart-Friendly Result
   ↓
Frontend Visualization
```

Analytics should initially support:

## Overview

* Total responses.
* Survey status.
* Recent response activity.

## Trends

* Responses over time.

## Question Analysis

For suitable question types:

* Answer counts.
* Percentage distributions.

## Detailed Data

* Paginated response table.
* Sorting.
* Filtering.

Do not create misleading charts.

For example:

* Do not use pie charts with excessive categories.
* Do not create trends where insufficient time data exists.
* Handle empty datasets gracefully.

---

# 16. Performance Requirements

Do not optimize prematurely.

But avoid obvious scalability mistakes.

Examples:

### Avoid

```text
SELECT *
FROM survey_responses
```

and sending thousands of complete records to the client unnecessarily.

### Prefer

* Pagination.
* Targeted queries.
* Aggregations.
* Appropriate indexes.
* Server-side filtering where appropriate.

Add database indexes based on real query patterns.

Likely candidates include:

* `survey_id`
* `submitted_at`
* `question_id`
* `response_id`
* `slug`
* `status`

Do not create indexes blindly.

---

# 17. User Experience Requirements

The public platform must NOT feel like Google Forms.

The experience should feel:

* Modern.
* Intentional.
* Professional.
* Branded.
* Trustworthy.
* Smooth.
* Responsive.

Prioritize:

* Clear typography.
* Good spacing.
* Logical hierarchy.
* Visible progress.
* Clear validation.
* Responsive interactions.
* Excellent mobile experience.

The survey should feel like part of a professional research platform.

---

# 18. Development Workflow Rules

The implementation MUST be divided into stages.

Each stage represents a logical development milestone.

Each stage also corresponds to a recommended Git branch.

---

# CRITICAL GIT RULES

You MUST NOT:

* Create Git branches on my behalf.
* Switch branches on my behalf.
* Commit changes on my behalf.
* Push changes on my behalf.
* Merge branches on my behalf.
* Rewrite Git history.

You may:

* Inspect Git status.
* Inspect existing branches.
* Report the current branch.
* Tell me which branch I should create manually.
* Tell me when a stage is ready for commit.

At the beginning of every stage, clearly state:

```text
RECOMMENDED BRANCH:
branch-name-here
```

Then instruct me to create/switch to that branch manually if necessary.

Before beginning implementation, verify and report the current Git state.

---

# 19. Required Development Stages

The project must be implemented progressively through the following stages.

Do NOT skip stages.

Do NOT begin future stages before the current stage passes its acceptance criteria.

---

# STAGE 1 — Foundation & Architecture

## Recommended Branch

```text
feat/african-tourism-platform-foundation
```

## Goal

Establish a clean, production-quality foundation.

## Responsibilities

### Repository Analysis

Before implementation:

* Inspect repository structure.
* Inspect package configuration.
* Inspect TypeScript configuration.
* Inspect lint configuration.
* Inspect existing application conventions.
* Inspect environment variable conventions.
* Inspect database integration.
* Read `AGENT-STANDARDS.md`.

Do not overwrite existing architecture without understanding it.

---

### Application Foundation

Establish or verify:

* Application structure.
* Route organization.
* Shared layout.
* Global styles.
* Component organization.
* Utility organization.
* Type boundaries.

---

### Database Foundation

Design and implement the initial database schema.

At minimum, evaluate the need for:

* Profiles.
* Surveys.
* Survey sections.
* Questions.
* Question options.
* Survey responses.
* Response answers.
* Customer-care requests.
* Stakeholder requests.

Database decisions must support Version 1 while allowing reasonable Version 2 evolution.

---

### Authentication Foundation

Implement secure internal administration authentication.

Public respondents must NOT require an account.

Only authorized internal users should access administration.

---

### Security Foundation

Implement:

* Access boundaries.
* Authorization checks.
* Database policies where applicable.
* Environment variable safety.

---

## Stage 1 Deliverables

* Clean project architecture.
* Database schema.
* Database migrations.
* Authentication foundation.
* Protected admin route foundation.
* Shared application infrastructure.
* Security baseline.

---

## Stage 1 Acceptance Criteria

Before declaring Stage 1 complete:

* [ ] Repository standards are followed.
* [ ] Type checking passes.
* [ ] Linting passes.
* [ ] Production build passes.
* [ ] Database migrations are valid.
* [ ] Authentication works.
* [ ] Unauthorized admin access is blocked.
* [ ] No secrets are exposed.
* [ ] No unnecessary architecture has been introduced.

---

# STAGE 2 — Public African Tourism Experience

## Recommended Branch

```text
feat/african-tourism-public-experience
```

## Goal

Build the public-facing African Tourism research experience.

## Responsibilities

Implement:

* Landing page.
* Research introduction.
* Clear project explanation.
* Research participation CTA.
* Public survey discovery where applicable.
* Customer-care entry point.
* Stakeholder interest entry point.

The experience should communicate credibility.

It should NOT look like:

* A developer demo.
* A generic admin template.
* A generic Google Form clone.

---

## Design Requirements

Prioritize:

* Mobile responsiveness.
* Accessibility.
* Performance.
* Trust.
* Clear calls to action.

---

## Stage 2 Acceptance Criteria

* [ ] Landing experience works across responsive sizes.
* [ ] Navigation works.
* [ ] Calls to action work.
* [ ] Public/private route boundaries remain secure.
* [ ] Accessibility basics are verified.
* [ ] No broken routes.
* [ ] Lint passes.
* [ ] Type check passes.
* [ ] Production build passes.

---

# STAGE 3 — Survey Engine & Public Data Collection

## Recommended Branch

```text
feat/african-tourism-survey-engine
```

## Goal

Implement the core public survey workflow.

This is one of the most important stages.

---

## Responsibilities

Implement:

### Survey Resolution

Public survey routes:

```text
/survey/[slug]
```

The system must:

* Resolve valid published surveys.
* Reject invalid surveys.
* Reject draft surveys.
* Handle hidden survey behavior correctly.
* Handle closed surveys professionally.

---

### Survey Experience

Implement:

* Survey introduction.
* Questions.
* Question options.
* Multi-step progression where appropriate.
* Previous navigation.
* Next navigation.
* Progress indicator.
* Required validation.
* Final review/submission behavior where appropriate.
* Submission success experience.

---

### Response Collection

Implement:

```text
Survey Submission
       ↓
Server Validation
       ↓
Response Record
       ↓
Answer Records
       ↓
Successful Completion
```

Responses must not rely on client-only persistence.

---

### Error Handling

Handle:

* Network failures.
* Validation failures.
* Closed surveys.
* Invalid surveys.
* Duplicate submission edge cases where applicable.
* Unexpected server errors.

---

## Stage 3 Acceptance Criteria

* [ ] Valid published survey loads.
* [ ] Invalid slug is handled correctly.
* [ ] Draft survey cannot be accessed publicly.
* [ ] Closed survey cannot accept responses.
* [ ] Required questions validate correctly.
* [ ] Responses persist correctly.
* [ ] Answers are associated with correct questions.
* [ ] Success state works.
* [ ] Mobile experience is tested.
* [ ] Type check passes.
* [ ] Lint passes.
* [ ] Production build passes.

---

# STAGE 4 — Administration & Survey Management

## Recommended Branch

```text
feat/african-tourism-admin-management
```

## Goal

Build the private internal administration workflow.

---

## Responsibilities

Implement:

### Dashboard

Provide meaningful overview information such as:

* Total responses.
* Active surveys.
* Closed surveys.
* Recent activity.

Do not add meaningless dashboard widgets.

---

### Survey Management

Administrators should be able to:

* View surveys.
* Create surveys.
* Edit survey details.
* Manage survey questions.
* Manage question options.
* Publish surveys.
* Hide surveys.
* Close surveys.
* Archive surveys where implemented.

---

## Survey Lifecycle Controls

Implement clear status controls.

Transitions should be intentional.

Avoid allowing invalid states accidentally.

For example:

```text
Draft
  ↓
Published
  ↓
Closed
```

Additional states should follow explicitly defined rules.

---

## Survey Sharing — Mandatory

Every survey management interface must clearly expose:

```text
PUBLIC SURVEY LINK
```

Administrators must be able to:

### Copy Link

```text
[ Copy Link ]
```

Requirements:

* Correct canonical URL.
* Clipboard integration.
* Success feedback.
* Failure handling.

### Open Survey

```text
[ Open Survey ]
```

Requirements:

* Opens the actual public survey.
* Allows verification of respondent experience.

Survey sharing must be implemented as a genuine workflow feature.

---

## Stage 4 Acceptance Criteria

* [ ] Admin authentication works.
* [ ] Dashboard is protected.
* [ ] Survey management works.
* [ ] Status transitions work.
* [ ] Draft surveys remain private.
* [ ] Published surveys are publicly accessible.
* [ ] Closed surveys reject new responses.
* [ ] Survey public URL is displayed.
* [ ] Copy link works.
* [ ] Open survey works.
* [ ] Slug uniqueness is protected.
* [ ] Type check passes.
* [ ] Lint passes.
* [ ] Production build passes.

---

# STAGE 5 — Responses & Research Analytics

## Recommended Branch

```text
feat/african-tourism-analytics
```

## Goal

Turn collected responses into useful research data and visual insights.

---

## Responsibilities

### Response Tables

Implement:

* Pagination.
* Sorting.
* Filtering.
* Useful response metadata.
* Individual response inspection.

Do not load all responses unnecessarily.

---

### Analytics

Implement useful metrics based on actual survey data.

Potential capabilities:

#### Overview

* Total responses.
* Response counts.

#### Trends

* Responses over time.

#### Categorical Analysis

For applicable questions:

* Distribution counts.
* Percentages.

---

### Visualizations

Use charts intentionally.

Possible chart types:

* Bar charts.
* Pie/donut charts.
* Trend/line charts.

Chart selection should depend on the data.

Do not force every dataset into every chart type.

---

### Empty States

Analytics must gracefully handle:

* No responses.
* Insufficient trend data.
* Questions without responses.

Do not display broken or misleading charts.

---

## Stage 5 Acceptance Criteria

* [ ] Response table works.
* [ ] Pagination works.
* [ ] Sorting works.
* [ ] Filtering works.
* [ ] Individual responses can be inspected.
* [ ] Metrics are accurate.
* [ ] Charts reflect actual data.
* [ ] Empty states work.
* [ ] Large response sets are not unnecessarily loaded.
* [ ] Type check passes.
* [ ] Lint passes.
* [ ] Production build passes.

---

# STAGE 6 — Customer Care & Stakeholder Requests

## Recommended Branch

```text
feat/african-tourism-contact-workflows
```

## Goal

Complete the public communication workflows.

---

## Customer Care

Visitors should be able to:

* Report issues.
* Ask questions.
* Submit inquiries.

The workflow:

```text
Visitor
   ↓
Customer Care Form
   ↓
Validation
   ↓
Database Persistence
   ↓
Optional Notification
```

Persistence must occur before non-critical notification attempts.

---

## Stakeholder Interest

Organizations or stakeholders should be able to submit:

* Organization name.
* Contact information.
* Area of interest.
* Message.

The information should be securely available to administrators.

---

## Admin Request Management

Administrators should be able to:

* View customer-care requests.
* View stakeholder requests.
* Inspect request details.
* Track request status where appropriate.

Do not build a full CRM.

---

## Stage 6 Acceptance Criteria

* [ ] Customer-care requests persist.
* [ ] Stakeholder requests persist.
* [ ] Input validation works.
* [ ] Admin-only request access works.
* [ ] Public users cannot access private requests.
* [ ] Error states work.
* [ ] Success states work.
* [ ] Type check passes.
* [ ] Lint passes.
* [ ] Production build passes.

---

# STAGE 7 — Version 1 Production Readiness

## Recommended Branch

```text
chore/african-tourism-v1-production-readiness
```

## Goal

Perform rigorous quality assurance and prepare Version 1 for deployment.

This stage is NOT primarily for adding new features.

---

## Responsibilities

### Functional Testing

Test complete workflows.

#### Public Workflow

```text
Landing Page
   ↓
Survey Discovery / Direct Link
   ↓
Survey Completion
   ↓
Submission
   ↓
Success
```

#### Advertisement Workflow

```text
External Campaign Link
        ↓
Survey URL
        ↓
Public Survey
        ↓
Submission
```

#### Administrative Workflow

```text
Login
   ↓
Dashboard
   ↓
Survey Management
   ↓
Copy Survey Link
   ↓
Open Survey
   ↓
Responses
   ↓
Analytics
```

---

### Security Review

Verify:

* Protected routes.
* Authorization boundaries.
* Database access policies.
* Environment variables.
* Sensitive data exposure.

---

### Responsive Testing

Test:

* Desktop.
* Tablet.
* Mobile.

Prioritize the public survey mobile experience.

---

### Accessibility Review

Review:

* Labels.
* Keyboard navigation where relevant.
* Focus states.
* Form errors.
* Color-independent feedback.

---

### Error Handling Review

Verify:

* Loading states.
* Empty states.
* Error states.
* Network failure behavior.
* Invalid routes.

---

### Code Quality

Review:

* Dead code.
* Unused imports.
* Unnecessary dependencies.
* Duplicate logic.
* Type safety.
* Error boundaries where appropriate.
* Naming consistency.

Do not suppress lint or TypeScript errors simply to make checks pass.

Fix root causes.

---

## Stage 7 Acceptance Criteria

* [ ] Full user journeys tested.
* [ ] Security boundaries reviewed.
* [ ] Responsive testing completed.
* [ ] Mobile survey experience verified.
* [ ] Empty states verified.
* [ ] Error states verified.
* [ ] Lint passes.
* [ ] Type checking passes.
* [ ] Tests pass.
* [ ] Production build passes.
* [ ] No known critical defects remain.
* [ ] Version 1 scope has not expanded unnecessarily.

---

# 20. Mandatory Testing Discipline

Before declaring ANY stage complete, perform rigorous testing appropriate to the changes.

At minimum, run the repository's available verification commands.

Determine the correct commands from the repository and `AGENT-STANDARDS.md`.

Do not assume commands.

Possible checks may include:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

However:

> Use the repository's actual scripts rather than blindly running assumed commands.

---

# Testing Rule

A feature is NOT complete because:

> "The code has been written."

A feature is complete only when:

```text
Implemented
     +
Verified
     +
Integrated
     +
Regression Checked
```

---

# 21. Stage Completion Report

At the end of every stage, provide a concise but technically useful report.

Use this structure:

```text
## Stage X Completion Report

### Recommended Branch
branch-name

### Completed
- Item
- Item

### Architecture Decisions
- Decision
- Reason

### Files Added
- path

### Files Modified
- path

### Database Changes
- Migration/schema changes

### Tests Performed
- Command/result
- Manual workflow tested

### Verification Results
- Lint: PASS/FAIL
- Type Check: PASS/FAIL
- Tests: PASS/FAIL
- Build: PASS/FAIL

### Known Limitations
- Item

### Intentionally Deferred
- Future feature

### Ready for Human Review
YES/NO
```

Do NOT claim success if verification failed.

Be explicit about failures.

---

# 22. Failure Handling Rules

If you encounter:

* Missing environment variables.
* Missing credentials.
* Broken pre-existing code.
* Database access limitations.
* Unclear requirements.
* Dependency conflicts.

Do NOT silently work around the issue.

Instead:

1. Identify the problem.
2. Explain its technical cause.
3. Identify what belongs to existing code versus your changes.
4. Propose the smallest correct solution.
5. Ask for intervention only when genuinely required.

Do not hide failures.

Do not disable important tooling to avoid fixing problems.

---

# 23. Dependency Rules

Before installing a new dependency:

1. Check whether equivalent functionality already exists.
2. Evaluate whether native platform capabilities are sufficient.
3. Confirm the dependency is actively maintained.
4. Avoid unnecessary dependency bloat.

Do not install packages merely because they are popular.

Every dependency should have a clear justification.

---

# 24. Database Migration Rules

Do not make destructive database changes casually.

Before changing schemas:

* Inspect existing migrations.
* Understand existing dependencies.
* Prefer additive changes where appropriate.
* Keep migrations reproducible.
* Verify constraints.
* Verify indexes.
* Verify authorization policies.

Do not manually edit production database state outside reproducible migration workflows unless explicitly required.

---

# 25. Code Quality Rules

Prefer:

```text
Explicit > Clever
Simple > Overengineered
Typed > Untyped
Validated > Assumed
Secure > Convenient
Tested > Claimed
```

Avoid:

* `any` unless genuinely unavoidable.
* Dead code.
* Copy-paste duplication.
* Giant components.
* Giant server actions.
* Business logic embedded everywhere in UI components.
* Suppressing TypeScript errors.
* Suppressing lint rules without justification.

---

# 26. Architecture Evolution Rule

When making a design decision, ask:

### Question 1

Does this solve a Version 1 requirement?

If no:

> Do not implement it.

### Question 2

Could this decision make Version 2 unnecessarily difficult?

If yes:

> Improve the boundary or data model without implementing Version 2 features.

Example:

Good:

```text
Flexible survey/question schema
```

Bad:

```text
Building an entire multi-tenant organization system
```

---

# 27. Definition of Version 1 Complete

Version 1 is complete when the following workflow works end-to-end:

```text
PROJECT ADMINISTRATOR
        │
        ▼
LOGIN
        │
        ▼
CREATE / CONFIGURE RESEARCH SURVEY
        │
        ▼
PUBLISH SURVEY
        │
        ▼
COPY PUBLIC SURVEY LINK
        │
        ▼
USE LINK IN ADVERTISEMENT / CAMPAIGN
        │
        ▼
RESPONDENT OPENS SURVEY
        │
        ▼
RESPONDENT COMPLETES SURVEY
        │
        ▼
RESPONSE STORED AUTOMATICALLY
        │
        ▼
ADMIN OPENS DASHBOARD
        │
        ▼
VIEWS RESPONSES
        │
        ▼
FILTERS / SORTS DATA
        │
        ▼
VIEWS ANALYTICS & TRENDS
        │
        ▼
USES INSIGHTS FOR RESEARCH
```

Additionally:

```text
PUBLIC USER
      │
      ├── Customer Care Request
      │
      └── Stakeholder Interest Request
```

must work securely.

---

# 28. Final Scope Boundary

The goal is NOT:

> Build the largest possible tourism platform.

The goal is:

> Build a professional, secure, useful Version 1 that completely solves the immediate African Tourism research collection and analytics workflow.

This implementation should become a credible foundation for future evolution.

But Version 1 must remain disciplined.

---

# 29. Final Operating Instructions

Follow this exact process:

## Step 1

Read:

* `AGENT-STANDARDS.md`
* Master project concept document.
* Existing repository documentation.

---

## Step 2

Inspect the repository before modifying anything.

Report:

* Existing architecture.
* Existing stack.
* Existing conventions.
* Potential conflicts.
* Recommended implementation approach.

---

## Step 3

Begin with:

```text
STAGE 1
feat/african-tourism-platform-foundation
```

Do NOT create the branch yourself.

Tell me the branch to create.

---

## Step 4

Implement only the current stage.

Do not jump ahead.

---

## Step 5

Test rigorously.

Fix root causes of failures.

Do not suppress problems.

---

## Step 6

Provide the Stage Completion Report.

---

## Step 7

STOP.

Wait for explicit authorization before proceeding to the next stage.

---

# Absolute Final Rule

> **Do not confuse knowing the future product vision with having authorization to build the future product.**

Understand Versions 2 and 3.

Architect responsibly for their possible evolution.

But implement **Version 1 only**, one stage at a time.

Build carefully.

Test rigorously.

Do not overengineer.

Do not create branches.

Do not commit changes.

Do not proceed beyond the currently authorized stage without explicit instruction.
