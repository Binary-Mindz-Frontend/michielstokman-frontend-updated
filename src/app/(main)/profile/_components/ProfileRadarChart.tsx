/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

interface ChartDataItem {
  subject: string;
  A: number;
  B: number;
}

interface ProfileRadarChartProps {
  data: ChartDataItem[];
}

const chartConfig = {
  A: {
    label: 'Current Level',
    color: '#E81A66',
  },
  B: {
    label: 'Baseline Level',
    color: '#3B07BA',
  },
} satisfies ChartConfig;

const renderCustomPolarAngleAxis = ({ payload, x, y, cx, cy }: any) => {
  let textAnchor: 'start' | 'end' | 'middle' = 'middle';
  if (x > cx + 15) textAnchor = 'start';
  else if (x < cx - 15) textAnchor = 'end';

  let dy = 4;
  if (y < cy - 15) dy = -6;
  else if (y > cy + 15) dy = 12;

  const value: string = payload?.value || '';

  // Split long labels (e.g. > 16 characters) into multiline arrays
  const lines: string[] = [];
  if (value.length > 16) {
    const words = value.split(' ');
    let currentLine = '';
    for (const word of words) {
      if ((currentLine ? `${currentLine} ${word}` : word).length <= 18) {
        currentLine = currentLine ? `${currentLine} ${word}` : word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
  } else {
    lines.push(value);
  }

  const lineHeight = 13;
  // Calculate initial dy adjustment if there are multiple lines
  const adjustedDy =
    lines.length > 1 && y < cy - 15 ? dy - ((lines.length - 1) * lineHeight) / 2 : dy;

  return (
    <text
      x={x}
      y={y + adjustedDy}
      textAnchor={textAnchor}
      fill="#7A6854"
      fontSize="11"
      fontWeight="500"
      className="font-playpen"
    >
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

export default function ProfileRadarChart({ data }: ProfileRadarChartProps) {
  return (
    <div className="mb-10 w-full rounded-2xl bg-[#F7F3EC] p-6 shadow-sm sm:p-8">
      <h3 className="font-playpen mb-6 text-center text-lg font-medium tracking-widest text-[#E49942] uppercase">
        YOUR GROWTH FOCUS
      </h3>

      <div className="mx-auto w-full max-w-125">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-105 w-full overflow-visible"
        >
          <RadarChart data={data} margin={{ top: 30, right: 45, bottom: 30, left: 45 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid gridType="circle" stroke="#D8CDBF" strokeWidth={1} />
            <PolarAngleAxis dataKey="subject" tick={renderCustomPolarAngleAxis} />

            {/* Baseline Level (Purple Dotted Line) */}
            <Radar
              name="Baseline"
              dataKey="B"
              stroke="#3B07BA"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              fill="#3B07BA"
              fillOpacity={0.12}
              dot={{ r: 3.5, fill: '#3B07BA', stroke: '#3B07BA' }}
            />

            {/* Current Level (Pink Solid Line) */}
            <Radar
              name="Current"
              dataKey="A"
              stroke="#E81A66"
              strokeWidth={2}
              fill="#E81A66"
              fillOpacity={0.2}
              dot={{ r: 3.5, fill: '#E81A66', stroke: '#E81A66' }}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
