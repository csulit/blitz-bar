export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  status: 'active' | 'away' | 'offline'
  joinedDate: string
}
