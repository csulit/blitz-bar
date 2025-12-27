import { requiresEducationAndJobHistory } from '../../constants'
import { usePersonalInfo } from './use-personal-info'
import { useEducation } from './use-education'
import { useIdentityDocument } from './use-identity-document'
import { useJobHistory } from './use-job-history'
import type { UserType } from '@/lib/schemas/signup'

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
export function useReviewData(userType: UserType = 'Employee'): ReviewData {
  const { data: personalInfo, isLoading: isLoadingPersonalInfo } =
    usePersonalInfo()
  const { data: education, isLoading: isLoadingEducation } = useEducation()
  const { data: document, isLoading: isLoadingDocument } = useIdentityDocument()
  const { data: jobHistory, isLoading: isLoadingJobHistory } = useJobHistory()

  // Check if education and job history are required for this user type
  const educationRequired = requiresEducationAndJobHistory(userType)
  const jobHistoryRequired = requiresEducationAndJobHistory(userType)

  const isLoading =
    isLoadingPersonalInfo ||
    isLoadingEducation ||
    isLoadingDocument ||
    isLoadingJobHistory

  // Build personal info summary
  const personalInfoComplete =
    personalInfo != null &&
    Boolean(personalInfo.firstName) &&
    Boolean(personalInfo.lastName) &&
    Boolean(personalInfo.gender)
  const personalInfoSummary =
    personalInfoComplete && personalInfo.firstName && personalInfo.gender
      ? `${personalInfo.firstName} ${personalInfo.lastName} - ${capitalizeFirst(personalInfo.gender)}`
      : 'Not completed'

  // Build education summary
  const educationDataComplete =
    education != null &&
    Boolean(education.level) &&
    Boolean(education.schoolName)
  const educationComplete = educationRequired ? educationDataComplete : true
  let educationSummary = educationRequired ? 'Not completed' : 'Not required'
  if (educationDataComplete && education.level && education.schoolName) {
    const levelDisplay = formatEducationLevel(education.level)
    educationSummary = education.degree
      ? `${education.degree} at ${education.schoolName}`
      : `${levelDisplay} at ${education.schoolName}`
  }

  // Build document summary
  const documentComplete =
    document != null &&
    Boolean(document.frontImageUrl) &&
    Boolean(document.backImageUrl)
  const documentSummary = documentComplete
    ? `${formatDocumentType(document.documentType)} - Front & Back`
    : 'Not completed'

  // Build job history summary
  const hasJobHistoryData =
    jobHistory?.jobs != null && jobHistory.jobs.length > 0
  const jobHistoryDataComplete = hasJobHistoryData
  const jobHistoryComplete = jobHistoryRequired ? jobHistoryDataComplete : true
  const jobCount = hasJobHistoryData ? jobHistory.jobs.length : 0
  let jobHistorySummary = jobHistoryRequired ? 'Not completed' : 'Not required'
  if (jobHistoryDataComplete) {
    jobHistorySummary = `${jobCount} ${jobCount === 1 ? 'job' : 'jobs'} added`
  }

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
