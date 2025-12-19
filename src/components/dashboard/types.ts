export interface DepartmentCount {
  department: string
  count: number
  color: string
}

export interface WorkforceStats {
  totalHeadcount: number
  activeEmployees: number
  onLeave: number
  newHires: number
  newHiresChange: number
  separations: number
  separationsChange: number
  turnoverRate: number
  turnoverRatePrevious: number
  departmentBreakdown: DepartmentCount[]
}
