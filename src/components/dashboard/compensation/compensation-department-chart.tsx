import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from 'recharts'
import type { DepartmentSalary } from './types'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface CompensationDepartmentChartProps {
  data: Array<DepartmentSalary>
  totalPayroll: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCompact(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K`
  }
  return amount.toString()
}

export function CompensationDepartmentChart({
  data,
  totalPayroll,
}: CompensationDepartmentChartProps) {
  // Sort by total salary descending
  const sortedData = [...data].sort((a, b) => b.totalSalary - a.totalSalary)

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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Salary by Department
        </h3>
        <p className="text-xs text-muted-foreground">
          Total: {formatCurrency(totalPayroll)}
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-70 w-full">
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ left: 0, right: 48, top: 0, bottom: 0 }}
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
                formatter={(value, _name, props) => {
                  const item = props.payload as DepartmentSalary
                  const percentage = (
                    (item.totalSalary / totalPayroll) *
                    100
                  ).toFixed(1)
                  return (
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium tabular-nums">
                        {formatCurrency(value as number)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.employeeCount} employees ({percentage}%)
                      </span>
                    </div>
                  )
                }}
              />
            }
          />
          <Bar dataKey="totalSalary" radius={[0, 4, 4, 0]} barSize={24}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
            <LabelList
              dataKey="totalSalary"
              position="right"
              className="fill-muted-foreground text-xs"
              formatter={(value: number) => formatCompact(value)}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  )
}
