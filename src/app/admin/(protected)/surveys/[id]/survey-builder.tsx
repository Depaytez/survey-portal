"use client";

import { useState } from "react";
import type { AdminSurveyDetail } from "@/lib/supabase/queries/survey-admin";
import { SectionCard, SectionForm } from "./section-card";
import { secondaryButtonClass } from "@/lib/ui";

export function SurveyBuilder({ survey }: { survey: AdminSurveyDetail }) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  function toggleSection(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allCollapsed = survey.sections.length > 0 && collapsedIds.size === survey.sections.length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Sections &amp; Questions
        </h2>
        {survey.sections.length > 1 ? (
          <button
            type="button"
            onClick={() =>
              setCollapsedIds(
                allCollapsed ? new Set() : new Set(survey.sections.map((s) => s.id)),
              )
            }
            className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            {allCollapsed ? "Expand all" : "Collapse all"}
          </button>
        ) : null}
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
            isExpanded={!collapsedIds.has(section.id)}
            onToggleExpanded={() => toggleSection(section.id)}
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
