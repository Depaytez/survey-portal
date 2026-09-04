import Image from "next/image";
import { AnkaraMotifs } from "./ankara-motifs";

/**
 * A fixed, viewport-covering, purely decorative background image with a
 * translucent scrim (and a few minimal floating accent shapes) on top —
 * both the public site and the admin tool scroll over it.
 *
 * Implementation notes:
 * - Uses `position: fixed` on the wrapper, NOT the CSS `background-attachment:
 *   fixed` property. The latter is well known to be unreliable on mobile
 *   Safari/iOS (it's frequently ignored, effectively falling back to
 *   `scroll`); a fixed-position element behind everything else works
 *   consistently across browsers and devices.
 * - `aria-hidden` + `alt=""`: the image is decorative, not informational —
 *   screen readers should skip it entirely (WCAG 1.1.1).
 * - The overlay reuses the same light/dark background token as the rest of
 *   the site, so it automatically "fogs" the photo white in light mode /
 *   dark in dark mode. This is the same technique W3C's own guidance
 *   (WCAG Technique G18) gives as the standard way to guarantee
 *   text-over-image contrast: lighten/darken the image behind text rather
 *   than relying on the photo's own unpredictable content.
 * - `variant="public"` (default) uses a 70%-opaque scrim — the lowest
 *   opacity that keeps zinc-600-and-darker body text above the 4.5:1 WCAG
 *   AA minimum even in the theoretical worst case of a pure-black pixel
 *   directly behind the text.
 * - `variant="admin"` uses a stronger 80%-opaque scrim — the admin tool is
 *   data-dense (tables, forms), so it favors a calmer, more legible surface
 *   while still visibly picking up the photo/palette.
 * - Neither variant is safe for colored text (`text-primary`/`text-accent`)
 *   sitting directly on it — those need roughly 89%+ opacity to clear
 *   4.5:1 on their own, which would defeat the point of a visible photo.
 *   Colored text/badges must always sit on a solid or near-solid surface
 *   (a card, `panelClass`, or an opaque pill) instead, on both variants.
 */
export function SiteBackground({ variant = "public" }: { variant?: "public" | "admin" }) {
  const overlayClass = variant === "admin" ? "bg-background/80" : "bg-background/70";

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className={`absolute inset-0 ${overlayClass}`} />
      <AnkaraMotifs />
    </div>
  );
}
