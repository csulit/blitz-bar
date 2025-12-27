export type ComplianceStatus = 'compliant' | 'at-risk' | 'non-compliant'

export type AgencyCode = 'SSS' | 'PhilHealth' | 'Pag-IBIG' | 'BIR'

export interface AgencyCompliance {
  agency: AgencyCode
  agencyFullName: string
  status: ComplianceStatus
  contributionRate: string
  totalContributions: number
  employeesCompliant: number
  employeesAtRisk: number
  employeesNonCompliant: number
  lastRemittanceDate: string
  nextDueDate: string
  daysUntilDue: number
}

export interface ComplianceDeadline {
  id: string
  agency: AgencyCode
  title: string
  dueDate: string
  daysUntilDue: number
  status: ComplianceStatus
  description?: string
}

export interface ComplianceBreakdown {
  compliant: number
  atRisk: number
  nonCompliant: number
}

export interface ComplianceStats {
  agencies: Array<AgencyCompliance>
  deadlines: Array<ComplianceDeadline>
  overallScore: number
  overallStatus: ComplianceStatus
  totalMonthlyContributions: number
  complianceBreakdown: ComplianceBreakdown
}
