import type { Metadata } from "next";
import { StakeholderForm } from "./stakeholder-form";

export const metadata: Metadata = {
  title: "Partner With Us — African Tourism Research Platform",
};

export default function StakeholderInterestPage() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Partner With Us
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Tourism organizations, researchers, and investors interested in the
        African Tourism Research Initiative can share their interest below.
      </p>
      <div className="mt-8">
        <StakeholderForm />
      </div>
    </main>
  );
}
