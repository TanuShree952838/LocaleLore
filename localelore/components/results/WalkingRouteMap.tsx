import type { WalkingRoute } from "@/lib/types";
import { formatDuration } from "@/lib/format";
import { FootprintsIcon } from "@/components/ui/Icon";

interface WalkingRouteMapProps {
  route: WalkingRoute;
}

export function WalkingRouteMap({ route }: WalkingRouteMapProps) {
  const waypoints = route.waypoints;
  const numWaypoints = waypoints.length;

  // Generate dynamic, perfectly aligned points on a 200x100 grid
  // This guarantees the SVG line matches the dot positions 100% of the time,
  // preventing visual misalignment or broken path strings.
  const points = waypoints.map((_, index) => {
    const x = 20 + index * (160 / Math.max(numWaypoints - 1, 1));
    const y = index % 2 === 0 ? 30 : 70;
    return { x, y };
  });

  // Construct the SVG path string: e.g., M 20,30 L 60,70 L 100,30...
  const pathD = points.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x},${p.y}` : `${path} L ${p.x},${p.y}`;
  }, "");

  return (
    <section aria-labelledby="route-heading" className="space-y-6">
      {/* Route Header Info */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm glass flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            Your walking route
          </span>
          <h3 id="route-heading" className="text-lg font-bold text-text mt-0.5">
            {route.title}
          </h3>
        </div>
        <div className="flex h-10 items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-bold text-text shrink-0">
          <FootprintsIcon aria-hidden="true" className="h-4 w-4 text-accent" />
          <span>{formatDuration(route.totalDurationMinutes)} walking</span>
        </div>
      </div>

      {/* SVG Animated Route Map */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm glass flex items-center justify-center bg-gradient-to-b from-surface to-bg/50">
        <div className="w-full max-w-lg">
          <svg
            viewBox="0 0 200 100"
            className="w-full overflow-visible"
            role="img"
            aria-label="Scenic walking path route schematic"
          >
            {/* Draw Path Grid Lines for visual appeal */}
            <line x1="10" y1="50" x2="190" y2="50" className="stroke-border/40" strokeWidth="1" strokeDasharray="3 3" />

            {/* Main Animated Walk Path */}
            <path
              d={pathD || route.routePathSvg}
              className="stroke-accent animate-route"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Waypoint Coordinate Circles */}
            {points.map((p, idx) => (
              <g key={idx} className="group">
                {/* Glow ring on hover */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="7"
                  className="fill-accent/20 stroke-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  strokeWidth="1.5"
                />
                {/* Base Dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  className="fill-surface stroke-accent"
                  strokeWidth="2"
                />
                {/* Text Indicator */}
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="text-[9px] font-black fill-text select-none"
                >
                  {idx + 1}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Sequential Steps List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-text uppercase tracking-wider">
          Waypoint Details
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {waypoints.map((wp, idx) => (
            <article
              key={wp.id}
              className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm glass hover:border-accent/30 transition-colors"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                {idx + 1}
              </span>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-text leading-tight">{wp.title}</h5>
                  <span className="text-[10px] text-muted font-bold shrink-0">
                    ({wp.durationMinutes}m)
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">{wp.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
