import { cn, cssVars } from "@/lib/utils";

/**
 * Custom line illustrations for the template previews. Colors come from
 * --ill-ink / --ill-paper / --ill-soft / --ill-accent on a parent element, so
 * each template can repaint them without touching the drawings.
 */

type ArtProps = { className?: string };

const svgProps = {
  fill: "none",
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** A pipe drawn as an outlined tube: thick ink stroke with a paper core. */
function Tube({ d, outer = 15, inner = 9 }: { d: string; outer?: number; inner?: number }) {
  return (
    <>
      <path d={d} className="i-ink" strokeWidth={outer} />
      <path d={d} className="i-stroke-paper" strokeWidth={inner} />
    </>
  );
}

export function FaucetArt({ className, tiles = false }: ArtProps & { tiles?: boolean }) {
  return (
    <svg viewBox="0 0 240 200" className={cn("block", className)} {...svgProps}>
      {tiles && (
        <g>
          <rect x="0" y="0" width="240" height="140" className="i-fill-soft" />
          <g className="i-stroke-paper" strokeWidth={2}>
            {[30, 60, 90, 120].map((y) => (
              <path key={`h${y}`} d={`M0 ${y} H240`} />
            ))}
            {[40, 80, 120, 160, 200].map((x) => (
              <path key={`v${x}`} d={`M${x} 0 V140`} />
            ))}
          </g>
        </g>
      )}
      <rect x="16" y="138" width="208" height="14" rx="4" className="i-ink i-fill-paper" />
      <path d="M46 152 H194 L184 182 Q182 190 174 190 H66 Q58 190 56 182 Z" className="i-ink i-fill-soft" />
      <Tube d="M113 122 V78 Q113 54 137 54 H158 Q172 54 172 68 V70" />
      <rect x="164" y="67" width="16" height="10" rx="2" className="i-ink i-fill-paper" />
      <Tube d="M104 126 L78 106" outer={13} inner={7} />
      <circle cx="74" cy="103" r="8" className="i-ink i-fill-accent" />
      <rect x="96" y="118" width="34" height="20" rx="6" className="i-ink i-fill-paper" />
      <ellipse cx="172" cy="179" rx="13" ry="3.5" className="i-fill-accent" opacity={0.35} />
      <path
        className="t-drip i-fill-accent"
        d="M172 82 C168 90 166 94 166 97 A6 6 0 0 0 178 97 C178 94 176 90 172 82Z"
      />
    </svg>
  );
}

export function WaterHeaterArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 200" className={cn("block", className)} {...svgProps}>
      <Tube d="M102 34 V8" outer={13} inner={7} />
      <Tube d="M138 34 V8" outer={13} inner={7} />
      <path d="M131 16 H145" className="i-stroke-accent" strokeWidth={4} />
      <g className="t-shake">
        <rect x="78" y="30" width="84" height="146" rx="18" className="i-ink i-fill-paper" />
        <path d="M80 56 H160" className="i-ink" />
        <rect x="98" y="72" width="44" height="28" rx="5" className="i-ink i-fill-soft" />
        <path d="M106 82 H134 M106 90 H124" className="i-ink" strokeWidth={2} />
        <path d="M86 134 Q103 127 120 134 T154 134" className="i-ink" strokeWidth={2} opacity={0.45} />
        {[
          [94, 142],
          [108, 140],
          [130, 143],
          [146, 140],
        ].map(([cx, cy]) => (
          <circle key={`${cx}`} cx={cx} cy={cy} r={2} className="i-fill-ink" opacity={0.35} />
        ))}
        <rect x="104" y="148" width="32" height="20" rx="4" className="i-ink i-fill-ink" />
        <path
          className="t-flicker i-fill-accent"
          d="M120 166 C113 166 112 159 116 154 C116 158 119 159 120 157 C119 152 122 149 126 147 C125 151 129 154 128 159 C127 164 124 166 120 166Z"
        />
      </g>
      <path d="M94 176 V186 M146 176 V186" className="i-ink" strokeWidth={6} />
      <g className="i-stroke-accent" strokeWidth={3.5}>
        <path d="M64 96 Q56 108 64 120" />
        <path d="M52 88 Q40 108 52 128" />
        <path d="M176 96 Q184 108 176 120" />
        <path d="M188 88 Q200 108 188 128" />
      </g>
    </svg>
  );
}

export function BreakerPanelArt({ className }: ArtProps) {
  const rows = [0, 1, 2, 3, 4, 5];
  return (
    <svg viewBox="0 0 240 200" className={cn("block", className)} {...svgProps}>
      <rect x="64" y="14" width="112" height="176" rx="10" className="i-ink i-fill-paper" />
      <rect x="76" y="28" width="88" height="148" rx="5" className="i-ink i-fill-soft" strokeWidth={2} />
      <path d="M120 34 V170" className="i-ink" strokeWidth={2} opacity={0.35} />
      {rows.map((i) => {
        const y = 38 + i * 22;
        const tripped = i === 2;
        return (
          <g key={i}>
            <rect
              x="84"
              y={y}
              width="30"
              height="14"
              rx="3"
              className={cn("i-ink", tripped ? "i-fill-accent" : "i-fill-paper")}
              strokeWidth={2.5}
            />
            <rect x={tripped ? 92 : 100} y={y + 3} width="10" height="8" rx="1.5" className="i-fill-ink" />
            <rect x="126" y={y} width="30" height="14" rx="3" className="i-ink i-fill-paper" strokeWidth={2.5} />
            <rect x="142" y={y + 3} width="10" height="8" rx="1.5" className="i-fill-ink" />
          </g>
        );
      })}
      <circle cx="99" cy="89" r="14" className="t-pulse i-stroke-accent" strokeWidth={2.5} />
      <path d="M44 62 L56 80 H47 L59 100" className="i-stroke-accent" strokeWidth={4} />
    </svg>
  );
}

/** Hotspot coordinates are in the 360x320 viewBox of HouseCutawayArt. */
export const HOUSE_HOTSPOTS = {
  crack: { x: 152, y: 120 },
  toilet: { x: 264, y: 150 },
  faucet: { x: 134, y: 206 },
  breaker: { x: 273, y: 201 },
  heater: { x: 117, y: 274 },
} as const;

export function HouseCutawayArt({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 360 320" className={cn("block", className)} {...svgProps}>
      {/* ground + soil */}
      <rect x="0" y="240" width="360" height="80" className="i-fill-soft" opacity={0.7} />
      <path d="M0 240 H360" className="i-ink" />
      <path d="M14 240 l4 -8 l4 8 M30 240 l3 -6 l3 6 M322 240 l4 -8 l4 8 M340 240 l3 -6 l3 6" className="i-ink" strokeWidth={2} />

      {/* chimney, roof */}
      <rect x="236" y="36" width="24" height="44" className="i-ink i-fill-paper" />
      <path d="M36 104 L180 22 L324 104 Z" className="i-ink i-fill-accent" />
      <path d="M78 80 L180 22 L282 80" className="i-ink" strokeWidth={2} opacity={0.35} />

      {/* house body */}
      <rect x="60" y="100" width="240" height="140" className="i-ink i-fill-paper" />
      <path d="M60 170 H300 M190 100 V170 M206 170 V240" className="i-ink" />

      {/* upstairs left: window + ceiling crack */}
      <rect x="80" y="120" width="36" height="32" rx="2" className="i-ink i-fill-soft" />
      <path d="M98 120 V152 M80 136 H116" className="i-ink" strokeWidth={2} />
      <path d="M160 100 L154 110 L161 116 L152 128 L157 134" className="i-ink" strokeWidth={2.5} />

      {/* upstairs right: bathroom */}
      <rect x="262" y="126" width="20" height="22" rx="3" className="i-ink i-fill-paper" />
      <path d="M244 148 H286 Q286 164 268 164 H262 Q244 164 244 148Z" className="i-ink i-fill-paper" />
      <rect x="256" y="164" width="18" height="6" className="i-ink i-fill-paper" strokeWidth={2} />
      <rect x="208" y="118" width="22" height="30" rx="3" className="i-ink i-fill-soft" strokeWidth={2} />

      {/* ground left: kitchen */}
      <rect x="76" y="180" width="44" height="16" className="i-ink i-fill-soft" strokeWidth={2} />
      <path d="M124 214 V200 Q124 194 130 194 H136 V198" className="i-ink" strokeWidth={4} />
      <rect x="70" y="214" width="104" height="8" className="i-ink i-fill-soft" strokeWidth={2.5} />
      <rect x="70" y="222" width="104" height="18" className="i-ink i-fill-paper" strokeWidth={2.5} />
      <path d="M122 222 V240" className="i-ink" strokeWidth={2} />
      <circle cx="136" cy="204" r="2.8" className="t-drip i-fill-accent" />

      {/* ground right: hallway door + breaker panel */}
      <rect x="220" y="194" width="26" height="46" className="i-ink i-fill-soft" strokeWidth={2.5} />
      <circle cx="240" cy="218" r="1.8" className="i-fill-ink" />
      <rect x="262" y="186" width="22" height="30" rx="2" className="i-ink i-fill-paper" strokeWidth={2.5} />
      <path d="M267 194 H279 M267 201 H279 M267 208 H279" className="i-ink" strokeWidth={2} />
      <rect x="266" y="199" width="6" height="4" className="i-fill-accent" />

      {/* basement: water heater + stairs */}
      <rect x="60" y="240" width="240" height="68" className="i-ink i-fill-paper" />
      <path d="M110 240 V250 M124 240 V250" className="i-ink" strokeWidth={3} />
      <rect x="104" y="250" width="28" height="50" rx="7" className="i-ink i-fill-paper" />
      <rect x="112" y="286" width="12" height="9" rx="2" className="i-fill-ink" />
      <path d="M118 294 C115 294 115 290 117 288 C118 290 119 290 120 287 C121 289 121 293 118 294Z" className="i-fill-accent" />
      <path d="M196 308 V296 H212 V284 H228 V272 H244 V260 H260 V248 H276" className="i-ink" strokeWidth={2.5} />
    </svg>
  );
}

/** A squiggly underline that draws itself in. */
export function Squiggle({ className }: ArtProps) {
  return (
    <svg viewBox="0 0 240 18" preserveAspectRatio="none" className={cn("block", className)} {...svgProps}>
      <path
        d="M3 12 C 40 3, 78 17, 118 9 S 196 4, 237 11"
        className="t-draw i-stroke-accent"
        strokeWidth={6}
        style={cssVars({ "--len": 260 })}
      />
    </svg>
  );
}
