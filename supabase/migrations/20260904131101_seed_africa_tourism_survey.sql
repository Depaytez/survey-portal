-- Seed the real "Africa Tourism Expectations Survey" questionnaire as
-- structured data (per docs/seed-survey-form.md). Idempotent: safe to run
-- again — every insert upserts on its natural key (slug / section_key /
-- question_key / option value) rather than creating duplicates, and an
-- existing survey's `status` is left untouched so re-running this never
-- reverts a survey an administrator has already published.
--
-- The survey is seeded as DRAFT and is never auto-published.

do $$
declare
  v_survey_id uuid;
  v_section_id uuid;
  v_question_id uuid;
begin
  -- -------------------------------------------------------------------
  -- Survey
  -- -------------------------------------------------------------------
  insert into public.surveys (
    slug, title, short_title, description, estimated_duration,
    welcome_title, welcome_description, completion_title, completion_description,
    consent_text, contact_privacy_notice, metadata
  )
  values (
    'africa-tourism-expectations-survey',
    'Africa Tourism Expectations Survey',
    'Africa Tourism Survey',
    'We''re excited to learn about your expectations and dreams of visiting Africa. This survey helps tourism organizations understand what travelers are looking for, so better tourism experiences can be designed around their interests.',
    '10-15 minutes',
    'Welcome to the Africa Tourism Survey',
    'Your responses are valuable and will help shape better tourism services and experiences across Africa.',
    'Thank You!',
    'Thank you for taking the time to share your expectations and dreams about visiting Africa. Your feedback is valuable to tourism organizations working to create better tourism experiences.',
    'I agree to participate in this survey and understand my data will be used for tourism research.',
    'Your email will only be used for tourism-related communications where you have chosen to receive updates. You can unsubscribe at any time.',
    '{"category":"tourism_research","geography":"Africa","version":"1.0","source":"Original African Tourism Survey Questionnaire"}'::jsonb
  )
  on conflict (slug) do update set
    title = excluded.title,
    short_title = excluded.short_title,
    description = excluded.description,
    estimated_duration = excluded.estimated_duration,
    welcome_title = excluded.welcome_title,
    welcome_description = excluded.welcome_description,
    completion_title = excluded.completion_title,
    completion_description = excluded.completion_description,
    consent_text = excluded.consent_text,
    contact_privacy_notice = excluded.contact_privacy_notice,
    metadata = excluded.metadata
  returning id into v_survey_id;

  -- -------------------------------------------------------------------
  -- Section 0 — Participant Access & Consent
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, display_order)
  values (v_survey_id, 'participant_access', 'Participant Access & Consent', 0)
  on conflict (survey_id, section_key) do update set
    title = excluded.title, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, description,
    is_required, display_order, configuration, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'email_address', 'email', 'Email Address',
    'We''ll use this for survey authentication and future contact if you opt in.',
    true, 1, '{}'::jsonb,
    '{"enabled":false,"sensitive":true,"personallyIdentifiable":true}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, description = excluded.description,
    is_required = excluded.is_required, display_order = excluded.display_order,
    configuration = excluded.configuration, analytics_config = excluded.analytics_config;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, description,
    placeholder, is_required, display_order, configuration, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'survey_code', 'short_text', 'Create a Survey Code',
    'This helps you return to your survey if needed.',
    'Create a simple code (e.g., Safari2024)',
    true, 2, '{"minLength":3,"maxLength":100}'::jsonb,
    '{"enabled":false,"sensitive":false,"personallyIdentifiable":false}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, description = excluded.description, placeholder = excluded.placeholder,
    is_required = excluded.is_required, display_order = excluded.display_order,
    configuration = excluded.configuration, analytics_config = excluded.analytics_config;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title,
    is_required, display_order, configuration, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'research_consent', 'boolean',
    'I agree to participate in this survey and understand my data will be used for tourism research.',
    true, 3, '{"mustBeTrue":true}'::jsonb, '{"enabled":false}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, is_required = excluded.is_required,
    display_order = excluded.display_order, configuration = excluded.configuration,
    analytics_config = excluded.analytics_config;

  -- -------------------------------------------------------------------
  -- Section 1 — About You
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'participant_profile', 'About You',
    'Every traveler brings unique perspectives and experiences. We would like to understand a little about you.',
    1
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, placeholder,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'participant_initials', 'short_text', 'Your Initials',
    'e.g., JMS', true, 1, '{"enabled":false,"personallyIdentifiable":true}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, placeholder = excluded.placeholder,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, placeholder,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'participant_country', 'short_text', 'What country are you from?',
    'e.g., Canada, Germany, Australia', true, 2,
    '{"enabled":true,"category":"demographics","visualizationPriority":"high"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, placeholder = excluded.placeholder,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'age_group', 'single_choice', 'Your Age Group',
    true, 3,
    '{"enabled":true,"category":"demographics","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, is_required = excluded.is_required,
    display_order = excluded.display_order, analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, '18_25', '18-25', 1),
    (v_question_id, '26_35', '26-35', 2),
    (v_question_id, '36_45', '36-45', 3),
    (v_question_id, '46_55', '46-55', 4),
    (v_question_id, '56_65', '56-65', 5),
    (v_question_id, '66_plus', '66+', 6)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title,
    is_required, display_order, configuration, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'african_tourism_interest', 'rating', 'Your Interest in African Tourism',
    true, 4, '{"minimum":1,"maximum":5}'::jsonb,
    '{"enabled":true,"category":"interest_level","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, is_required = excluded.is_required,
    display_order = excluded.display_order, configuration = excluded.configuration,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, '1', 'Very Low', 1),
    (v_question_id, '2', 'Low', 2),
    (v_question_id, '3', 'Neutral', 3),
    (v_question_id, '4', 'High', 4),
    (v_question_id, '5', 'Very High', 5)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, placeholder,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'latest_vacation_destination', 'short_text',
    'Where was your latest vacation destination?', 'e.g., Paris, Tokyo, Caribbean Islands',
    true, 5, '{"enabled":true,"category":"travel_history","visualizationPriority":"medium"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, placeholder = excluded.placeholder,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config;

  -- -------------------------------------------------------------------
  -- Section 2 — Your Interests
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'tourism_interests', 'Your Interests',
    'Help us understand what aspects of Africa are most interesting to potential visitors.',
    2
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title, description,
    is_required, display_order, configuration, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'african_tourism_interests', 1, 'multiple_choice',
    'What interests you the most about visiting Africa?', 'Please choose your top three interests.',
    true, 1, '{"minSelections":3,"maxSelections":3}'::jsonb,
    '{"enabled":true,"category":"tourism_interests","visualizationPriority":"highest","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title, description = excluded.description,
    is_required = excluded.is_required, display_order = excluded.display_order,
    configuration = excluded.configuration, analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, description, display_order) values
    (v_question_id, 'history_heritage', 'History & Heritage', 'Time-honoured festivals, historic sites, and deep-rooted traditions', 1),
    (v_question_id, 'contemporary_arts_fashion', 'Contemporary Arts & Fashion', 'Modern museums, galleries, African contemporary art, and fashion culture', 2),
    (v_question_id, 'cultural_immersion', 'Cultural Immersion', 'Local food, languages, and everyday community life', 3),
    (v_question_id, 'adventure_exploration', 'Adventure & Exploration', 'Nature, beaches, wildlife, and diverse landscapes', 4),
    (v_question_id, 'entertainment_nightlife', 'Entertainment & Nightlife', 'Music, nightlife, and social events', 5)
  on conflict (question_id, value) do update set
    label = excluded.label, description = excluded.description, display_order = excluded.display_order;

  -- -------------------------------------------------------------------
  -- Section 3 — Travel Planning & Logistics
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'travel_planning', 'Travel Planning & Logistics',
    'Tell us how you prefer tourism experiences to be organized.', 3
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'tour_organization_preference', 2, 'single_choice',
    'How would you prefer tours and attractions to be organized?',
    true, 1,
    '{"enabled":true,"category":"travel_planning","visualizationPriority":"high","recommendedVisualization":"pie_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, description, display_order) values
    (v_question_id, 'all_inclusive_package', 'All-inclusive package', 'Air tickets, accommodation, tours and transport all included', 1),
    (v_question_id, 'flights_accommodation_arrival', 'Flights & Accommodation', 'Then tours and transport tickets paid on arrival', 2),
    (v_question_id, 'flights_accommodation_payg', 'Flights & Accommodation', 'Then pay-as-you-go tours and transport', 3),
    (v_question_id, 'flights_accommodation_independent', 'Flights & Accommodation', 'Then independent transport and tours', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, description = excluded.description, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'country_exploration_preference', 3, 'single_choice',
    'How do you prefer to explore a new country?',
    true, 2,
    '{"enabled":true,"category":"travel_style","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'guided_tours', 'Guided tours with local experts', 1),
    (v_question_id, 'mixed_guided_independent', 'A mix of guided and independent', 2),
    (v_question_id, 'fully_independent', 'Fully independent', 3),
    (v_question_id, 'curated_cultural_experiences', 'Company curated cultural experiences', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'ideal_stay_duration', 4, 'single_choice',
    'How long would you ideally like to stay?',
    true, 3,
    '{"enabled":true,"category":"travel_duration","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'less_than_one_week', 'Less than one week', 1),
    (v_question_id, 'one_to_two_weeks', '1-2 weeks', 2),
    (v_question_id, 'three_to_four_weeks', '3-4 weeks', 3),
    (v_question_id, 'more_than_one_month', 'More than one month', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  -- -------------------------------------------------------------------
  -- Section 4 — Budget & Accommodation
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'budget_accommodation', 'Budget & Accommodation',
    'Help us understand your expectations around pricing, payments, and accommodation.', 4
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'pricing_payment_importance', 5, 'single_choice',
    'How important are pricing and payment options?',
    true, 1,
    '{"enabled":true,"category":"pricing","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, description, display_order) values
    (v_question_id, 'very_important', 'Very important', 'I need clear prices and flexible payment methods', 1),
    (v_question_id, 'somewhat_important', 'Somewhat important', 'I compare prices before deciding', 2),
    (v_question_id, 'not_very_important', 'Not very important', 'Experience matters more than cost', 3),
    (v_question_id, 'not_sure', 'Not sure', 'I would need more information first', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, description = excluded.description, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'accommodation_preference', 6, 'single_choice',
    'What type of accommodation would you prefer?',
    true, 2,
    '{"enabled":true,"category":"accommodation","visualizationPriority":"highest","recommendedVisualization":"pie_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'luxury_hotel', 'Luxury hotel', 1),
    (v_question_id, 'budget_hotel_guesthouse', 'Budget hotel or Guesthouse', 2),
    (v_question_id, 'airbnb_serviced_apartment', 'Airbnb or serviced apartment', 3),
    (v_question_id, 'local_hosts', 'Staying with local hosts', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, placeholder,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'accommodation_additional_comments', 'long_text',
    'Additional Comments or Suggestions', 'Share any special accommodation preferences...',
    false, 3, '{"enabled":true,"category":"qualitative_feedback","visualizationPriority":"low"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, placeholder = excluded.placeholder,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config;

  -- -------------------------------------------------------------------
  -- Section 5 — Addressing Your Concerns
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'travel_concerns', 'Addressing Your Concerns',
    'Understanding concerns and challenges is important for building better tourism experiences.', 5
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'travel_concerns', 7, 'single_choice',
    'What concerns might discourage you from visiting Africa?',
    true, 1,
    '{"enabled":true,"category":"travel_barriers","visualizationPriority":"highest","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, description, display_order) values
    (v_question_id, 'safety_security', 'Safety and security', null, 1),
    (v_question_id, 'infrastructure', 'Infrastructure', 'Power, roads, transport', 2),
    (v_question_id, 'health_hygiene', 'Health or hygiene concerns', null, 3),
    (v_question_id, 'none', 'None', 'I feel confident visiting', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, description = excluded.description, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'practical_travel_challenges', 8, 'single_choice',
    'Which practical challenge worries you most?',
    true, 2,
    '{"enabled":true,"category":"practical_challenges","visualizationPriority":"highest","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'transport_navigation', 'Transportation and navigation', 1),
    (v_question_id, 'accommodation_quality', 'Accommodation quality', 2),
    (v_question_id, 'budgeting_costs', 'Budgeting and travel costs', 3),
    (v_question_id, 'access_information', 'Access to reliable information', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title, placeholder,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'concerns_additional_comments', 'long_text',
    'Additional Comments or Suggestions', 'Share any specific concerns or suggestions...',
    false, 3, '{"enabled":true,"category":"qualitative_feedback","visualizationPriority":"low"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, placeholder = excluded.placeholder,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config;

  -- -------------------------------------------------------------------
  -- Section 6 — Planning Preferences
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'planning_preferences', 'Planning Preferences',
    'Tell us what would make planning and experiencing an African trip easier and more enjoyable.', 6
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'seamless_trip_planning', 9, 'single_choice',
    'What would make your trip-planning experience seamless?',
    true, 1,
    '{"enabled":true,"category":"trip_planning","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'travel_guides_insights', 'Comprehensive travel guides and local insights', 1),
    (v_question_id, 'trusted_local_hosts', 'Connecting with trusted local hosts or professional tour guides', 2),
    (v_question_id, 'traveler_recommendations', 'Inspiring recommendations and stories from fellow travellers', 3),
    (v_question_id, 'curated_itinerary', 'A curated, well-structured itinerary ready to go', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'travel_partner_qualities', 10, 'single_choice',
    'Which qualities do you look for in a travel partner?',
    true, 2,
    '{"enabled":true,"category":"service_expectations","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'financial_planning', 'Upfront, clear financial planning and payment choices', 1),
    (v_question_id, 'updates_itinerary', 'Prompt updates and an expertly structured itinerary', 2),
    (v_question_id, 'website_community', 'A polished website and an active, engaging online community', 3),
    (v_question_id, 'word_of_mouth', 'Strong word-of-mouth endorsements from trusted sources', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  insert into public.questions (
    survey_id, section_id, question_key, question_number, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'travel_company_recommendation_factor', 11, 'single_choice',
    'What would inspire you to recommend a travel company?',
    true, 3,
    '{"enabled":true,"category":"recommendation_drivers","visualizationPriority":"high","recommendedVisualization":"bar_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    question_number = excluded.question_number, title = excluded.title,
    is_required = excluded.is_required, display_order = excluded.display_order,
    analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, display_order) values
    (v_question_id, 'value_pricing', 'Exceptional value and affordable pricing', 1),
    (v_question_id, 'customer_care', 'Attentive and professional customer care and support', 2),
    (v_question_id, 'unique_activities', 'Unforgettable, unique activities that create lasting memories', 3),
    (v_question_id, 'seamless_organization', 'A seamless, secure, and flawlessly organized journey', 4)
  on conflict (question_id, value) do update set
    label = excluded.label, display_order = excluded.display_order;

  -- -------------------------------------------------------------------
  -- Section 7 — Stay Connected
  -- -------------------------------------------------------------------
  insert into public.survey_sections (survey_id, section_key, title, description, display_order)
  values (
    v_survey_id, 'contact_preferences', 'Stay Connected',
    'Let us know whether you would like to receive future tourism-related updates.', 7
  )
  on conflict (survey_id, section_key) do update set
    title = excluded.title, description = excluded.description, display_order = excluded.display_order
  returning id into v_section_id;

  insert into public.questions (
    survey_id, section_id, question_key, question_type, title,
    is_required, display_order, analytics_config
  )
  values (
    v_survey_id, v_section_id, 'contact_preference', 'single_choice',
    'Would you like to be contacted about new tourist attractions available in Africa?',
    true, 1,
    '{"enabled":true,"category":"marketing_consent","visualizationPriority":"medium","recommendedVisualization":"donut_chart"}'::jsonb
  )
  on conflict (survey_id, question_key) do update set
    title = excluded.title, is_required = excluded.is_required,
    display_order = excluded.display_order, analytics_config = excluded.analytics_config
  returning id into v_question_id;

  insert into public.question_options (question_id, value, label, description, display_order) values
    (v_question_id, 'yes', 'Yes, please!', 'Keep me updated on exciting new destinations and attractions', 1),
    (v_question_id, 'no', 'No, thank you', 'I prefer not to receive updates', 2),
    (v_question_id, 'maybe_later', 'Maybe later', 'I''ll decide after the survey', 3)
  on conflict (question_id, value) do update set
    label = excluded.label, description = excluded.description, display_order = excluded.display_order;

end $$;
