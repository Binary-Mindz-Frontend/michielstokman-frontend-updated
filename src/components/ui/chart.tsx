/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
'use client';

import * as React from 'react';
import * as RechartsPrimitive from 'recharts';
import { cn } from '@/lib/utils';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

interface ChartContainerProps extends React.ComponentProps<'div'> {
  config: ChartConfig;
  children: React.ComponentElement<any, any>;
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const chartId = React.useId();
    const containerId = `chart-${id || chartId.replace(/:/g, '')}`;

    return (
      <div
        ref={ref}
        id={containerId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border/50 [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-square justify-center text-xs [&_.recharts-sector]:outline-none [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-none",
          className,
        )}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer width="100%" height="100%">
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    );
  },
);
ChartContainer.displayName = 'ChartContainer';

export { Tooltip as ChartTooltip } from 'recharts';

export interface ChartTooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  payload?: any[];
  label?: React.ReactNode;
  hideLabel?: boolean;
  indicator?: 'line' | 'dot' | 'dashed';
}

export const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, label }, ref) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div
        ref={ref}
        className="border-border/50 grid min-w-32 items-start gap-1.5 rounded-lg border bg-[#FBF9F3] px-3 py-2 text-xs shadow-md"
      >
        {label && <div className="font-playpen text-foreground font-medium">{label}</div>}
        <div className="grid gap-1">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: item.color || item.fill }}
                />
                {item.name || 'Value'}
              </span>
              <span className="text-foreground font-mono font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = 'ChartTooltipContent';
