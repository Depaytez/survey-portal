import Link from "next/link";
import { secondaryButtonClass, panelClass } from "@/lib/ui";

const MESSAGES = {
  CLOSED:
    "This survey is now closed and is no longer accepting responses. Thank you to everyone who took part — your input helps shape better tourism experiences across Africa.",
  ARCHIVED:
    "This research study has concluded and its survey is no longer available. Thank you to everyone who took part — your input helps shape better tourism experiences across Africa.",
};

export function SurveyClosed({
  title,
  status = "CLOSED",
}: {
  title: string;
  status?: keyof typeof MESSAGES;
}) {
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className={`${panelClass} text-center`}>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">{MESSAGES[status]}</p>
        <Link href="/" className={`mt-8 inline-block ${secondaryButtonClass}`}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
