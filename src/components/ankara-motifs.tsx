type Shape = {
  kind: "circle" | "diamond" | "triangle";
  size: number;
  color: string;
  top: string;
  left: string;
  duration: string;
  delay: string;
};

// Kept deliberately minimal: three large, low-opacity shapes, slow and
// gentle — a hint of Ankara-print geometry and color in the background,
// not a pattern competing with the page content.
const SHAPES: Shape[] = [
  { kind: "circle", size: 420, color: "var(--primary)", top: "-8%", left: "-6%", duration: "70s", delay: "0s" },
  { kind: "diamond", size: 260, color: "var(--accent)", top: "60%", left: "86%", duration: "80s", delay: "-15s" },
  { kind: "triangle", size: 220, color: "var(--accent-secondary)", top: "72%", left: "-8%", duration: "64s", delay: "-30s" },
];

function ShapeGraphic({ kind, size, color }: Pick<Shape, "kind" | "size" | "color">) {
  if (kind === "circle") {
    return (
      <div style={{ width: size, height: size, background: color, borderRadius: "9999px" }} />
    );
  }
  if (kind === "diamond") {
    return <div style={{ width: size, height: size, background: color, rotate: "45deg" }} />;
  }
  return (
    <div
      style={{
        width: 0,
        height: 0,
        borderLeft: `${size / 2}px solid transparent`,
        borderRight: `${size / 2}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
      }}
    />
  );
}

/**
 * Purely decorative floating shapes layered over the background photo.
 * Never interactive, never informational: `aria-hidden` + `pointer-events-none`
 * so they're invisible to assistive tech and never intercept clicks/taps.
 * Very low opacity and slow motion, and motion is disabled entirely under
 * `prefers-reduced-motion` (see globals.css).
 */
export function AnkaraMotifs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHAPES.map((shape, index) => (
        <div
          key={index}
          className="ankara-shape absolute opacity-[0.07]"
          style={{
            top: shape.top,
            left: shape.left,
            animationDuration: shape.duration,
            animationDelay: shape.delay,
          }}
        >
          <ShapeGraphic kind={shape.kind} size={shape.size} color={shape.color} />
        </div>
      ))}
    </div>
  );
}
