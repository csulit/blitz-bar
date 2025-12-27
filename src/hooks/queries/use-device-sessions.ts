import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'

type DeviceSessionsResponse = Awaited<
  ReturnType<typeof authClient.multiSession.listDeviceSessions>
>
type DeviceSessionsData = DeviceSessionsResponse['data']
export type DeviceSession = NonNullable<DeviceSessionsData>[number]

/**
 * Hook for fetching all device sessions (multi-account support)
 *
 * @example
 * const { data: sessions, isLoading } = useDeviceSessions()
 */
export function useDeviceSessions(
  options?: Omit<
    UseQueryOptions<DeviceSessionsData, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.deviceSessions.all,
    queryFn: async () => {
      const response = await authClient.multiSession.listDeviceSessions()
      return response.data
    },
    ...options,
  })
}
