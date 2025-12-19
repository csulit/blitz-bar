export const dashboardKeys = {
  all: ['dashboard'] as const,
  workforceStats: () => [...dashboardKeys.all, 'workforceStats'] as const,
}
