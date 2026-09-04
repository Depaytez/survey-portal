"use client";

import { useState } from "react";
import type { AdminSurveyDetail } from "@/lib/supabase/queries/survey-admin";
import { SectionCard, SectionForm } from "./section-card";
import { secondaryButtonClass } from "@/lib/ui";

export function SurveyBuilder({ survey }: { survey: AdminSurveyDetail }) {
  const [isAddingSection, setIsAddingSection] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Sections &amp; Questions
        </h2>
      </div>

      {survey.sections.length === 0 && !isAddingSection ? (
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          No sections yet. Add one to start building the questionnaire.
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-4">
        {survey.sections.map((section, index) => (
          <SectionCard
            key={section.id}
            surveyId={survey.id}
            section={section}
            isFirst={index === 0}
            isLast={index === survey.sections.length - 1}
          />
        ))}
      </div>

      <div className="mt-4">
        {isAddingSection ? (
          <SectionForm surveyId={survey.id} onDone={() => setIsAddingSection(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingSection(true)}
            className={secondaryButtonClass}
          >
            + Add Section
          </button>
        )}
      </div>
    </div>
  );
}
