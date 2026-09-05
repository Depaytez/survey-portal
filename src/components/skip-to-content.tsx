/**
 * Invisible until focused, then jumps keyboard/screen-reader users straight
 * to #main-content — skips the header/nav that's otherwise the first stop
 * on every single page. Must be the first focusable element in the DOM.
 */
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to content
    </a>
  );
}
