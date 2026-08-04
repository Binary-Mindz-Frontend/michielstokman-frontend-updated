'use client';

interface ChartDataItem {
  subject: string;
  A: number;
  B: number;
}

interface ProfileRadarChartProps {
  data: ChartDataItem[];
}

export default function ProfileRadarChart({ data }: ProfileRadarChartProps) {
  const size = 420;
  const center = size / 2;
  const radius = 125;
  const total = data.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = (Math.max(0, Math.min(15, value)) / 15) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const r = radius + 32;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const pointsA = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.A);
      return `${x},${y}`;
    })
    .join(' ');

  const pointsB = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.B);
      return `${x},${y}`;
    })
    .join(' ');

  const levels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="mb-10 w-full rounded-2xl bg-[#F7F3EC] p-8 shadow-sm">
      <h3 className="font-playpen mb-6 text-center text-lg font-medium tracking-widest text-[#E49942] uppercase">
        YOUR GROWTH FOCUS
      </h3>

      <div className="mx-auto w-full max-w-[480px]">
        <svg viewBox={`0 0 ${size} ${size}`} className="h-auto w-full">
          {/* Grid Polygons */}
          {levels.map((level, lvlIdx) => {
            const levelPoints = data
              .map((_, i) => {
                const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                const r = radius * level;
                return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
              })
              .join(' ');
            return (
              <polygon
                key={lvlIdx}
                points={levelPoints}
                fill="none"
                stroke="#D8CDBF"
                strokeWidth="1"
                strokeDasharray={lvlIdx < 3 ? '3 3' : undefined}
              />
            );
          })}

          {/* Radial Spokes */}
          {data.map((_, i) => {
            const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
            const x2 = center + radius * Math.cos(angle);
            const y2 = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x2}
                y2={y2}
                stroke="#D8CDBF"
                strokeWidth="1"
              />
            );
          })}

          {/* Previous / Baseline Series (Dotted Blue Line) */}
          <polygon
            points={pointsB}
            fill="none"
            stroke="#3B07BA"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Current Series (Solid Pink Fill & Stroke) */}
          <polygon
            points={pointsA}
            fill="#E81A66"
            fillOpacity="0.2"
            stroke="#E81A66"
            strokeWidth="2"
          />

          {/* Current Series Vertices Dots */}
          {data.map((d, i) => {
            const { x, y } = getCoordinates(i, d.A);
            return <circle key={i} cx={x} cy={y} r="3" fill="#E81A66" />;
          })}

          {/* Axis Labels */}
          {data.map((d, i) => {
            const { x, y } = getLabelCoordinates(i);
            const textAnchor = Math.abs(x - center) < 15 ? 'middle' : x > center ? 'start' : 'end';

            return (
              <text
                key={i}
                x={x}
                y={y + 4}
                textAnchor={textAnchor}
                fill="#7A6854"
                fontSize="10"
                fontWeight="500"
                className="font-playpen"
              >
                {d.subject}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
