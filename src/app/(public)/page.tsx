import Link from "next/link";
import { getListedPublicSurveys } from "@/lib/supabase/queries/surveys";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/ui";

export default async function Home() {
  const surveys = await getListedPublicSurveys();

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-20 text-center sm:py-28">
        <span className="mx-auto inline-flex items-center rounded-full bg-background px-3 py-1 text-sm font-semibold uppercase tracking-wide text-accent shadow-sm">
          African Tourism Research Initiative
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
          Understanding what travelers want from Africa
        </h1>
        <p className="mx-auto max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
          Before tourism development decisions can be made, reliable data and
          insights must be collected and understood. This platform gathers
          structured research directly from travelers to help shape better
          tourism experiences across Africa, starting with South Western
          Nigeria.
        </p>
        <div className="mx-auto flex flex-col gap-3 sm:flex-row">
          <Link href="#participate" className={primaryButtonClass}>
            Take the Survey
          </Link>
          <Link href="/stakeholder-interest" className={secondaryButtonClass}>
            Partner With Us
          </Link>
        </div>
      </section>

      {/* Purpose */}
      <section>
        <div className="mx-auto grid max-w-5xl gap-4 px-6 py-16 sm:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-background/85 p-5 backdrop-blur-sm dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Why this research matters
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Tourism development decisions made without evidence rely on
              assumptions, anecdotes, and fragmented reports instead of real
              traveler expectations.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-background/85 p-5 backdrop-blur-sm dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              What we&apos;re learning
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Traveler interests, planning preferences, budget expectations,
              concerns, and what would make an African trip easier to plan
              and enjoy.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-background/85 p-5 backdrop-blur-sm dark:border-zinc-800">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              How it&apos;s used
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Responses are analysed to help tourism organizations design
              better experiences and support evidence-based tourism
              development.
            </p>
          </div>
        </div>
      </section>

      {/* Participate */}
      <section id="participate" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Open Research Studies
        </h2>
        {surveys.length === 0 ? (
          <p className="mt-4 max-w-prose text-sm text-zinc-600 dark:text-zinc-400">
            No research study is currently open for participation. Check
            back soon, or{" "}
            <Link href="/contact" className="underline underline-offset-2">
              contact us
            </Link>{" "}
            to be notified when one launches.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {surveys.map((survey) => (
              <li
                key={survey.slug}
                className="rounded-lg border border-zinc-200 bg-background/85 p-5 backdrop-blur-sm dark:border-zinc-800"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {survey.shortTitle ?? survey.title}
                </h3>
                {survey.shortDescription ? (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {survey.shortDescription}
                  </p>
                ) : null}
                <div className="mt-4 flex items-center justify-between">
                  {survey.estimatedDuration ? (
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {survey.estimatedDuration}
                    </span>
                  ) : (
                    <span />
                  )}
                  <Link
                    href={`/survey/${survey.slug}`}
                    className="text-sm font-medium text-primary underline underline-offset-2"
                  >
                    Take the survey
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Get involved */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-16 sm:grid-cols-2">
          <div className="rounded-lg border border-zinc-200 bg-background/85 p-6 backdrop-blur-sm dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Have a question or an issue?
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Reach out to the research team directly.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-2"
            >
              Contact us
            </Link>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-background/85 p-6 backdrop-blur-sm dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Represent a tourism organization?
            </h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Tell us about partnership, research collaboration, or
              investment interest.
            </p>
            <Link
              href="/stakeholder-interest"
              className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-2"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
