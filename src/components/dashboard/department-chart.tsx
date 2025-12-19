import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import type { DepartmentCount } from './types'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

interface DepartmentChartProps {
  data: DepartmentCount[]
}

export function DepartmentChart({ data }: DepartmentChartProps) {
  // Sort by count descending
  const sortedData = [...data].sort((a, b) => b.count - a.count)

  // Build chart config from data
  const chartConfig = sortedData.reduce<ChartConfig>((config, item) => {
    const key = item.department.toLowerCase().replace(/\s+/g, '-')
    config[key] = {
      label: item.department,
      color: item.color,
    }
    return config
  }, {})

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">
        Headcount by Department
      </h3>
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ left: 0, right: 16, top: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="department"
            type="category"
            tickLine={false}
            axisLine={false}
            width={100}
            tick={{ fontSize: 13 }}
          />
          <ChartTooltip
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
            content={
              <ChartTooltipContent
                formatter={(value) => (
                  <span className="font-medium tabular-nums">
                    {value} employees
                  </span>
                )}
              />
            }
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="count"
              position="right"
              className="fill-muted-foreground text-xs"
              formatter={(value: number) => `${value}`}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
