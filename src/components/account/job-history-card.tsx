import { IconBriefcase } from '@tabler/icons-react'
import { EmptyState } from './empty-state'
import type { AccountData } from './hooks/queries/use-account'
import { Badge } from '@/components/ui/badge'

interface JobHistoryCardProps {
  jobHistory: AccountData['jobHistory']
}

export function JobHistoryCard({ jobHistory }: JobHistoryCardProps) {
  return (
    <section className="rounded-xl border bg-card lg:col-span-2">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <IconBriefcase className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Work Experience</h2>
            <p className="text-xs text-muted-foreground">Career history</p>
          </div>
        </div>
        <Badge variant="secondary">{jobHistory.length}</Badge>
      </div>
      <div className="p-6">
        {jobHistory.length > 0 ? (
          <div className="space-y-3">
            {jobHistory.map((job) => (
              <div key={job.id} className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{job.position}</p>
                    <p className="text-sm text-muted-foreground">
                      {job.companyName}
                    </p>
                  </div>
                  {job.isCurrentJob && (
                    <Badge className="rounded-sm bg-emerald-600 text-xs hover:bg-emerald-600">
                      Current
                    </Badge>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  {job.startMonth} — {job.endMonth || 'Present'}
                </p>

                {job.summary && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {job.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No work experience added" />
        )}
      </div>
    </section>
  )
}
