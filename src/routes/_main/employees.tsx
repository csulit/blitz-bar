import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/ui/data-table'

export const Route = createFileRoute('/_main/employees')({
  component: EmployeesPage,
})

// Types
interface Employee {
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

// Fake data generator
function generateFakeEmployees(count: number): Array<Employee> {
  const departments = [
    'Engineering',
    'Design',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
  ]
  const positions = [
    'Software Engineer',
    'Senior Developer',
    'Product Designer',
    'Marketing Manager',
    'Sales Representative',
    'HR Specialist',
    'Financial Analyst',
    'Operations Lead',
    'Tech Lead',
    'UX Researcher',
  ]
  const statuses: Array<Employee['status']> = ['active', 'on_leave', 'terminated']
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
      id: `emp-${i + 1}`,
      name,
      email,
      avatar:
        Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=${i}` : undefined,
      department: departments[Math.floor(Math.random() * departments.length)],
      position: positions[Math.floor(Math.random() * positions.length)],
      status:
        statuses[
          Math.floor(Math.random() * 100) < 85
            ? 0
            : Math.floor(Math.random() * 100) < 95
              ? 1
              : 2
        ],
      hireDate: new Date(
        2020 + Math.floor(Math.random() * 4),
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1,
      ).toISOString(),
      salary: Math.floor(Math.random() * 100000) + 50000,
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

function getStatusBadge(status: Employee['status']) {
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
    case 'on_leave':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800"
        >
          On Leave
        </Badge>
      )
    case 'terminated':
      return (
        <Badge
          variant="outline"
          className="rounded-sm! bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800"
        >
          Terminated
        </Badge>
      )
  }
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

function EmployeesPage() {
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Generate 200 fake employees for demo
  const allEmployees = useMemo(() => generateFakeEmployees(200), [])

  // Simulate pagination (in real app, this would be server-side)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return allEmployees.slice(start, start + pageSize)
  }, [allEmployees, currentPage, pageSize])

  const columns = useMemo<Array<ColumnDef<Employee, unknown>>>(
    () => [
      {
        accessorKey: 'name',
        header: 'Employee',
        size: 280,
        cell: ({ row }) => {
          const employee = row.original
          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={employee.avatar} alt={employee.name} />
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {getInitials(employee.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{employee.name}</span>
                <span className="text-xs text-muted-foreground">
                  {employee.email}
                </span>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: 'department',
        header: 'Department',
        size: 120,
        cell: ({ row }) => getDepartmentBadge(row.original.department),
      },
      {
        accessorKey: 'position',
        header: 'Position',
        size: 180,
        cell: ({ row }) => (
          <span className="text-sm">{row.original.position}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 100,
        cell: ({ row }) => getStatusBadge(row.original.status),
      },
      {
        accessorKey: 'hireDate',
        header: 'Hire Date',
        size: 120,
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.original.hireDate)}
          </span>
        ),
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        size: 100,
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums">
            {formatCurrency(row.original.salary)}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl">Employees</h1>
        <p className="text-muted-foreground mt-1">
          Manage your team members and their roles.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={paginatedData}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalRows={allEmployees.length}
        manualPagination
      />
    </div>
  )
}
