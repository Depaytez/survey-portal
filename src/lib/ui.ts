// Shared class strings for the brand palette (green primary / brown accent /
// black-zinc neutrals, see src/app/globals.css). Centralized because these
// were previously duplicated verbatim across every form and CTA — a single
// definition here is what keeps new pages from drifting to ad hoc colors.

export const primaryButtonClass =
  "rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-60";

// bg-background (fully opaque) is deliberate, not decorative: text-accent
// only clears WCAG 4.5:1 against a solid backing — the fixed background
// photo's scrim isn't opaque enough on its own (see SiteBackground's
// contrast notes). A transparent-background version of this button
// sitting directly over the photo silently failed contrast for a while;
// don't reintroduce that by dropping this background.
export const secondaryButtonClass =
  "rounded-md border border-accent bg-background px-5 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40";

// Compact action buttons used throughout the admin survey builder (move/
// edit/delete/save/cancel). min-h/min-w give a real ~36px touch target
// (comfortably over WCAG 2.5.8's 24px minimum) even for single-character
// buttons like the reorder arrows, without visually ballooning
// text-labeled buttons like "Edit"/"Delete".
export const iconButtonClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800";

export const inputClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-primary dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";

// Content surface used on public pages that sit over the fixed background
// photo (see SiteBackground) — opaque enough that body text always clears
// WCAG 1.4.3 regardless of what's behind it, per W3C technique G18's own
// example of "fogging" an image behind text rather than placing text
// directly on unpredictable image content.
export const panelClass =
  "rounded-lg border border-zinc-200 bg-background/90 p-8 shadow-sm backdrop-blur-sm dark:border-zinc-800";

// The admin tool's standard white card — was hand-typed identically across
// 7+ admin pages before being centralized here.
export const adminCardClass =
  "rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";

// "Nothing here yet" placeholder, used wherever a list can legitimately be
// empty (no surveys, no responses, no requests).
export const emptyStateClass =
  "rounded-lg border border-dashed border-zinc-300 bg-white/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60";

// A simple bordered list of rows (survey list, dashboard's recent items),
// each row separated by a divider rather than its own card.
export const dividedListClass =
  "divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950";
