import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { teamKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { TeamMember } from '../../types'
import { assertCan } from '@/lib/casl/server'

function generateMockTeamMembers(count: number): Array<TeamMember> {
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
      id: `team-${i + 1}`,
      name,
      email,
      avatar:
        seededRandom(seed * 3) > 0.3
          ? `https://i.pravatar.cc/150?u=team${i}`
          : undefined,
      role: roles[Math.floor(seededRandom(seed * 4) * roles.length)],
      department:
        departments[Math.floor(seededRandom(seed * 5) * departments.length)],
      status:
        statuses[
          seededRandom(seed * 6) < 0.7
            ? 0
            : seededRandom(seed * 7) < 0.9
              ? 1
              : 2
        ],
      joinedDate: new Date(
        2021 + Math.floor(seededRandom(seed * 8) * 4),
        Math.floor(seededRandom(seed * 9) * 12),
        Math.floor(seededRandom(seed * 10) * 28) + 1,
      ).toISOString(),
    }
  })
}

export const getTeamMembers = createServerFn({ method: 'GET' }).handler(
  async () => {
    await assertCan('read', 'Dashboard')

    // Simulate network delay for loading state demonstration
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Return mock data (will be replaced with real DB queries later)
    return generateMockTeamMembers(50)
  },
)

type TeamMembersResult = Awaited<ReturnType<typeof getTeamMembers>>

export function useTeamMembers(
  options?: Omit<
    UseQueryOptions<TeamMembersResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: teamKeys.members(),
    queryFn: () => getTeamMembers(),
    refetchInterval: 30000,
    ...options,
  })
}
