import Image from "next/image";

/**
 * A fixed, viewport-covering, purely decorative background image with a
 * translucent scrim on top — the whole public site's content scrolls over
 * it.
 *
 * Implementation notes:
 * - Uses `position: fixed` on the wrapper, NOT the CSS `background-attachment:
 *   fixed` property. The latter is well known to be unreliable on mobile
 *   Safari/iOS (it's frequently ignored, effectively falling back to
 *   `scroll`); a fixed-position element behind everything else works
 *   consistently across browsers and devices.
 * - `aria-hidden` + `alt=""`: the image is decorative, not informational —
 *   screen readers should skip it entirely (WCAG 1.1.1).
 * - The overlay (`bg-background/85`) reuses the same light/dark background
 *   token as the rest of the site, so it automatically "fogs" the photo
 *   white in light mode / dark in dark mode. This is the same technique
 *   W3C's own guidance (WCAG Technique G18) gives as the standard way to
 *   guarantee text-over-image contrast: lighten/darken the image behind
 *   text rather than relying on the photo's own unpredictable content.
 */
export function SiteBackground() {
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
      <div className="absolute inset-0 bg-background/85" />
    </div>
  );
}
