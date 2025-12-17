import { useQuery } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { adminVerificationKeys } from '../keys'
import type { UseQueryOptions } from '@tanstack/react-query'
import type { VerificationDetail } from '../../types'
import { db } from '@/db'
import { userVerification } from '@/db/schema'
import { assertCan } from '@/lib/casl/server'

export const getVerificationDetail = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: verificationId }) => {
    // Check if user can manage verifications (admin only)
    await assertCan('manage', 'UserVerification')

    const verification = await db.query.userVerification.findFirst({
      where: eq(userVerification.id, verificationId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            firstName: true,
            lastName: true,
            image: true,
            userType: true,
          },
          with: {
            profile: true,
            educations: {
              orderBy: (edu, { desc }) => [desc(edu.createdAt)],
            },
            identityDocuments: {
              orderBy: (doc, { desc }) => [desc(doc.createdAt)],
            },
            jobHistories: {
              orderBy: (job, { desc }) => [desc(job.createdAt)],
            },
          },
        },
        auditLogs: {
          with: {
            admin: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: (logs, { desc }) => [desc(logs.createdAt)],
        },
      },
    })

    if (!verification) {
      throw new Error('Verification not found')
    }

    // Transform the data to match our VerificationDetail type
    const result: VerificationDetail = {
      id: verification.id,
      userId: verification.userId,
      status: verification.status as VerificationDetail['status'],
      submittedAt: verification.submittedAt,
      verifiedAt: verification.verifiedAt,
      rejectionReason: verification.rejectionReason,
      createdAt: verification.createdAt,
      updatedAt: verification.updatedAt,
      user: {
        id: verification.user.id,
        name: verification.user.name,
        email: verification.user.email,
        firstName: verification.user.firstName,
        lastName: verification.user.lastName,
        image: verification.user.image,
        userType: verification.user.userType,
      },
      profile: verification.user.profile
        ? {
            age: verification.user.profile.age,
            birthday: verification.user.profile.birthday,
            gender: verification.user.profile.gender,
            maritalStatus: verification.user.profile.maritalStatus,
            phoneNumber: verification.user.profile.phoneNumber,
          }
        : null,
      education: verification.user.educations.map((edu) => ({
        id: edu.id,
        level: edu.level,
        schoolName: edu.schoolName,
        schoolAddress: edu.schoolAddress,
        degree: edu.degree,
        course: edu.course,
        track: edu.track,
        strand: edu.strand,
        yearStarted: edu.yearStarted,
        yearGraduated: edu.yearGraduated,
        isCurrentlyEnrolled: edu.isCurrentlyEnrolled,
        honors: edu.honors,
      })),
      identityDocuments: verification.user.identityDocuments.map((doc) => ({
        id: doc.id,
        documentType: doc.documentType,
        frontImageUrl: doc.frontImageUrl,
        backImageUrl: doc.backImageUrl,
        status: doc.status,
        rejectionReason: doc.rejectionReason,
        submittedAt: doc.submittedAt,
      })),
      jobHistory: verification.user.jobHistories.map((job) => ({
        id: job.id,
        companyName: job.companyName,
        position: job.position,
        startMonth: job.startMonth,
        endMonth: job.endMonth,
        isCurrentJob: job.isCurrentJob,
        summary: job.summary,
      })),
      auditLogs: verification.auditLogs.map((log) => ({
        id: log.id,
        action: log.action as VerificationDetail['auditLogs'][0]['action'],
        reason: log.reason,
        previousStatus: log.previousStatus,
        newStatus: log.newStatus,
        createdAt: log.createdAt,
        admin: {
          name: log.admin.name,
          email: log.admin.email,
        },
      })),
    }

    return result
  })

type VerificationDetailResult = Awaited<
  ReturnType<typeof getVerificationDetail>
>

export function useVerificationDetail(
  id: string | null,
  options?: Omit<
    UseQueryOptions<VerificationDetailResult, Error>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminVerificationKeys.detail(id ?? ''),
    queryFn: () => getVerificationDetail({ data: id! }),
    enabled: !!id,
    ...options,
  })
}
