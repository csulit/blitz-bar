export interface DepartmentSalary {
  department: string
  totalSalary: number
  employeeCount: number
  color: string
}

export interface ThirteenthMonthData {
  currentAccrual: number
  targetAmount: number
  percentage: number
  monthsRemaining: number
  monthlyAccrualRate: number
}

export interface OvertimeCosts {
  currentPeriod: number
  previousPeriod: number
  change: number
  totalHours: number
  averageRate: number
}

export interface CompensationStats {
  totalPayroll: number
  previousPayroll: number
  payrollChange: number
  thirteenthMonth: ThirteenthMonthData
  overtimeCosts: OvertimeCosts
  departmentBreakdown: Array<DepartmentSalary>
  totalEmployees: number
  averageSalary: number
}
