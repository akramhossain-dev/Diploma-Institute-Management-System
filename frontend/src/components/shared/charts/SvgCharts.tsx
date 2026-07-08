import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface DataPoint {
  label: string;
  value: number;
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <Card className={`border shadow-sm bg-card overflow-hidden ${className}`}>
      <CardHeader className="border-b pb-4 bg-muted/10">
        <CardTitle className="text-sm font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {children}
      </CardContent>
    </Card>
  );
}

interface SvgChartProps {
  data: DataPoint[];
  height?: number;
  color?: string;
  gridLines?: boolean;
}

export function SvgLineChart({ data, height = 200, color = '#3b82f6', gridLines = true }: SvgChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-xs text-muted-foreground py-10 text-center">No data points available.</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.value)) || 1;
  const minVal = 0;
  const padding = 40;
  const chartHeight = height - padding * 2;
  const stepX = 400 / (data.length - 1 || 1);

  // Generate coordinates
  const points = data.map((d, index) => {
    const x = padding + index * stepX;
    const y = padding + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Gradient area path
  const areaD = data.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 480 ${height}`} className="w-full overflow-visible">
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines && (
          <>
            <line x1={padding} y1={padding} x2={480 - padding} y2={padding} stroke="var(--border)" strokeDasharray="3 3" />
            <line x1={padding} y1={padding + chartHeight / 2} x2={480 - padding} y2={padding + chartHeight / 2} stroke="var(--border)" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={480 - padding} y2={height - padding} stroke="var(--border)" />
          </>
        )}

        {/* Gradient fill */}
        {areaD && <path d={areaD} fill="url(#chartGrad)" />}

        {/* Trend line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--background)"
              stroke={color}
              strokeWidth="2.5"
              className="transition-all duration-200 hover:r-6"
            />
            {/* Tooltip trigger placeholder */}
            <title>{`${p.label}: ${p.value}`}</title>
          </g>
        ))}

        {/* Axis Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={height - padding + 20}
            textAnchor="middle"
            fill="var(--muted-foreground)"
            className="text-[9px] font-semibold"
          >
            {p.label}
          </text>
        ))}

        {/* Y Axis Max Label */}
        <text x={padding - 5} y={padding + 4} textAnchor="end" fill="var(--muted-foreground)" className="text-[9px] font-bold">
          {maxVal}
        </text>
        <text x={padding - 5} y={height - padding + 4} textAnchor="end" fill="var(--muted-foreground)" className="text-[9px] font-bold">
          0
        </text>
      </svg>
    </div>
  );
}

export function SvgBarChart({ data, height = 200, color = '#10b981', gridLines = true }: SvgChartProps) {
  if (!data || data.length === 0) {
    return <div className="text-xs text-muted-foreground py-10 text-center">No data points available.</div>;
  }

  const maxVal = Math.max(...data.map((d) => d.value)) || 1;
  const padding = 40;
  const chartHeight = height - padding * 2;
  const stepX = (480 - padding * 2) / data.length;
  const barWidth = Math.max(15, stepX * 0.6);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 480 ${height}`} className="w-full overflow-visible">
        {/* Grid lines */}
        {gridLines && (
          <>
            <line x1={padding} y1={padding} x2={480 - padding} y2={padding} stroke="var(--border)" strokeDasharray="3 3" />
            <line x1={padding} y1={padding + chartHeight / 2} x2={480 - padding} y2={padding + chartHeight / 2} stroke="var(--border)" strokeDasharray="3 3" />
            <line x1={padding} y1={height - padding} x2={480 - padding} y2={height - padding} stroke="var(--border)" />
          </>
        )}

        {/* Render Bars */}
        {data.map((d, index) => {
          const x = padding + index * stepX + (stepX - barWidth) / 2;
          const barHeight = (d.value / maxVal) * chartHeight;
          const y = height - padding - barHeight;

          return (
            <g key={index} className="group cursor-pointer">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                opacity="0.85"
                rx="3"
                className="transition-all duration-200 hover:opacity-100"
              />
              <title>{`${d.label}: ${d.value}`}</title>
              {/* X label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 20}
                textAnchor="middle"
                fill="var(--muted-foreground)"
                className="text-[9px] font-semibold"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        {/* Axis Labels */}
        <text x={padding - 5} y={padding + 4} textAnchor="end" fill="var(--muted-foreground)" className="text-[9px] font-bold">
          {maxVal}
        </text>
        <text x={padding - 5} y={height - padding + 4} textAnchor="end" fill="var(--muted-foreground)" className="text-[9px] font-bold">
          0
        </text>
      </svg>
    </div>
  );
}
