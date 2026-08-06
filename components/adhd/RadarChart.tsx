"use client";

// components/adhd/RadarChart.tsx
//
// A minimal, soft radar chart, deliberately plain: three faint grid rings,
// thin axis lines, one filled polygon. No legends, no colour coding per
// axis, matching the "beautiful, minimal, soft green" brief rather than a
// dense analytics-style radar.

interface RadarPoint {
    label: string;
    percent: number; // 0-100
}

export default function RadarChart({ points, size = 280 }: { points: RadarPoint[]; size?: number }) {
    const center = size / 2;
    const maxR = size * 0.32;
    const labelR = size * 0.44;
    const n = points.length;

    const angleFor = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

    const polygonPoints = points
        .map((p, i) => {
            const angle = angleFor(i);
            const r = (Math.max(4, p.percent) / 100) * maxR;
            return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
        })
        .join(" ");

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Domain pattern radar chart">
            {/* Grid rings */}
            {[0.33, 0.66, 1].map((f) => (
                <circle key={f} cx={center} cy={center} r={maxR * f} fill="none" stroke="#e4e9e5" strokeWidth={1} />
            ))}
            {/* Axis lines */}
            {points.map((_, i) => {
                const angle = angleFor(i);
                return (
                    <line
                        key={i}
                        x1={center} y1={center}
                        x2={center + maxR * Math.cos(angle)} y2={center + maxR * Math.sin(angle)}
                        stroke="#e4e9e5" strokeWidth={1}
                    />
                );
            })}
            {/* Filled data polygon */}
            <polygon points={polygonPoints} fill="rgba(45,122,90,0.14)" stroke="#2d7a5a" strokeWidth={1.75} strokeLinejoin="round" />
            {/* Data points */}
            {points.map((p, i) => {
                const angle = angleFor(i);
                const r = (Math.max(4, p.percent) / 100) * maxR;
                return (
                    <circle key={i} cx={center + r * Math.cos(angle)} cy={center + r * Math.sin(angle)} r={3} fill="#2d7a5a" />
                );
            })}
            {/* Labels */}
            {points.map((p, i) => {
                const angle = angleFor(i);
                const x = center + labelR * Math.cos(angle);
                const y = center + labelR * Math.sin(angle);
                const anchor = Math.cos(angle) > 0.3 ? "start" : Math.cos(angle) < -0.3 ? "end" : "middle";
                return (
                    <text
                        key={p.label}
                        x={x} y={y}
                        textAnchor={anchor}
                        dominantBaseline="middle"
                        fontSize={10.5}
                        fontFamily="DM Sans, sans-serif"
                        fill="#4a5a52"
                    >
                        {p.label}
                    </text>
                );
            })}
        </svg>
    );
}
