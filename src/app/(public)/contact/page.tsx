import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { panelClass } from "@/lib/ui";

export const metadata: Metadata = {
  title: "Contact — African Tourism Research Platform",
};

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-16">
      <div className={panelClass}>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Contact Us
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Have a question, an issue with the survey, or feedback for the
          research team? Send us a message below.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
