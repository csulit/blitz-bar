import { usePersonalInfo } from './use-personal-info'
import { useEducation } from './use-education'
import { useIdentityDocument } from './use-identity-document'
import { useJobHistory } from './use-job-history'

export interface ReviewStepData {
  isComplete: boolean
  summary: string
}

export interface ReviewData {
  personalInfo: ReviewStepData
  education: ReviewStepData
  document: ReviewStepData
  jobHistory: ReviewStepData
  isLoading: boolean
  isAllComplete: boolean
}

/**
 * Hook that aggregates all verification data for the review step
 * Returns completion status and summary for each step
 */
export function useReviewData(): ReviewData {
  const { data: personalInfo, isLoading: isLoadingPersonalInfo } =
    usePersonalInfo()
  const { data: education, isLoading: isLoadingEducation } = useEducation()
  const { data: document, isLoading: isLoadingDocument } = useIdentityDocument()
  const { data: jobHistory, isLoading: isLoadingJobHistory } = useJobHistory()

  const isLoading =
    isLoadingPersonalInfo ||
    isLoadingEducation ||
    isLoadingDocument ||
    isLoadingJobHistory

  // Build personal info summary
  const personalInfoComplete = !!(
    personalInfo?.firstName &&
    personalInfo?.lastName &&
    personalInfo?.gender
  )
  const personalInfoSummary = personalInfoComplete
    ? `${personalInfo.firstName} ${personalInfo.lastName} - ${capitalizeFirst(personalInfo.gender!)}`
    : 'Not completed'

  // Build education summary
  const educationComplete = !!(education?.level && education?.schoolName)
  let educationSummary = 'Not completed'
  if (educationComplete) {
    const levelDisplay = formatEducationLevel(education.level!)
    educationSummary = education.degree
      ? `${education.degree} at ${education.schoolName}`
      : `${levelDisplay} at ${education.schoolName}`
  }

  // Build document summary
  const documentComplete = !!(document?.frontImageUrl && document?.backImageUrl)
  const documentSummary = documentComplete
    ? `${formatDocumentType(document.documentType)} - Front & Back`
    : 'Not completed'

  // Build job history summary
  const jobHistoryComplete = !!(jobHistory?.jobs && jobHistory.jobs.length > 0)
  const jobCount = jobHistory?.jobs?.length ?? 0
  const jobHistorySummary = jobHistoryComplete
    ? `${jobCount} ${jobCount === 1 ? 'job' : 'jobs'} added`
    : 'Not completed'

  const isAllComplete =
    personalInfoComplete &&
    educationComplete &&
    documentComplete &&
    jobHistoryComplete

  return {
    personalInfo: {
      isComplete: personalInfoComplete,
      summary: personalInfoSummary,
    },
    education: {
      isComplete: educationComplete,
      summary: educationSummary,
    },
    document: {
      isComplete: documentComplete,
      summary: documentSummary,
    },
    jobHistory: {
      isComplete: jobHistoryComplete,
      summary: jobHistorySummary,
    },
    isLoading,
    isAllComplete,
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatEducationLevel(level: string): string {
  const levelMap: Record<string, string> = {
    elementary: 'Elementary',
    high_school: 'High School',
    senior_high: 'Senior High',
    vocational: 'Vocational',
    college: 'College',
    graduate: 'Graduate',
  }
  return levelMap[level] ?? level
}

function formatDocumentType(type: string): string {
  const typeMap: Record<string, string> = {
    identity_card: 'Identity Card',
    driver_license: "Driver's License",
    passport: 'Passport',
  }
  return typeMap[type] ?? type
}
