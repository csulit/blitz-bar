import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import type { SkeletonType } from '@/components/ui/data-table'
import { TeamPageSkeleton } from '@/components/team/team-page-skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'

export const Route = createFileRoute('/_main/team')({
  component: TeamPage,
  pendingComponent: TeamPageSkeleton,
})

// Types
interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
  department: string
  status: 'active' | 'away' | 'offline'
  joinedDate: string
}

// Fake data generator
function generateFakeTeamMembers(count: number): Array<TeamMember> {
  const departments = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
  ]
  const roles = [
    'Team Lead',
    'Senior Member',
    'Member',
    'Junior Member',
    'Intern',
  ]
  const statuses: Array<TeamMember['status']> = ['active', 'away', 'offline']
  const firstNames = [
    'James',
    'Mary',
    'Robert',
    'Patricia',
    'John',
    'Jennifer',
    'Michael',
    'Linda',
    'David',
    'Elizabeth',
    'William',
    'Barbara',
    'Richard',
    'Susan',
    'Joseph',
    'Jessica',
    'Thomas',
    'Sarah',
    'Christopher',
    'Karen',
    'Charles',
    'Lisa',
    'Daniel',
    'Nancy',
    'Matthew',
    'Betty',
    'Anthony',
    'Margaret',
    'Mark',
    'Sandra',
    'Donald',
    'Ashley',
  ]
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
    'Thomas',
    'Taylor',
    'Moore',
    'Jackson',
    'Martin',
    'Lee',
    'Perez',
    'Thompson',
    'White',
    'Harris',
    'Sanchez',
    'Clark',
    'Ramirez',
    'Lewis',
    'Robinson',
    'Walker',
  ]

  return Array.from({ length: count }, (_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`

    return {
      id: `team-${i + 1}`,
      name,
      email,
      avatar:
        Math.random() > 0.3
          ? `https://i.pravatar.cc/150?u=team${i}`
          : undefined,
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      status:
        statuses[
          Math.floor(Math.random() * 100) < 70
            ? 0
            : Math.floor(Math.random() * 100) < 90
              ? 1
              : 2
        ],
      joinedDate: new Date(
        2021 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ).toISOString(),
    }
  })
}

// Utility functions
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getStatusBadge(status: TeamMember['status']) {
  switch (status) {
    case 'active':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800"
        >
          Active
        </Badge>
      )
    case 'away':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
        >
          Away
        </Badge>
      )
    case 'offline':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800"
        >
          Offline
        </Badge>
      )
  }
}

function getRoleBadge(role: string) {
  const colors: Record<string, string> = {
    'Team Lead':
      'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-400 dark:border-violet-800',
    'Senior Member':
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
    Member:
      'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800',
    'Junior Member':
      'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800',
    Intern:
      'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800',
  }

  return (
    <Badge variant="outline" className={`rounded-sm! ${colors[role] ?? ''}`}>
      {role}
    </Badge>
  )
}

function getDepartmentBadge(department: string) {
  const colors: Record<string, string> = {
    Engineering:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800',
    Design:
      'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800',
    Marketing:
      'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-400 dark:border-pink-800',
    Sales:
      'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800',
    HR: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-400 dark:border-teal-800',
    Finance:
      'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800',
    Operations:
      'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800',
  }

  return (
    <Badge
      variant="outline"
      className={`rounded-sm! ${colors[department] ?? ''}`}
    >
      {department}
    </Badge>
  )
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

function TeamPage() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [allTeamMembers, setAllTeamMembers] = useState<Array<TeamMember>>([])

  // Simulate async data fetching
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setAllTeamMembers(generateFakeTeamMembers(50))
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Simulate pagination (in real app, this would be server-side)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return allTeamMembers.slice(start, start + pageSize)
  }, [allTeamMembers, currentPage, pageSize])

  // Skeleton config matching column content types
  const skeletonConfig: Array<SkeletonType> = [
    'avatar-with-text', // Member (avatar + name + email)
    'badge', // Role
    'badge', // Department
    'badge', // Status
    'text-sm', // Joined Date
  ]

  const columns = useMemo<Array<ColumnDef<TeamMember, unknown>>>(
    () => [
      {
        accessorKey: 'name',
        header: 'Member',
        size: 280,
        cell: ({ row }) => {
          const member = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{member.name}</span>
                <span className="text-xs text-muted-foreground">
                  {member.email}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'role',
        header: 'Role',
        size: 140,
        cell: ({ row }) => getRoleBadge(row.original.role),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 120,
        cell: ({ row }) => getDepartmentBadge(row.original.department),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: 'joinedDate',
        header: 'Joined',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.joinedDate)}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-muted-foreground mt-1">
          View and manage your team members.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        isLoading={isLoading}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalRows={allTeamMembers.length}
        manualPagination
        skeletonConfig={skeletonConfig}
      />
    </div>
  )
}
