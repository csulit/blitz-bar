export interface Employee {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
  position: string
  status: 'active' | 'on_leave' | 'terminated'
  hireDate: string
  salary: number
}
