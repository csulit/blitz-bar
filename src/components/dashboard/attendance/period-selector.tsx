import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AttendancePeriod } from './types'

interface PeriodSelectorProps {
  value: AttendancePeriod
  onChange: (period: AttendancePeriod) => void
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as AttendancePeriod)}>
      <TabsList>
        <TabsTrigger value="day">Today</TabsTrigger>
        <TabsTrigger value="week">This Week</TabsTrigger>
        <TabsTrigger value="month">This Month</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
