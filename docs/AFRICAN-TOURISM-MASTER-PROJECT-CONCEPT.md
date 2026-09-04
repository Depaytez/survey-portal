# African Tourism Research & Intelligence Platform

## Master Product Concept, Dream Roadmap & Engineering Foundation

**Document Status:** Product & Engineering Source of Truth  
**Current Focus:** Version 1  
**Product Evolution:** Version 1 → Version 2 → Version 3

---

# Table of Contents

1. [Executive Vision](#1-executive-vision)
2. [The Problem](#2-the-problem)
3. [The Product Vision](#3-the-product-vision)
4. [Strategic Product Positioning](#4-strategic-product-positioning)
5. [The Three-Version Product Roadmap](#5-the-three-version-product-roadmap)
6. [Core Product Principles](#6-core-product-principles)
7. [Version 1 — African Tourism Research MVP](#7-version-1--african-tourism-research-mvp)
8. [Version 2 — Tourism Research & Programme Intelligence](#8-version-2--tourism-research--programme-intelligence)
9. [Version 3 — Tourism Intelligence & Development Platform](#9-version-3--tourism-intelligence--development-platform)
10. [Shared Product Architecture](#10-shared-product-architecture)
11. [Domain Model & Data Architecture](#11-domain-model--data-architecture)
12. [Database Foundation](#12-database-foundation)
13. [Survey Sharing & Distribution Architecture](#13-survey-sharing--distribution-architecture)
14. [Analytics Architecture](#14-analytics-architecture)
15. [Security & Access Control](#15-security--access-control)
16. [Application Architecture](#16-application-architecture)
17. [Technology Strategy](#17-technology-strategy)
18. [Development Philosophy](#18-development-philosophy)
19. [Version Evolution Rules](#19-version-evolution-rules)
20. [Long-Term Product Vision Summary](#20-long-term-product-vision-summary)
21. [Instructions for Engineers and AI Coding Agents](#21-instructions-for-engineers-and-ai-coding-agents)

---

# 1. Executive Vision

## The Big Idea

The African Tourism Research & Intelligence Platform is envisioned as a digital research, data collection, analytics, and intelligence infrastructure designed to support the understanding, planning, development, and long-term growth of tourism across Africa, beginning with a focused research initiative around the development of tourism opportunities in South Western Nigeria.

The platform begins with a simple but important problem:

> Before meaningful tourism development decisions can be made, reliable data and insights must be collected and understood.

Rather than relying on fragmented manual forms, spreadsheets, and disconnected reporting workflows, the platform aims to progressively create a centralized digital environment where tourism-related research can be:

- Designed
- Distributed
- Collected
- Managed
- Analysed
- Visualized
- Interpreted
- Converted into actionable insights

The first implementation is intentionally narrow.

The long-term vision is ambitious.

The engineering strategy must understand both.

---

# 2. The Problem

Tourism development requires understanding.

Before developing programmes, infrastructure, destinations, policies, or investment strategies, stakeholders need evidence about questions such as:

- What tourism opportunities exist?
- What do communities think?
- What experiences do potential tourists want?
- What challenges prevent tourism growth?
- Which destinations have the highest potential?
- What infrastructure gaps exist?
- What do tourism businesses need?
- How do stakeholders perceive tourism development?
- What regions demonstrate specific patterns or opportunities?
- How does tourism sentiment change over time?

Without structured data collection and analysis, decisions can become based primarily on:

- Assumptions
- Personal opinions
- Anecdotal evidence
- Fragmented reports
- Manual spreadsheets

The initial project therefore begins with a practical objective:

> Build a professional digital research platform that allows the African Tourism initiative to collect and analyse structured research data efficiently.

---

# 3. The Product Vision

The long-term vision is not simply to build a survey form.

The broader vision is to progressively develop a tourism research and intelligence infrastructure.

```text
TOURISM DEVELOPMENT VISION
            │
            ▼
RESEARCH & DATA COLLECTION
            │
            ▼
PUBLIC + COMMUNITY + STAKEHOLDER INSIGHTS
            │
            ▼
DATA ANALYTICS
            │
            ▼
ACTIONABLE INTELLIGENCE
            │
            ▼
EVIDENCE-BASED PLANNING
            │
            ▼
TOURISM PROGRAMME DEVELOPMENT
            │
            ▼
LONG-TERM TOURISM GROWTH
```

The platform should eventually support the research and intelligence needs surrounding tourism development initiatives.

However, the platform must earn that evolution.

It begins by solving one research problem properly.

---

# 4. Strategic Product Positioning

The product should not be positioned merely as:

> "An online survey tool."

That positioning is too narrow.

The strategic positioning is:

> **A digital tourism research and intelligence infrastructure designed to collect, analyse, and transform data into actionable insights that support tourism development initiatives.**

The initial implementation focuses specifically on African tourism research and the proposed tourism development programme for South Western Nigeria.

This creates a clear relationship between the technology and the programme vision.

```text
TOURISM DEVELOPMENT PROGRAMME
             │
             ▼
      DIGITAL RESEARCH SYSTEM
             │
             ▼
      DATA COLLECTION ENGINE
             │
             ▼
      ANALYTICS & INSIGHTS
             │
             ▼
      EVIDENCE FOR DECISIONS
```

The software is therefore an enabling infrastructure component of the broader tourism initiative.

---

# 5. The Three-Version Product Roadmap

The product must evolve progressively.

The long-term vision should influence architecture.

It should NOT become an excuse to prematurely build unnecessary features.

```text
┌──────────────────────────────────────────────┐
│                  VERSION 1                   │
│                                              │
│       African Tourism Research MVP           │
│                                              │
│  Survey Collection + Response Analytics      │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  VERSION 2                   │
│                                              │
│   Tourism Research & Programme Intelligence  │
│                                              │
│ Multiple Studies + Advanced Research Tools   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  VERSION 3                   │
│                                              │
│   Tourism Intelligence & Development Platform│
│                                              │
│ Intelligence + Geography + AI + Monitoring   │
└──────────────────────────────────────────────┘
```

Each version must be treated as a separate product milestone.

---

# 6. Core Product Principles

The following principles apply across the entire product evolution.

## 6.1 Start Focused

The first version must solve the immediate research workflow well.

Do not build a large platform before validating the actual workflow.

---

## 6.2 Build for Real Data

The system must collect and analyse real research data.

Avoid decorative dashboards based on fake data.

---

## 6.3 Professional Public Experience

Respondents should not feel they are filling out a generic Google Form.

The experience should feel:

- Professional
- Trustworthy
- Purposeful
- Modern
- Branded
- Mobile-friendly

---

## 6.4 Architecture Should Not Be Survey-Specific

Although Version 1 focuses on a particular African Tourism research project, the database architecture must not hardcode that survey into database columns.

The initial survey is data.

It is not the application's architecture.

---

## 6.5 Avoid Premature Complexity

Do not introduce:

- Microservices
- Event streaming
- Data warehouses
- Complex multi-tenancy
- AI systems
- Advanced geographic intelligence

until they are genuinely required.

---

## 6.6 Progressive Expansion

Each new capability should build upon proven infrastructure.

```text
Solve
  ↓
Validate
  ↓
Learn
  ↓
Improve
  ↓
Expand
```

---

## 6.7 Low Operational Cost

The system should prioritize:

- Managed infrastructure
- Minimal maintenance
- Low operational complexity
- Clear handover
- Sustainable hosting

The objective is not to build the most technologically complicated system.

The objective is to build the most useful and sustainable system.

---

# 7. Version 1 — African Tourism Research MVP

## 7.1 Version 1 Mission

Build a focused digital research platform for collecting and analysing data relating to the African Tourism research initiative.

The Version 1 system should provide a complete workflow:

```text
ADVERTISEMENT / CAMPAIGN
          │
          ▼
PUBLIC RESEARCH LANDING PAGE
          │
          ▼
PUBLIC SURVEY
          │
          ▼
AUTOMATIC RESPONSE COLLECTION
          │
          ▼
SECURE DATABASE
          │
          ▼
PRIVATE ADMIN DASHBOARD
          │
          ▼
TABLES + FILTERS + CHARTS + TRENDS
          │
          ▼
RESEARCH INSIGHTS
```

---

## 7.2 Version 1 Objectives

Version 1 should allow the research team to:

1. Present the research professionally.
2. Direct people from advertisements to the research.
3. Allow respondents to complete surveys easily.
4. Automatically store research responses.
5. Monitor incoming responses.
6. Analyse responses visually.
7. Filter and sort research data.
8. Close surveys when research collection is complete.
9. Share survey links easily.
10. Provide a foundation for future tourism research.

---

# 7.3 Version 1 Users

## Public Respondents

Public respondents can:

- Visit the research website.
- Learn about the research.
- Access available surveys.
- Complete surveys.
- Submit responses.
- Contact the project team.
- Report issues.

Public respondents do not require administrative accounts.

---

## Project Administrators

Authorized internal project personnel can:

- Access the admin dashboard.
- Manage surveys.
- Publish surveys.
- Hide surveys.
- Close surveys.
- Share survey links.
- Copy public survey links.
- View responses.
- Analyse data.
- Review inquiries.

---

# 7.4 Public Research Website

The public website should introduce the research initiative professionally.

It should include:

- Project identity.
- Research introduction.
- Clear explanation of the purpose.
- Participation call-to-action.
- Featured active research.
- Survey participation links.
- Contact/customer-care entry point.
- Partnership/stakeholder interest entry point.

The public website must be:

- Responsive.
- Mobile-first.
- Fast.
- Accessible.
- Trustworthy.

---

# 7.5 Public Survey Experience

Each survey should have a dedicated public URL.

Example:

```text
/survey/african-tourism-research
```

The survey experience should include:

- Research introduction.
- Clear purpose.
- Estimated completion time.
- Multi-step experience where appropriate.
- Progress indicator.
- Required question validation.
- Clear navigation.
- Previous and next actions.
- Submission confirmation.
- Professional thank-you screen.

The experience must not resemble a generic Google Form.

---

# 7.6 Survey Sharing & Distribution

Survey distribution is a core Version 1 feature.

Every published survey must automatically have a unique stable public URL.

Example:

```text
https://domain.com/survey/african-tourism-research
```

Project administrators must have access to a dedicated sharing interface.

```text
Survey Management
        │
        ▼
Select Survey
        │
        ▼
Survey Sharing
        │
        ├── Copy Survey Link
        │
        ├── Open Public Survey
        │
        └── Future: QR Code
```

At minimum, Version 1 must support:

### Copy Survey Link

Administrators should be able to click:

```text
[ Copy Link ]
```

The system should copy the full public survey URL to the clipboard.

A success state should clearly confirm:

```text
✓ Survey link copied
```

---

### Open Survey

Administrators should be able to open the public survey directly.

```text
[ Open Survey ]
```

This enables administrators to:

- Preview the respondent experience.
- Test survey links.
- Confirm advertisements are pointing to the correct destination.

---

## Survey Link Use Cases

The survey URL must work properly when used in:

- Facebook advertisements.
- Instagram advertisements.
- Google advertisements.
- WhatsApp.
- SMS.
- Email.
- Social media posts.
- QR codes.
- Direct sharing.

The survey URL should remain stable unless intentionally changed.

---

# 7.7 Survey Lifecycle

Surveys should support the following lifecycle:

```text
DRAFT
   │
   ▼
PUBLISHED
   │
   ├──────────► HIDDEN
   │
   ▼
CLOSED
   │
   ▼
ARCHIVED
```

---

## Draft

- Internal only.
- Not accessible publicly.

---

## Published

- Publicly accessible.
- Can accept responses.
- Can appear on the public research page.

---

## Hidden

- Removed from public survey listings.
- Direct-link behavior should be intentionally defined.

Recommended Version 1 behavior:

> Hidden surveys remain accessible through their direct link if still open, allowing administrators to use targeted distribution without displaying the survey on the general public collection page.

---

## Closed

- New responses are rejected.
- Existing responses remain available.
- Public visitors receive a professional closed-survey message.

---

## Archived

- Historical/internal use.
- Not intended for active collection.

---

# 7.8 Survey Question Types

Version 1 should support only question types required by the actual African Tourism research.

Likely question primitives include:

- Single choice
- Multiple choice
- Short text
- Long text
- Number
- Email
- Select

The question rendering system should remain extensible.

Conceptually:

```text
Survey Question Renderer
        │
        ├── Single Choice
        ├── Multiple Choice
        ├── Text
        ├── Textarea
        ├── Number
        └── Select
```

Do not build an unnecessarily complex survey engine.

---

# 7.9 Automatic Response Collection

The workflow must be fully automated.

```text
Respondent
    │
    ▼
Completes Survey
    │
    ▼
Server Validation
    │
    ▼
Response Stored
    │
    ▼
Answer Records Stored
    │
    ▼
Analytics Automatically Updated
```

The system must not depend on:

- Manual copying.
- Manual CSV updates.
- Manual spreadsheet entry.

---

# 7.10 Admin Dashboard

Authorized project administrators should have access to a private dashboard.

The dashboard should provide:

- Overview of research activity.
- Total responses.
- Response trends.
- Active surveys.
- Closed surveys.
- Recent responses.
- Survey management.
- Analytics access.

The dashboard should prioritize useful information rather than decorative widgets.

---

# 7.11 Survey Management

Administrators should be able to:

- View surveys.
- Create surveys.
- Edit surveys.
- Manage questions.
- Publish surveys.
- Hide surveys.
- Close surveys.
- View survey responses.
- Access analytics.
- Copy survey links.
- Open public surveys.

The Version 1 survey administration experience should remain focused.

Do not build a large enterprise survey-builder product.

---

# 7.12 Response Management

Administrators should be able to inspect collected responses.

Features should include:

- Paginated tables.
- Sorting.
- Filtering.
- Search where meaningful.
- Submission dates.
- Response status.
- Individual response inspection.

Large datasets must not be loaded unnecessarily into the browser.

---

# 7.13 Analytics Dashboard

Analytics is a core value of Version 1.

The dashboard should allow the research team to understand collected data visually.

---

## Key Metrics

Possible metrics:

- Total responses.
- Responses over time.
- Recent response activity.
- Survey completion metrics where accurately measurable.

---

## Bar Charts

Suitable for:

- Comparing answer frequencies.
- Comparing categories.

---

## Pie / Donut Charts

Suitable for:

- Small categorical distributions.

Avoid using pie charts where too many categories make interpretation difficult.

---

## Trend Charts

Suitable for:

- Responses over time.
- Daily trends.
- Weekly trends.

---

## Data Tables

Suitable for:

- Detailed inspection.
- Sorting.
- Filtering.
- Searching.

---

# 7.14 Customer Care

The public platform should provide a clear customer-care entry point.

Visitors should be able to:

- Report technical issues.
- Ask questions.
- Make inquiries.
- Provide relevant feedback.

Workflow:

```text
Customer Submission
        │
        ▼
Validation
        │
        ▼
Database Persistence
        │
        ▼
Project Team Notification
```

Important principle:

> Persist the request before attempting notification.

A temporary email failure should not cause a customer inquiry to disappear.

---

# 7.15 Partnership & Stakeholder Interest

The platform may provide a public channel for relevant stakeholders or organizations to express interest.

Possible categories:

- Tourism development partnership.
- Research collaboration.
- Data/research support.
- Investment or programme discussion.
- General stakeholder inquiry.

This feature should remain simple in Version 1.

---

# 7.16 Version 1 Explicit Non-Goals

The following must NOT be implemented unless explicitly authorized.

- Public self-service accounts.
- Multi-tenant SaaS.
- Complex organization workspaces.
- Subscription billing.
- Payment processing.
- AI insight engines.
- Geographic intelligence systems.
- Interactive mapping systems.
- Complex workflow automation.
- Enterprise permission systems.
- Advanced report generation.
- Tourism programme management.
- Mobile native applications.

These belong to future consideration.

They are not missing Version 1 features.

---

# 7.17 Version 1 Definition of Success

Version 1 succeeds when:

1. A campaign can direct people to the research platform.
2. Respondents can easily access the survey.
3. The survey looks professional and trustworthy.
4. Survey links can be copied and shared.
5. Survey links work properly for advertisements.
6. Responses are automatically stored.
7. Administrators can securely access collected data.
8. Administrators can view tables and analytics.
9. Administrators can filter and sort responses.
10. Administrators can manage survey status.
11. Administrators can close data collection.
12. The system is affordable to operate.
13. The architecture does not unnecessarily block future tourism research expansion.

---

# 8. Version 2 — Tourism Research & Programme Intelligence

## 8.1 Version 2 Mission

Version 2 expands the system from supporting one focused research initiative into supporting multiple tourism-related research studies.

The transition is:

```text
ONE RESEARCH SURVEY
        │
        ▼
MULTIPLE TOURISM STUDIES
        │
        ▼
CENTRALIZED RESEARCH OPERATIONS
```

---

# 8.2 Multiple Tourism Research Studies

Examples could include:

```text
African Tourism Programme
        │
        ├── Tourism Potential Study
        │
        ├── Community Perception Study
        │
        ├── Tourist Experience Study
        │
        ├── Hospitality Industry Study
        │
        ├── Tourism Infrastructure Assessment
        │
        └── Stakeholder Perception Study
```

The system may evolve to manage multiple research studies simultaneously.

---

# 8.3 Version 2 Potential Capabilities

## Research Project Management

- Create research studies.
- Define research objectives.
- Organize surveys by study.
- Track research status.
- Archive completed studies.

---

## Dynamic Survey Builder

- Reusable survey creation.
- More question types.
- Question sections.
- Question ordering.
- Survey templates.
- Question duplication.
- Survey preview.

---

## Research Templates

Potential reusable templates:

- Community research.
- Tourist survey.
- Business survey.
- Stakeholder survey.
- Infrastructure assessment.

---

## Advanced Data Management

- Advanced filtering.
- Saved filters.
- Data exports.
- Response tagging.
- Research segmentation.

---

## Advanced Analytics

- Cross-tabulation.
- Comparative analysis.
- Demographic segmentation.
- Survey comparisons.
- Custom date ranges.

---

## Data Export

Potential exports:

- CSV.
- Excel.
- Research-ready datasets.

---

# 8.4 Version 2 Domain Evolution

The domain may evolve from:

```text
Survey
   │
   └── Responses
```

into:

```text
Research Programme
        │
        ▼
Research Study
        │
        ├── Survey
        │
        ├── Survey
        │
        └── Analytics
```

This evolution should occur only when Version 2 is authorized.

---

# 8.5 Version 2 Definition of Success

Version 2 succeeds when the platform can:

- Support multiple tourism research studies.
- Organize surveys properly.
- Reuse research structures.
- Manage more complex datasets.
- Provide deeper analysis.
- Reduce manual research operations.

---

# 9. Version 3 — Tourism Intelligence & Development Platform

## 9.1 Version 3 Mission

Version 3 evolves the system beyond survey collection into a broader tourism intelligence infrastructure.

The focus becomes:

```text
DATA
  │
  ▼
ANALYSIS
  │
  ▼
INSIGHTS
  │
  ▼
INTELLIGENCE
  │
  ▼
DEVELOPMENT DECISIONS
```

---

# 9.2 Geographic Tourism Intelligence

Future capabilities may include:

- Geographic visualization.
- Regional tourism mapping.
- Destination mapping.
- Tourism opportunity mapping.
- Infrastructure visualization.
- Regional comparisons.

Potential concept:

```text
SOUTH WESTERN NIGERIA
        │
        ├── Lagos
        ├── Ogun
        ├── Oyo
        ├── Osun
        ├── Ondo
        └── Ekiti
                │
                ▼
        Tourism Intelligence
```

---

# 9.3 Tourism Trend Monitoring

Potential future capabilities:

- Tourism sentiment trends.
- Visitor interest patterns.
- Destination interest.
- Seasonal patterns.
- Regional comparisons.

---

# 9.4 AI-Assisted Research Intelligence

AI should augment researchers.

It must not fabricate conclusions.

Potential capabilities:

- Research summaries.
- Trend identification.
- Pattern detection.
- Anomaly detection.
- Insight suggestions.
- Report drafting assistance.
- Research question recommendations.

---

# 9.5 Automated Reporting

Future reporting capabilities may include:

- Research reports.
- Executive summaries.
- Stakeholder reports.
- Programme updates.
- Automated visual reports.

---

# 9.6 Tourism Development Monitoring

As the tourism programme evolves, the platform could potentially support:

- Programme indicators.
- Development milestones.
- Project monitoring.
- Tourism growth indicators.
- Impact measurement.

---

# 9.7 Version 3 Definition of Success

Version 3 succeeds when the platform begins functioning as meaningful tourism intelligence infrastructure capable of supporting long-term tourism development decisions.

---

# 10. Shared Product Architecture

The architecture should support growth without prematurely implementing future complexity.

Recommended approach:

> **Modular Monolith**

Do not use microservices initially.

Conceptually:

```text
Application
│
├── Public Platform
│   ├── Landing
│   ├── Research Information
│   ├── Surveys
│   ├── Customer Care
│   └── Stakeholder Interest
│
├── Administration
│   ├── Authentication
│   ├── Dashboard
│   ├── Survey Management
│   ├── Responses
│   ├── Analytics
│   └── Requests
│
├── Domain
│   ├── Surveys
│   ├── Responses
│   ├── Analytics
│   └── Authorization
│
└── Infrastructure
    ├── Database
    ├── Authentication
    ├── Notifications
    └── Storage
```

The actual repository structure may differ.

The important principle is domain separation.

---

# 11. Domain Model & Data Architecture

The core Version 1 domain model:

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

Future evolution:

```text
TOURISM PROGRAMME
        │
        ▼
RESEARCH STUDY
        │
        ▼
SURVEY
        │
        ▼
RESPONSES
        │
        ▼
ANALYTICS
```

Version 1 should not prematurely implement the entire future hierarchy.

However, it must avoid database decisions that make future evolution destructive.

---

# 12. Database Foundation

## 12.1 profiles

Internal authorized users.

Suggested fields:

```text
id
full_name
role
created_at
updated_at
```

---

# 12.2 surveys

```text
id
title
slug
description
short_description
status
is_listed_publicly
estimated_duration_minutes
welcome_message
completion_message
created_by
published_at
closed_at
created_at
updated_at
```

---

# 12.3 survey_sections

```text
id
survey_id
title
description
display_order
created_at
updated_at
```

---

# 12.4 questions

```text
id
survey_id
section_id
question_text
description
question_type
is_required
display_order
configuration
created_at
updated_at
```

`configuration` can use flexible structured storage such as JSONB where justified.

---

# 12.5 question_options

```text
id
question_id
label
value
display_order
created_at
updated_at
```

---

# 12.6 survey_responses

```text
id
survey_id
status
started_at
submitted_at
metadata
created_at
updated_at
```

Possible statuses:

```text
IN_PROGRESS
SUBMITTED
ABANDONED
```

Do not overengineer incomplete response tracking unless genuinely required.

---

# 12.7 response_answers

```text
id
response_id
question_id
value
created_at
updated_at
```

The `value` should support multiple answer types.

A flexible structured approach may be appropriate.

---

# 12.8 customer_care_requests

```text
id
name
email
category
message
status
created_at
updated_at
```

---

# 12.9 stakeholder_requests

```text
id
organization_name
contact_name
email
phone
interest_type
message
status
created_at
updated_at
```

---

# 13. Survey Sharing & Distribution Architecture

Survey sharing must be treated as a first-class feature.

Each survey should have:

```text
Unique ID
+
Stable Slug
+
Public URL
```

Example:

```text
Survey ID:
abc123

Slug:
african-tourism-research

Public URL:
/survey/african-tourism-research
```

---

## Sharing Interface

The admin survey interface should clearly expose:

```text
PUBLIC SURVEY LINK

https://domain.com/survey/african-tourism-research


[ COPY LINK ]     [ OPEN SURVEY ]
```

---

## Copy Link Behaviour

The application should:

1. Generate the canonical public URL.
2. Copy it to the clipboard.
3. Display confirmation.
4. Handle clipboard failure gracefully.

Example:

```text
✓ Survey link copied successfully
```

---

## Link Stability

Published survey links should not change unexpectedly.

Changing survey titles should not automatically break active campaign URLs.

If slugs can change, the system should eventually consider redirect strategies.

Version 1 should prioritize stable URLs.

---

## Future QR Distribution

Future versions may support:

```text
Survey
   │
   ├── Public Link
   ├── QR Code
   ├── Social Sharing
   └── Campaign Tracking
```

QR generation is optional for Version 1 unless explicitly prioritized.

---

# 14. Analytics Architecture

Analytics should be based on actual collected responses.

Avoid this pattern:

```text
DATABASE
    │
    ▼
DOWNLOAD ALL RESPONSES
    │
    ▼
SEND EVERYTHING TO BROWSER
    │
    ▼
CALCULATE EVERYTHING CLIENT SIDE
```

Prefer:

```text
DATABASE
    │
    ▼
SERVER / DATABASE AGGREGATION
    │
    ▼
ANALYTICS DATA
    │
    ▼
VISUALIZATION
```

---

## Database Performance

Consider indexing:

```text
survey_id
submitted_at
question_id
response_id
slug
status
```

Actual indexes should be determined based on implemented queries.

---

## Analytics Components

Potential analytics architecture:

```text
Analytics Service
        │
        ├── Response Metrics
        ├── Trend Analytics
        ├── Question Distribution
        └── Response Tables
```

---

# 15. Security & Access Control

## Public Access

Public users should only be able to:

- View publicly available research information.
- Access permitted surveys.
- Submit valid responses.
- Submit customer-care requests.
- Submit stakeholder inquiries.

They must not access:

- Admin dashboards.
- Private analytics.
- Individual respondent data.
- Draft surveys.

---

## Internal Administration

Authorized internal users can access:

- Survey management.
- Responses.
- Analytics.
- Customer-care requests.
- Stakeholder inquiries.

---

## Security Principles

- Server-side authorization.
- Input validation.
- Secure authentication.
- Database-level access protection.
- No secret exposure.
- Secure environment variable management.

If Supabase is used:

- Implement Row Level Security correctly.
- Avoid overly permissive policies.
- Do not rely exclusively on frontend route hiding.

---

# 16. Application Architecture

Recommended high-level route concept:

```text
/
├── about
├── research
├── survey
│   └── [slug]
├── contact
├── stakeholder-interest
│
└── admin
    ├── login
    ├── dashboard
    ├── surveys
    ├── surveys/new
    ├── surveys/[id]
    ├── surveys/[id]/responses
    ├── surveys/[id]/analytics
    ├── customer-care
    └── stakeholder-requests
```

The final implementation may adapt this structure to repository conventions.

---

# 17. Technology Strategy

Recommended stack:

## Frontend

- Next.js
- App Router
- TypeScript

## Styling

- Tailwind CSS

## Database

- PostgreSQL

## Backend Platform

- Supabase

Potential responsibilities:

- PostgreSQL database.
- Authentication.
- Row Level Security.
- Storage where required.

## Validation

- Zod

## Visualization

- Recharts or another appropriate maintained chart library.

## Hosting

- Vercel or another low-maintenance deployment platform.

---

# 18. Development Philosophy

The project should follow:

> **Simple architecture. Strong foundations. Progressive complexity.**

The development process should be:

```text
BUILD
  │
  ▼
TEST
  │
  ▼
VALIDATE
  │
  ▼
LEARN
  │
  ▼
IMPROVE
  │
  ▼
EXPAND
```

Not:

```text
IMAGINE EVERYTHING
        │
        ▼
BUILD EVERYTHING
        │
        ▼
DISCOVER MOST OF IT
WAS NEVER NEEDED
```

---

# 19. Version Evolution Rules

The following rule is critical.

## End Goal

The long-term vision is:

> Develop meaningful tourism research and intelligence infrastructure capable of supporting evidence-based tourism development.

---

## Current Authorization

The current implementation authorization is:

> **VERSION 1 ONLY**

---

## Architectural Responsibility

Engineers must:

> Build Version 1 without creating unnecessary architectural constraints that make future Versions 2 and 3 unnecessarily difficult.

---

## Explicit Rule

Future requirements should influence:

- Database flexibility.
- Naming.
- Module boundaries.
- Stable identifiers.
- Access boundaries.

Future requirements should NOT automatically result in:

- Future UI.
- Future workflows.
- Future services.
- Future dashboards.
- Future infrastructure.

---

# 20. Long-Term Product Vision Summary

The product journey is:

```text
TODAY
────────────────────────────────────

VERSION 1

African Tourism Research MVP

Professional Survey Collection
+
Automatic Response Storage
+
Admin Dashboard
+
Analytics
+
Shareable Survey Links


            │
            │ VALIDATE
            ▼


NEXT
────────────────────────────────────

VERSION 2

Tourism Research &
Programme Intelligence

Multiple Studies
+
Research Management
+
Advanced Analytics
+
Data Exports
+
Research Templates


            │
            │ EXPAND
            ▼


FUTURE
────────────────────────────────────

VERSION 3

Tourism Intelligence &
Development Platform

Geographic Intelligence
+
Tourism Trends
+
AI-Assisted Insights
+
Automated Reports
+
Programme Monitoring
+
Development Intelligence
```

---

# 21. Instructions for Engineers and AI Coding Agents

This document defines the product direction.

The AI coding agent must understand the difference between:

```text
LONG-TERM PRODUCT VISION
```

and:

```text
CURRENT IMPLEMENTATION SCOPE
```

---

## Current Scope

Build:

> **VERSION 1 ONLY**

---

## Do Not

Do not:

- Implement Version 2.
- Implement Version 3.
- Build speculative features.
- Build a generic SurveyMonkey clone.
- Build multi-tenancy.
- Build complex enterprise infrastructure.
- Build AI systems prematurely.
- Build geographic intelligence prematurely.
- Build microservices unnecessarily.

---

## Do

Do:

- Build Version 1 professionally.
- Build for real data.
- Use an extensible survey data model.
- Secure administrative access.
- Protect research data.
- Implement survey sharing properly.
- Implement copy-link functionality.
- Make the public experience trustworthy.
- Make the dashboard useful.
- Test rigorously.
- Keep infrastructure maintainable.
- Follow the repository's engineering standards.

---

# Final Product Principle

> **Build the smallest version that completely solves the current research problem, while ensuring that the foundation does not prevent the larger tourism intelligence vision from evolving later.**

Version 1 should not be a disposable prototype.

It should be a focused, production-quality foundation.

But it must remain focused.

The goal is not to build everything.

The goal is to build the right thing first.
