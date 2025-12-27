import { IconMapPin, IconSchool } from '@tabler/icons-react'
import { EmptyState } from './empty-state'
import { formatEducationLevel } from './utils'
import type { AccountData } from './hooks/queries/use-account'
import { Badge } from '@/components/ui/badge'

interface EducationCardProps {
  education: AccountData['education']
}

export function EducationCard({ education }: EducationCardProps) {
  return (
    <section className="rounded-xl border bg-card lg:col-span-2">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <IconSchool className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Education</h2>
            <p className="text-xs text-muted-foreground">Academic background</p>
          </div>
        </div>
        <Badge variant="secondary">{education.length}</Badge>
      </div>
      <div className="p-6">
        {education.length > 0 ? (
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="rounded-lg border bg-muted/30 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">
                      {formatEducationLevel(edu.level)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {edu.schoolName}
                    </p>
                    {edu.schoolAddress && (
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <IconMapPin className="h-3 w-3" />
                        {edu.schoolAddress}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {edu.isCurrentlyEnrolled && (
                      <Badge variant="outline" className="rounded-sm text-xs">
                        Currently Enrolled
                      </Badge>
                    )}
                    {edu.honors && (
                      <Badge className="rounded-sm bg-amber-500 text-xs hover:bg-amber-500">
                        {edu.honors}
                      </Badge>
                    )}
                  </div>
                </div>

                {(edu.degree || edu.course) && (
                  <p className="mt-2 text-sm">{edu.degree || edu.course}</p>
                )}

                {edu.track && (
                  <p className="text-sm text-muted-foreground">
                    {edu.track}
                    {edu.strand && ` · ${edu.strand}`}
                  </p>
                )}

                <p className="mt-2 text-xs text-muted-foreground">
                  {edu.yearStarted} — {edu.yearGraduated || 'Present'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No education history added" />
        )}
      </div>
    </section>
  )
}
