import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { employeeKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { Employee } from '../../types'
import { assertCan } from '@/lib/casl/server'

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
  const statuses: Array<Employee['status']> = [
    'active',
    'on_leave',
    'terminated',
  ]
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

  // Use a seeded random for consistent data
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  return Array.from({ length: count }, (_, i) => {
    const seed = i + 1
    const firstName =
      firstNames[Math.floor(seededRandom(seed) * firstNames.length)]
    const lastName =
      lastNames[Math.floor(seededRandom(seed * 2) * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`

    return {
      id: `emp-${i + 1}`,
      name,
      email,
      avatar:
        seededRandom(seed * 3) > 0.3
          ? `https://i.pravatar.cc/150?u=${i}`
          : undefined,
      department:
        departments[Math.floor(seededRandom(seed * 4) * departments.length)],
      position:
        positions[Math.floor(seededRandom(seed * 5) * positions.length)],
      status:
        statuses[
          seededRandom(seed * 6) < 0.85
            ? 0
            : seededRandom(seed * 7) < 0.95
              ? 1
              : 2
        ],
      hireDate: new Date(
        2020 + Math.floor(seededRandom(seed * 8) * 4),
        Math.floor(seededRandom(seed * 9) * 12),
        Math.floor(seededRandom(seed * 10) * 28) + 1,
      ).toISOString(),
      salary: Math.floor(seededRandom(seed * 11) * 100000) + 50000,
    }
  })
}

export const getEmployees = createServerFn({ method: 'GET' }).handler(
  async () => {
    await assertCan('read', 'Dashboard')

    // Simulate network delay for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Return mock data (will be replaced with real DB queries later)
    return generateFakeEmployees(200)
  },
)

type EmployeesResult = Awaited<ReturnType<typeof getEmployees>>

export function useEmployees(
  options?: Omit<
    UseQueryOptions<EmployeesResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: employeeKeys.list(),
    queryFn: () => getEmployees(),
    refetchInterval: 30000,
    ...options,
  })
}
