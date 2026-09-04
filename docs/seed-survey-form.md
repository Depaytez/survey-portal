# African Tourism Research Platform
# Version 1 — Seed Survey Form Definition

**File:** `seed-survey-form.ts`  
**Purpose:** Seed the initial African Tourism Expectations Survey into the application's database.

---

## 1. Purpose

This file defines the complete initial survey questionnaire for the **African Tourism Research & Intelligence Platform Version 1**.

The questionnaire originates from the existing African Tourism survey prototype provided by the research organization.

This seed is intended to create:

- One research survey
- Survey metadata
- Survey sections
- Survey questions
- Question options
- Question ordering
- Validation requirements
- Question configuration
- Analytics-friendly identifiers

The survey must be seeded as **structured data**.

Do NOT hardcode this questionnaire into frontend components.

The frontend survey engine should dynamically render the questionnaire from the database.

---

# 2. Seed Implementation Requirements

The implementing agent must adapt this definition to the actual database schema created for the project.

The conceptual relationship should be:

```text
Survey
│
├── Sections
│   │
│   └── Questions
│       │
│       └── Options
│
└── Responses
    │
    └── Answers
```

Recommended mapping:

```text
surveys
├── id
├── title
├── slug
├── description
├── status
├── estimated_duration
└── metadata

survey_sections
├── id
├── survey_id
├── title
├── description
├── order
└── metadata

questions
├── id
├── survey_id
├── section_id
├── question_key
├── question_text
├── question_type
├── required
├── order
└── configuration

question_options
├── id
├── question_id
├── value
├── label
├── description
└── order
```

The exact column names may differ depending on the database architecture.

However, the semantic relationships must remain intact.

---

# 3. Important Seeding Rules

## Idempotency

The seed operation should be safe to run multiple times.

Do NOT create duplicate surveys every time the seed runs.

Use a stable identifier such as:

```text
slug = "africa-tourism-expectations-survey"
```

Recommended behavior:

```text
IF survey exists
    UPDATE survey definition if appropriate
ELSE
    CREATE survey
```

The exact upsert strategy should respect the project's database conventions.

---

## Stable Question Keys

Every question must have a stable machine-readable key.

Examples:

```text
participant_country
age_group
african_tourism_interest
tourism_interests
tour_organization_preference
```

These keys must remain stable even if the question wording changes slightly in the future.

Do NOT use database-generated IDs as analytics identifiers.

---

## Question Ordering

The questionnaire order must match the research flow.

Store explicit numeric ordering.

Do not depend on insertion order.

---

## Option Ordering

All answer options must also have explicit ordering.

---

## Required Questions

Questions marked required in the original survey should remain required.

The survey engine must enforce:

```text
Frontend validation
+
Server-side validation
```

Do not rely exclusively on browser `required` attributes.

---

# 4. Survey Metadata

```ts
export const AFRICA_TOURISM_SURVEY = {
  title: "Africa Tourism Expectations Survey",

  slug: "africa-tourism-expectations-survey",

  shortTitle: "Africa Tourism Survey",

  status: "DRAFT",

  estimatedDuration: "10-15 minutes",

  description:
    "We're excited to learn about your expectations and dreams of visiting Africa. This survey helps tourism organizations understand what travelers are looking for, so better tourism experiences can be designed around their interests.",

  welcomeTitle: "Welcome to the Africa Tourism Survey",

  welcomeDescription:
    "Your responses are valuable and will help shape better tourism services and experiences across Africa.",

  completionTitle: "Thank You!",

  completionDescription:
    "Thank you for taking the time to share your expectations and dreams about visiting Africa. Your feedback is valuable to tourism organizations working to create better tourism experiences.",

  consentText:
    "I agree to participate in this survey and understand my data will be used for tourism research.",

  contactPrivacyNotice:
    "Your email will only be used for tourism-related communications where you have chosen to receive updates. You can unsubscribe at any time.",

  metadata: {
    category: "tourism_research",
    geography: "Africa",
    version: "1.0",
    source: "Original African Tourism Survey Questionnaire",
  },
};
```

---

# 5. Survey Sections

The survey should be divided into logical sections.

The initial structure is:

```text
0. Participant Access & Consent
1. About You
2. Your Interests
3. Travel Planning & Logistics
4. Budget & Accommodation
5. Addressing Your Concerns
6. Planning Preferences
7. Stay Connected
```

Recommended seed structure:

```ts
export const AFRICA_TOURISM_SECTIONS = [
  {
    key: "participant_access",
    title: "Participant Access & Consent",
    order: 0,
  },

  {
    key: "participant_profile",
    title: "About You",
    description:
      "Every traveler brings unique perspectives and experiences. We would like to understand a little about you.",
    order: 1,
  },

  {
    key: "tourism_interests",
    title: "Your Interests",
    description:
      "Help us understand what aspects of Africa are most interesting to potential visitors.",
    order: 2,
  },

  {
    key: "travel_planning",
    title: "Travel Planning & Logistics",
    description:
      "Tell us how you prefer tourism experiences to be organized.",
    order: 3,
  },

  {
    key: "budget_accommodation",
    title: "Budget & Accommodation",
    description:
      "Help us understand your expectations around pricing, payments, and accommodation.",
    order: 4,
  },

  {
    key: "travel_concerns",
    title: "Addressing Your Concerns",
    description:
      "Understanding concerns and challenges is important for building better tourism experiences.",
    order: 5,
  },

  {
    key: "planning_preferences",
    title: "Planning Preferences",
    description:
      "Tell us what would make planning and experiencing an African trip easier and more enjoyable.",
    order: 6,
  },

  {
    key: "contact_preferences",
    title: "Stay Connected",
    description:
      "Let us know whether you would like to receive future tourism-related updates.",
    order: 7,
  },
];
```

---

# 6. Complete Survey Questionnaire

---

## SECTION 0 — PARTICIPANT ACCESS & CONSENT

This section contains participant identification and research consent.

---

### Question: Email Address

```ts
{
  key: "email_address",

  type: "email",

  title: "Email Address",

  description:
    "We'll use this for survey authentication and future contact if you opt in.",

  required: true,

  order: 1,

  validation: {
    format: "email",
  },

  analytics: {
    enabled: false,
    sensitive: true,
    personallyIdentifiable: true,
  },
}
```

---

### Question: Survey Code

The original HTML prototype asks the participant to create a survey code.

This should be preserved in Version 1.

```ts
{
  key: "survey_code",

  type: "short_text",

  title: "Create a Survey Code",

  placeholder: "Create a simple code (e.g., Safari2024)",

  description:
    "This helps you identify or return to your survey if the workflow supports returning participants.",

  required: true,

  order: 2,

  validation: {
    minLength: 3,
    maxLength: 100,
  },

  analytics: {
    enabled: false,
    sensitive: false,
    personallyIdentifiable: false,
  },
}
```

---

### Question: Research Consent

```ts
{
  key: "research_consent",

  type: "boolean",

  title:
    "I agree to participate in this survey and understand my data will be used for tourism research.",

  required: true,

  order: 3,

  validation: {
    mustBeTrue: true,
  },

  analytics: {
    enabled: false,
  },
}
```

---

# SECTION 1 — ABOUT YOU

---

## Question: Participant Initials

```ts
{
  key: "participant_initials",

  type: "short_text",

  title: "Your Initials",

  placeholder: "e.g., JMS",

  description:
    "First, Middle, Last initials or First and Last initials.",

  required: true,

  order: 1,

  validation: {
    maxLength: 10,
  },

  analytics: {
    enabled: false,
    personallyIdentifiable: true,
  },
}
```

---

## Question: Country

```ts
{
  key: "participant_country",

  type: "short_text",

  title: "What country are you from?",

  placeholder: "e.g., Canada, Germany, Australia",

  required: true,

  order: 2,

  analytics: {
    enabled: true,
    category: "demographics",
    visualizationPriority: "high",
  },
}
```

---

## Question: Age Group

```ts
{
  key: "age_group",

  type: "single_choice",

  title: "Your Age Group",

  required: true,

  order: 3,

  options: [
    {
      value: "18_25",
      label: "18-25",
      order: 1,
    },

    {
      value: "26_35",
      label: "26-35",
      order: 2,
    },

    {
      value: "36_45",
      label: "36-45",
      order: 3,
    },

    {
      value: "46_55",
      label: "46-55",
      order: 4,
    },

    {
      value: "56_65",
      label: "56-65",
      order: 5,
    },

    {
      value: "66_plus",
      label: "66+",
      order: 6,
    },
  ],

  analytics: {
    enabled: true,
    category: "demographics",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question: Interest in African Tourism

```ts
{
  key: "african_tourism_interest",

  type: "rating",

  title: "Your Interest in African Tourism",

  required: true,

  order: 4,

  configuration: {
    minimum: 1,
    maximum: 5,
    scale: [
      {
        value: 1,
        label: "Very Low",
      },
      {
        value: 2,
        label: "Low",
      },
      {
        value: 3,
        label: "Neutral",
      },
      {
        value: 4,
        label: "High",
      },
      {
        value: 5,
        label: "Very High",
      },
    ],
  },

  analytics: {
    enabled: true,
    category: "interest_level",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question: Latest Vacation Destination

```ts
{
  key: "latest_vacation_destination",

  type: "short_text",

  title: "Where was your latest vacation destination?",

  placeholder: "e.g., Paris, Tokyo, Caribbean Islands",

  required: true,

  order: 5,

  analytics: {
    enabled: true,
    category: "travel_history",
    visualizationPriority: "medium",
  },
}
```

---

# SECTION 2 — YOUR INTERESTS

---

## Question 1

### What interests you the most about visiting Africa?

Instruction:

> Please choose your top three interests.

```ts
{
  key: "african_tourism_interests",

  questionNumber: 1,

  type: "multiple_choice",

  title: "What interests you the most about visiting Africa?",

  description: "Please choose your top three interests.",

  required: true,

  order: 1,

  configuration: {
    minSelections: 3,
    maxSelections: 3,
  },

  options: [
    {
      value: "history_heritage",
      label: "History & Heritage",
      description:
        "Time-honoured festivals, historic sites, and deep-rooted traditions",
      order: 1,
    },

    {
      value: "contemporary_arts_fashion",
      label: "Contemporary Arts & Fashion",
      description:
        "Modern museums, galleries, African contemporary art, and fashion culture",
      order: 2,
    },

    {
      value: "cultural_immersion",
      label: "Cultural Immersion",
      description:
        "Local food, languages, and everyday community life",
      order: 3,
    },

    {
      value: "adventure_exploration",
      label: "Adventure & Exploration",
      description:
        "Nature, beaches, wildlife, and diverse landscapes",
      order: 4,
    },

    {
      value: "entertainment_nightlife",
      label: "Entertainment & Nightlife",
      description:
        "Music, nightlife, and social events",
      order: 5,
    },
  ],

  analytics: {
    enabled: true,
    category: "tourism_interests",
    visualizationPriority: "highest",
    recommendedVisualization: "bar_chart",
  },
}
```

---

# SECTION 3 — TRAVEL PLANNING & LOGISTICS

---

## Question 2

### How would you prefer tours and attractions to be organized?

```ts
{
  key: "tour_organization_preference",

  questionNumber: 2,

  type: "single_choice",

  title:
    "How would you prefer tours and attractions to be organized?",

  required: true,

  order: 1,

  options: [
    {
      value: "all_inclusive_package",

      label: "All-inclusive package",

      description:
        "Air tickets, accommodation, tours and transport all included",

      order: 1,
    },

    {
      value: "flights_accommodation_then_arrival_tours",

      label: "Flights & Accommodation",

      description:
        "Then tours and transport tickets paid on arrival",

      order: 2,
    },

    {
      value: "flights_accommodation_pay_as_you_go",

      label: "Flights & Accommodation",

      description:
        "Then pay-as-you-go tours and transport",

      order: 3,
    },

    {
      value: "flights_accommodation_independent",

      label: "Flights & Accommodation",

      description:
        "Then independent transport and tours",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "travel_planning",
    visualizationPriority: "high",
    recommendedVisualization: "pie_chart",
  },
}
```

---

## Question 3

### How do you prefer to explore a new country?

```ts
{
  key: "country_exploration_preference",

  questionNumber: 3,

  type: "single_choice",

  title: "How do you prefer to explore a new country?",

  required: true,

  order: 2,

  options: [
    {
      value: "guided_tours",

      label: "Guided tours with local experts",

      order: 1,
    },

    {
      value: "mixed_guided_independent",

      label: "A mix of guided and independent",

      order: 2,
    },

    {
      value: "fully_independent",

      label: "Fully independent",

      order: 3,
    },

    {
      value: "curated_cultural_experiences",

      label: "Company curated cultural experiences",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "travel_style",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question 4

### How long would you ideally like to stay?

```ts
{
  key: "ideal_stay_duration",

  questionNumber: 4,

  type: "single_choice",

  title: "How long would you ideally like to stay?",

  required: true,

  order: 3,

  options: [
    {
      value: "less_than_one_week",

      label: "Less than one week",

      order: 1,
    },

    {
      value: "one_to_two_weeks",

      label: "1-2 weeks",

      order: 2,
    },

    {
      value: "three_to_four_weeks",

      label: "3-4 weeks",

      order: 3,
    },

    {
      value: "more_than_one_month",

      label: "More than one month",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "travel_duration",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

# SECTION 4 — BUDGET & ACCOMMODATION

---

## Question 5

### How important are pricing and payment options?

```ts
{
  key: "pricing_payment_importance",

  questionNumber: 5,

  type: "single_choice",

  title: "How important are pricing and payment options?",

  required: true,

  order: 1,

  options: [
    {
      value: "very_important",

      label: "Very important",

      description:
        "I need clear prices and flexible payment methods",

      order: 1,
    },

    {
      value: "somewhat_important",

      label: "Somewhat important",

      description:
        "I compare prices before deciding",

      order: 2,
    },

    {
      value: "not_very_important",

      label: "Not very important",

      description:
        "Experience matters more than cost",

      order: 3,
    },

    {
      value: "not_sure",

      label: "Not sure",

      description:
        "I would need more information first",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "pricing",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question 6

### What type of accommodation would you prefer?

```ts
{
  key: "accommodation_preference",

  questionNumber: 6,

  type: "single_choice",

  title: "What type of accommodation would you prefer?",

  required: true,

  order: 2,

  options: [
    {
      value: "luxury_hotel",

      label: "Luxury hotel",

      order: 1,
    },

    {
      value: "budget_hotel_guesthouse",

      label: "Budget hotel or Guesthouse",

      order: 2,
    },

    {
      value: "airbnb_serviced_apartment",

      label: "Airbnb or serviced apartment",

      order: 3,
    },

    {
      value: "local_hosts",

      label: "Staying with local hosts",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "accommodation",
    visualizationPriority: "highest",
    recommendedVisualization: "pie_chart",
  },
}
```

---

## Additional Accommodation Comments

```ts
{
  key: "accommodation_additional_comments",

  type: "long_text",

  title: "Additional Comments or Suggestions",

  placeholder:
    "Share any special accommodation preferences...",

  required: false,

  order: 3,

  analytics: {
    enabled: true,
    category: "qualitative_feedback",
    visualizationPriority: "low",
  },
}
```

---

# SECTION 5 — ADDRESSING YOUR CONCERNS

---

## Question 7

### What concerns might discourage you from visiting Africa?

```ts
{
  key: "travel_concerns",

  questionNumber: 7,

  type: "single_choice",

  title:
    "What concerns might discourage you from visiting Africa?",

  required: true,

  order: 1,

  options: [
    {
      value: "safety_security",

      label: "Safety and security",

      order: 1,
    },

    {
      value: "infrastructure",

      label: "Infrastructure",

      description:
        "Power, roads, transport",

      order: 2,
    },

    {
      value: "health_hygiene",

      label: "Health or hygiene concerns",

      order: 3,
    },

    {
      value: "none",

      label: "None",

      description:
        "I feel confident visiting",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "travel_barriers",
    visualizationPriority: "highest",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question 8

### Which practical challenge worries you most?

```ts
{
  key: "practical_travel_challenges",

  questionNumber: 8,

  type: "single_choice",

  title: "Which practical challenge worries you most?",

  required: true,

  order: 2,

  options: [
    {
      value: "transport_navigation",

      label: "Transportation and navigation",

      order: 1,
    },

    {
      value: "accommodation_quality",

      label: "Accommodation quality",

      order: 2,
    },

    {
      value: "budgeting_costs",

      label: "Budgeting and travel costs",

      order: 3,
    },

    {
      value: "access_information",

      label: "Access to reliable information",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "practical_challenges",
    visualizationPriority: "highest",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Additional Concerns Comments

```ts
{
  key: "concerns_additional_comments",

  type: "long_text",

  title: "Additional Comments or Suggestions",

  placeholder:
    "Share any specific concerns or suggestions...",

  required: false,

  order: 3,

  analytics: {
    enabled: true,
    category: "qualitative_feedback",
    visualizationPriority: "low",
  },
}
```

---

# SECTION 6 — PLANNING PREFERENCES

---

## Question 9

### What would make your trip-planning experience seamless?

```ts
{
  key: "seamless_trip_planning",

  questionNumber: 9,

  type: "single_choice",

  title:
    "What would make your trip-planning experience seamless?",

  required: true,

  order: 1,

  options: [
    {
      value: "travel_guides_insights",

      label: "Comprehensive travel guides and local insights",

      order: 1,
    },

    {
      value: "trusted_local_hosts",

      label:
        "Connecting with trusted local hosts or professional tour guides",

      order: 2,
    },

    {
      value: "traveler_recommendations",

      label:
        "Inspiring recommendations and stories from fellow travellers",

      order: 3,
    },

    {
      value: "curated_itinerary",

      label:
        "A curated, well-structured itinerary ready to go",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "trip_planning",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question 10

### Which qualities do you look for in a travel partner?

```ts
{
  key: "travel_partner_qualities",

  questionNumber: 10,

  type: "single_choice",

  title:
    "Which qualities do you look for in a travel partner?",

  required: true,

  order: 2,

  options: [
    {
      value: "financial_planning",

      label:
        "Upfront, clear financial planning and payment choices",

      order: 1,
    },

    {
      value: "updates_itinerary",

      label:
        "Prompt updates and an expertly structured itinerary",

      order: 2,
    },

    {
      value: "website_community",

      label:
        "A polished website and an active, engaging online community",

      order: 3,
    },

    {
      value: "word_of_mouth",

      label:
        "Strong word-of-mouth endorsements from trusted sources",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "service_expectations",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

## Question 11

### What would inspire you to recommend a travel company?

```ts
{
  key: "travel_company_recommendation_factor",

  questionNumber: 11,

  type: "single_choice",

  title:
    "What would inspire you to recommend a travel company?",

  required: true,

  order: 3,

  options: [
    {
      value: "value_pricing",

      label:
        "Exceptional value and affordable pricing",

      order: 1,
    },

    {
      value: "customer_care",

      label:
        "Attentive and professional customer care and support",

      order: 2,
    },

    {
      value: "unique_activities",

      label:
        "Unforgettable, unique activities that create lasting memories",

      order: 3,
    },

    {
      value: "seamless_organization",

      label:
        "A seamless, secure, and flawlessly organized journey",

      order: 4,
    },
  ],

  analytics: {
    enabled: true,
    category: "recommendation_drivers",
    visualizationPriority: "high",
    recommendedVisualization: "bar_chart",
  },
}
```

---

# SECTION 7 — STAY CONNECTED

---

## Contact Preference

### Would you like to be contacted about new tourist attractions available in Africa?

```ts
{
  key: "contact_preference",

  type: "single_choice",

  title:
    "Would you like to be contacted about new tourist attractions available in Africa?",

  required: true,

  order: 1,

  options: [
    {
      value: "yes",

      label: "Yes, please!",

      description:
        "Keep me updated on exciting new destinations and attractions",

      order: 1,
    },

    {
      value: "no",

      label: "No, thank you",

      description:
        "I prefer not to receive updates",

      order: 2,
    },

    {
      value: "maybe_later",

      label: "Maybe later",

      description:
        "I'll decide after the survey",

      order: 3,
    },
  ],

  analytics: {
    enabled: true,
    category: "marketing_consent",
    visualizationPriority: "medium",
    recommendedVisualization: "donut_chart",
  },
}
```

---

# 7. Complete Seed Object

The following represents the recommended complete structure for the agent to implement.

The agent may adapt field names to the actual schema.

```ts
export const africaTourismSurveySeed = {
  survey: {
    title: "Africa Tourism Expectations Survey",
    shortTitle: "Africa Tourism Survey",
    slug: "africa-tourism-expectations-survey",
    status: "DRAFT",

    estimatedDuration: "10-15 minutes",

    description:
      "We're excited to learn about your expectations and dreams of visiting Africa. This survey helps tourism organizations understand what travelers are looking for so better tourism experiences can be created.",

    metadata: {
      category: "tourism_research",
      geography: "Africa",
      version: "1.0",
    },
  },

  sections: [
    {
      key: "participant_access",
      title: "Participant Access & Consent",
      order: 0,

      questions: [
        {
          key: "email_address",
          type: "email",
          title: "Email Address",
          description:
            "We'll use this for survey authentication and future contact if you opt in.",
          required: true,
          order: 1,
        },

        {
          key: "survey_code",
          type: "short_text",
          title: "Create a Survey Code",
          description:
            "This helps you return to your survey if needed.",
          placeholder:
            "Create a simple code (e.g., Safari2024)",
          required: true,
          order: 2,
        },

        {
          key: "research_consent",
          type: "boolean",
          title:
            "I agree to participate in this survey and understand my data will be used for tourism research.",
          required: true,
          order: 3,
          configuration: {
            mustBeTrue: true,
          },
        },
      ],
    },

    {
      key: "participant_profile",
      title: "About You",
      order: 1,

      questions: [
        {
          key: "participant_initials",
          type: "short_text",
          title: "Your Initials",
          placeholder: "e.g., JMS",
          required: true,
          order: 1,
        },

        {
          key: "participant_country",
          type: "short_text",
          title: "What country are you from?",
          placeholder:
            "e.g., Canada, Germany, Australia",
          required: true,
          order: 2,
        },

        {
          key: "age_group",
          type: "single_choice",
          title: "Your Age Group",
          required: true,
          order: 3,

          options: [
            { value: "18_25", label: "18-25", order: 1 },
            { value: "26_35", label: "26-35", order: 2 },
            { value: "36_45", label: "36-45", order: 3 },
            { value: "46_55", label: "46-55", order: 4 },
            { value: "56_65", label: "56-65", order: 5 },
            { value: "66_plus", label: "66+", order: 6 },
          ],
        },

        {
          key: "african_tourism_interest",
          type: "rating",
          title: "Your Interest in African Tourism",
          required: true,
          order: 4,

          configuration: {
            minimum: 1,
            maximum: 5,
          },

          options: [
            {
              value: "1",
              label: "Very Low",
              order: 1,
            },
            {
              value: "2",
              label: "Low",
              order: 2,
            },
            {
              value: "3",
              label: "Neutral",
              order: 3,
            },
            {
              value: "4",
              label: "High",
              order: 4,
            },
            {
              value: "5",
              label: "Very High",
              order: 5,
            },
          ],
        },

        {
          key: "latest_vacation_destination",
          type: "short_text",
          title:
            "Where was your latest vacation destination?",
          placeholder:
            "e.g., Paris, Tokyo, Caribbean Islands",
          required: true,
          order: 5,
        },
      ],
    },

    {
      key: "tourism_interests",
      title: "Your Interests",
      order: 2,

      questions: [
        {
          key: "african_tourism_interests",
          questionNumber: 1,
          type: "multiple_choice",

          title:
            "What interests you the most about visiting Africa?",

          description:
            "Please choose your top three interests.",

          required: true,
          order: 1,

          configuration: {
            minSelections: 3,
            maxSelections: 3,
          },

          options: [
            {
              value: "history_heritage",
              label: "History & Heritage",
              description:
                "Time-honoured festivals, historic sites, and deep-rooted traditions",
              order: 1,
            },

            {
              value: "contemporary_arts_fashion",
              label: "Contemporary Arts & Fashion",
              description:
                "Modern museums, galleries, African contemporary art, and fashion culture",
              order: 2,
            },

            {
              value: "cultural_immersion",
              label: "Cultural Immersion",
              description:
                "Local food, languages, and everyday community life",
              order: 3,
            },

            {
              value: "adventure_exploration",
              label: "Adventure & Exploration",
              description:
                "Nature, beaches, wildlife, and diverse landscapes",
              order: 4,
            },

            {
              value: "entertainment_nightlife",
              label: "Entertainment & Nightlife",
              description:
                "Music, nightlife, and social events",
              order: 5,
            },
          ],
        },
      ],
    },

    {
      key: "travel_planning",
      title: "Travel Planning & Logistics",
      order: 3,

      questions: [
        {
          key: "tour_organization_preference",
          questionNumber: 2,
          type: "single_choice",

          title:
            "How would you prefer tours and attractions to be organized?",

          required: true,
          order: 1,

          options: [
            {
              value: "all_inclusive_package",
              label: "All-inclusive package",
              description:
                "Air tickets, accommodation, tours & transport all included",
              order: 1,
            },

            {
              value: "flights_accommodation_arrival",
              label: "Flights & Accommodation",
              description:
                "Then tours & transport tickets paid on arrival",
              order: 2,
            },

            {
              value: "flights_accommodation_payg",
              label: "Flights & Accommodation",
              description:
                "Then pay-as-you-go tours and transport",
              order: 3,
            },

            {
              value: "flights_accommodation_independent",
              label: "Flights & Accommodation",
              description:
                "Then independent transport & tours",
              order: 4,
            },
          ],
        },

        {
          key: "country_exploration_preference",
          questionNumber: 3,
          type: "single_choice",

          title:
            "How do you prefer to explore a new country?",

          required: true,
          order: 2,

          options: [
            {
              value: "guided_tours",
              label: "Guided tours with local experts",
              order: 1,
            },

            {
              value: "mixed_guided_independent",
              label: "A mix of guided and independent",
              order: 2,
            },

            {
              value: "fully_independent",
              label: "Fully independent",
              order: 3,
            },

            {
              value: "curated_cultural_experiences",
              label:
                "Company curated cultural experiences",
              order: 4,
            },
          ],
        },

        {
          key: "ideal_stay_duration",
          questionNumber: 4,
          type: "single_choice",

          title:
            "How long would you ideally like to stay?",

          required: true,
          order: 3,

          options: [
            {
              value: "less_than_one_week",
              label: "Less than one week",
              order: 1,
            },

            {
              value: "one_to_two_weeks",
              label: "1-2 weeks",
              order: 2,
            },

            {
              value: "three_to_four_weeks",
              label: "3-4 weeks",
              order: 3,
            },

            {
              value: "more_than_one_month",
              label: "More than one month",
              order: 4,
            },
          ],
        },
      ],
    },

    {
      key: "budget_accommodation",
      title: "Budget & Accommodation",
      order: 4,

      questions: [
        {
          key: "pricing_payment_importance",
          questionNumber: 5,
          type: "single_choice",

          title:
            "How important are pricing and payment options?",

          required: true,
          order: 1,

          options: [
            {
              value: "very_important",
              label: "Very important",
              description:
                "I need clear prices and flexible payment methods",
              order: 1,
            },

            {
              value: "somewhat_important",
              label: "Somewhat important",
              description:
                "I compare prices before deciding",
              order: 2,
            },

            {
              value: "not_very_important",
              label: "Not very important",
              description:
                "Experience matters more than cost",
              order: 3,
            },

            {
              value: "not_sure",
              label: "Not sure",
              description:
                "I would need more information first",
              order: 4,
            },
          ],
        },

        {
          key: "accommodation_preference",
          questionNumber: 6,
          type: "single_choice",

          title:
            "What type of accommodation would you prefer?",

          required: true,
          order: 2,

          options: [
            {
              value: "luxury_hotel",
              label: "Luxury hotel",
              order: 1,
            },

            {
              value: "budget_hotel_guesthouse",
              label:
                "Budget hotel or Guesthouse",
              order: 2,
            },

            {
              value: "airbnb_serviced_apartment",
              label:
                "Airbnb or serviced apartment",
              order: 3,
            },

            {
              value: "local_hosts",
              label:
                "Staying with local hosts",
              order: 4,
            },
          ],
        },

        {
          key: "accommodation_additional_comments",
          type: "long_text",

          title:
            "Additional Comments or Suggestions",

          placeholder:
            "Share any special accommodation preferences...",

          required: false,
          order: 3,
        },
      ],
    },

    {
      key: "travel_concerns",
      title: "Addressing Your Concerns",
      order: 5,

      questions: [
        {
          key: "travel_concerns",
          questionNumber: 7,
          type: "single_choice",

          title:
            "What concerns might discourage you from visiting Africa?",

          required: true,
          order: 1,

          options: [
            {
              value: "safety_security",
              label: "Safety and security",
              order: 1,
            },

            {
              value: "infrastructure",
              label: "Infrastructure",
              description:
                "Power, roads, transport",
              order: 2,
            },

            {
              value: "health_hygiene",
              label:
                "Health or hygiene concerns",
              order: 3,
            },

            {
              value: "none",
              label: "None",
              description:
                "I feel confident visiting",
              order: 4,
            },
          ],
        },

        {
          key: "practical_travel_challenges",
          questionNumber: 8,
          type: "single_choice",

          title:
            "Which practical challenge worries you most?",

          required: true,
          order: 2,

          options: [
            {
              value: "transport_navigation",
              label:
                "Transportation and navigation",
              order: 1,
            },

            {
              value: "accommodation_quality",
              label:
                "Accommodation quality",
              order: 2,
            },

            {
              value: "budgeting_costs",
              label:
                "Budgeting and travel costs",
              order: 3,
            },

            {
              value: "access_information",
              label:
                "Access to reliable information",
              order: 4,
            },
          ],
        },

        {
          key: "concerns_additional_comments",
          type: "long_text",

          title:
            "Additional Comments or Suggestions",

          placeholder:
            "Share any specific concerns or suggestions...",

          required: false,
          order: 3,
        },
      ],
    },

    {
      key: "planning_preferences",
      title: "Planning Preferences",
      order: 6,

      questions: [
        {
          key: "seamless_trip_planning",
          questionNumber: 9,
          type: "single_choice",

          title:
            "What would make your trip-planning experience seamless?",

          required: true,
          order: 1,

          options: [
            {
              value: "travel_guides_insights",
              label:
                "Comprehensive travel guides and local insights",
              order: 1,
            },

            {
              value: "trusted_local_hosts",
              label:
                "Connecting with trusted local hosts or professional tour guides",
              order: 2,
            },

            {
              value: "traveler_recommendations",
              label:
                "Inspiring recommendations and stories from fellow travellers",
              order: 3,
            },

            {
              value: "curated_itinerary",
              label:
                "A curated, well-structured itinerary ready to go",
              order: 4,
            },
          ],
        },

        {
          key: "travel_partner_qualities",
          questionNumber: 10,
          type: "single_choice",

          title:
            "Which qualities do you look for in a travel partner?",

          required: true,
          order: 2,

          options: [
            {
              value: "financial_planning",
              label:
                "Upfront, clear financial planning and payment choices",
              order: 1,
            },

            {
              value: "updates_itinerary",
              label:
                "Prompt updates and an expertly structured itinerary",
              order: 2,
            },

            {
              value: "website_community",
              label:
                "A polished website and an active, engaging online community",
              order: 3,
            },

            {
              value: "word_of_mouth",
              label:
                "Strong word-of-mouth endorsements from trusted sources",
              order: 4,
            },
          ],
        },

        {
          key:
            "travel_company_recommendation_factor",

          questionNumber: 11,

          type: "single_choice",

          title:
            "What would inspire you to recommend a travel company?",

          required: true,

          order: 3,

          options: [
            {
              value: "value_pricing",
              label:
                "Exceptional value and affordable pricing",
              order: 1,
            },

            {
              value: "customer_care",
              label:
                "Attentive and professional customer care and support",
              order: 2,
            },

            {
              value: "unique_activities",
              label:
                "Unforgettable, unique activities that create lasting memories",
              order: 3,
            },

            {
              value: "seamless_organization",
              label:
                "A seamless, secure, and flawlessly organized journey",
              order: 4,
            },
          ],
        },
      ],
    },

    {
      key: "contact_preferences",
      title: "Stay Connected",
      order: 7,

      questions: [
        {
          key: "contact_preference",

          type: "single_choice",

          title:
            "Would you like to be contacted about new tourist attractions available in Africa?",

          required: true,

          order: 1,

          options: [
            {
              value: "yes",
              label: "Yes, please!",
              description:
                "Keep me updated on exciting new destinations and attractions",
              order: 1,
            },

            {
              value: "no",
              label: "No, thank you",
              description:
                "I prefer not to receive updates",
              order: 2,
            },

            {
              value: "maybe_later",
              label: "Maybe later",
              description:
                "I'll decide after the survey",
              order: 3,
            },
          ],
        },
      ],
    },
  ],
};
```

---

# 8. Required Question Type Support

The survey engine must support at least these question types.

```ts
export type SurveyQuestionType =
  | "short_text"
  | "long_text"
  | "email"
  | "single_choice"
  | "multiple_choice"
  | "rating"
  | "boolean";
```

The implementation must NOT hardcode rendering based on specific question keys.

Instead:

```text
Question Type
      ↓
Generic Survey Question Renderer
      ↓
Appropriate Input Component
```

Example:

```text
single_choice
    ↓
Radio Group

multiple_choice
    ↓
Checkbox Group

rating
    ↓
Rating / Likert Scale

short_text
    ↓
Text Input

long_text
    ↓
Textarea

boolean
    ↓
Consent Checkbox
```

---

# 9. Response Storage Requirements

Responses should conceptually be stored like:

```text
Survey Response
│
├── Response Metadata
│   ├── response_id
│   ├── survey_id
│   ├── started_at
│   ├── submitted_at
│   └── completion_status
│
└── Answers
    │
    ├── question_id
    ├── option_id (when applicable)
    └── value
```

Do NOT create database columns such as:

```text
country
age
interest
interests
organization
exploration
duration
pricing
accommodation
concerns
challenges
seamless
partner
recommend
```

directly on the survey response table.

That would tightly couple the database to this specific questionnaire.

Instead use:

```text
survey_responses
```

and:

```text
response_answers
```

so future questionnaires can reuse the same survey engine.

---

# 10. Multiple Choice Answer Storage

Question 1 requires exactly three selections.

Do NOT serialize multiple selected answers into an unreliable comma-separated string.

Preferred conceptual model:

```text
Response
│
└── Answer
    │
    ├── Question: African Tourism Interests
    │
    ├── Selected Option:
    │     History & Heritage
    │
    ├── Selected Option:
    │     Cultural Immersion
    │
    └── Selected Option:
          Adventure & Exploration
```

The database implementation may represent this through:

- Multiple answer records, or
- Structured JSON where justified.

However, analytics queries should remain practical.

---

# 11. Sensitive Data Classification

The following data should be treated carefully:

| Field | Classification |
|---|---|
| Email Address | Personally Identifiable Information |
| Participant Initials | Potentially Identifiable Information |
| Survey Code | Private Response Identifier |
| Research Consent | Consent Record |
| Contact Preference | Communication Preference |

The analytics dashboard should NOT unnecessarily expose personally identifiable information in aggregate charts.

---

# 12. Recommended Analytics Mapping

The Version 1 dashboard should prioritize useful analytics.

## Demographics

- Responses by country
- Responses by age group
- Interest level distribution

## Tourism Interests

- Top African tourism interests
- Most popular interest categories

## Travel Preferences

- Preferred tour organization model
- Preferred exploration style
- Ideal trip duration

## Budget

- Importance of pricing
- Accommodation preferences

## Travel Barriers

- Major concerns
- Practical challenges

## Service Expectations

- Seamless planning expectations
- Travel partner qualities
- Recommendation drivers

## Engagement

- Contact preference distribution

---

# 13. Seed Status Requirement

The survey MUST initially be seeded as:

```text
DRAFT
```

Do NOT automatically publish the research survey during seeding.

Publishing must remain an intentional administrator action.

Expected lifecycle:

```text
DRAFT
   ↓
PUBLISHED
   ↓
HIDDEN
   ↓
CLOSED
   ↓
ARCHIVED
```

---

# 14. Survey Share URL

Once published, the survey should resolve to:

```text
/survey/africa-tourism-expectations-survey
```

The administration dashboard must provide:

```text
Public Survey URL

[ Copy Link ]

[ Open Survey ]
```

The seed slug must remain stable unless intentionally changed by an administrator.

---

# 15. Seeding Acceptance Criteria

Before declaring the seed implementation complete, verify:

### Survey

- [ ] Exactly one survey is created.
- [ ] The survey slug is unique.
- [ ] The survey defaults to `DRAFT`.

### Sections

- [ ] All sections are created.
- [ ] Section ordering is correct.

### Questions

- [ ] All participant questions are created.
- [ ] All 11 numbered research questions are created.
- [ ] Contact preference is created.
- [ ] Question ordering is correct.
- [ ] Question keys are unique.

### Options

- [ ] Every single-choice option is created.
- [ ] Every multiple-choice option is created.
- [ ] Rating scale options are correct.
- [ ] Option ordering is correct.

### Validation

- [ ] Required questions are correctly configured.
- [ ] Email validation is configured.
- [ ] Consent requires affirmative agreement.
- [ ] Question 1 requires exactly three selections.

### Idempotency

- [ ] Running the seed again does not create duplicates.

### Integrity

- [ ] Every question belongs to the correct section.
- [ ] Every option belongs to the correct question.
- [ ] No orphan records exist.

---

# 16. Agent Implementation Instruction

When implementing this seed:

1. First inspect the actual database schema.
2. Adapt this seed structure to the repository's established schema.
3. Do not redesign the database merely to match this document.
4. Preserve the questionnaire semantics.
5. Preserve question order.
6. Preserve option order.
7. Preserve required validation.
8. Use stable machine-readable identifiers.
9. Make the seed idempotent.
10. Run the project's database and verification checks.
11. Verify the seeded survey through the application's actual survey rendering flow.

The ultimate validation is:

```text
Seed Database
      ↓
Survey Appears in Admin
      ↓
Admin Opens Survey
      ↓
Survey Renders Dynamically
      ↓
All Sections Appear Correctly
      ↓
All Questions Appear Correctly
      ↓
All Options Appear Correctly
      ↓
Validation Works
      ↓
Survey Can Eventually Be Published
```

---

# Final Rule

This seed represents the **initial African Tourism research questionnaire**.

Do NOT modify the research questions, options, ordering, or meaning without explicit authorization.

If implementation requires technical normalization, normalize:

- identifiers
- database relationships
- configuration structure
- validation representation

but preserve the actual research instrument presented to respondents.