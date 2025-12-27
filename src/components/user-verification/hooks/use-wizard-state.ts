import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import {
  getStepsForUserType,
  requiresEducationAndJobHistory,
} from '../constants'
import { usePersonalInfo } from './queries/use-personal-info'
import { useEducation } from './queries/use-education'
import { useIdentityDocument } from './queries/use-identity-document'
import { useJobHistory } from './queries/use-job-history'
import { useSaveIdentityDocument } from './mutations/use-save-identity-document'
import type { StepConfig } from '../constants'
import type { DocumentType, UploadedFile, VerificationStep } from '../types'
import type { PersonalInfoFormData } from '@/lib/schemas/personal-info'
import type { EducationFormData } from '@/lib/schemas/education'
import type { JobHistoryFormData } from '@/lib/schemas/job-history'
import type { UserType } from '@/lib/schemas/signup'

// State
export interface WizardState {
  currentStep: VerificationStep
  selectedDocType: DocumentType
  frontFile: UploadedFile | null
  backFile: UploadedFile | null
  personalInfo: {
    isValid: boolean
    data: Partial<PersonalInfoFormData>
  }
  education: {
    isValid: boolean
    data: Partial<EducationFormData>
  }
  jobHistory: {
    isValid: boolean
    data: JobHistoryFormData
  }
}

// Actions
type WizardAction =
  | { type: 'GO_NEXT'; steps: Array<StepConfig> }
  | { type: 'GO_BACK'; steps: Array<StepConfig> }
  | { type: 'SET_STEP'; step: VerificationStep }
  | { type: 'SET_DOC_TYPE'; docType: DocumentType }
  | { type: 'SET_FRONT_FILE'; file: UploadedFile | null }
  | { type: 'SET_BACK_FILE'; file: UploadedFile | null }
  | {
      type: 'UPDATE_FRONT_FILE'
      updater: (prev: UploadedFile | null) => UploadedFile | null
    }
  | {
      type: 'UPDATE_BACK_FILE'
      updater: (prev: UploadedFile | null) => UploadedFile | null
    }
  | { type: 'SET_PERSONAL_INFO_VALID'; isValid: boolean }
  | { type: 'SET_PERSONAL_INFO_DATA'; data: Partial<PersonalInfoFormData> }
  | { type: 'SET_EDUCATION_VALID'; isValid: boolean }
  | { type: 'SET_EDUCATION_DATA'; data: Partial<EducationFormData> }
  | { type: 'SET_JOB_HISTORY_VALID'; isValid: boolean }
  | { type: 'SET_JOB_HISTORY_DATA'; data: JobHistoryFormData }

const initialState: WizardState = {
  currentStep: 'personal_info',
  selectedDocType: 'identity_card',
  frontFile: null,
  backFile: null,
  personalInfo: {
    isValid: false,
    data: {},
  },
  education: {
    isValid: false,
    data: {},
  },
  jobHistory: {
    isValid: false,
    data: { jobs: [] },
  },
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'GO_NEXT': {
      const { steps } = action
      const currentIndex = steps.findIndex((s) => s.id === state.currentStep)
      if (currentIndex < steps.length - 1) {
        return { ...state, currentStep: steps[currentIndex + 1].id }
      }
      return state
    }
    case 'GO_BACK': {
      const { steps } = action
      const currentIndex = steps.findIndex((s) => s.id === state.currentStep)
      if (currentIndex > 0) {
        return { ...state, currentStep: steps[currentIndex - 1].id }
      }
      return state
    }
    case 'SET_STEP':
      return { ...state, currentStep: action.step }
    case 'SET_DOC_TYPE':
      return { ...state, selectedDocType: action.docType }
    case 'SET_FRONT_FILE':
      return { ...state, frontFile: action.file }
    case 'SET_BACK_FILE':
      return { ...state, backFile: action.file }
    case 'UPDATE_FRONT_FILE':
      return { ...state, frontFile: action.updater(state.frontFile) }
    case 'UPDATE_BACK_FILE':
      return { ...state, backFile: action.updater(state.backFile) }
    case 'SET_PERSONAL_INFO_VALID':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, isValid: action.isValid },
      }
    case 'SET_PERSONAL_INFO_DATA':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, data: action.data },
      }
    case 'SET_EDUCATION_VALID':
      return {
        ...state,
        education: { ...state.education, isValid: action.isValid },
      }
    case 'SET_EDUCATION_DATA':
      return {
        ...state,
        education: { ...state.education, data: action.data },
      }
    case 'SET_JOB_HISTORY_VALID':
      return {
        ...state,
        jobHistory: { ...state.jobHistory, isValid: action.isValid },
      }
    case 'SET_JOB_HISTORY_DATA':
      return {
        ...state,
        jobHistory: { ...state.jobHistory, data: action.data },
      }
    default:
      return state
  }
}

/**
 * Wizard state hook for use in modals/dialogs.
 * Uses local reducer state (no URL sync).
 * Auto-save to database works as expected.
 */
export function useWizardState(
  initialStep: VerificationStep = 'personal_info',
  userType: UserType = 'Employee',
) {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    currentStep: initialStep,
  })

  // Get applicable steps for this user type
  const applicableSteps = useMemo(
    () => getStepsForUserType(userType),
    [userType],
  )

  // Fetch saved personal info from database
  const { data: savedPersonalInfo, isLoading: isLoadingPersonalInfo } =
    usePersonalInfo()

  // Initialize personal info data from fetched data (only once when data loads)
  useEffect(() => {
    if (savedPersonalInfo && Object.keys(savedPersonalInfo).length > 0) {
      dispatch({ type: 'SET_PERSONAL_INFO_DATA', data: savedPersonalInfo })
    }
  }, [savedPersonalInfo])

  // Fetch saved education from database
  const { data: savedEducation, isLoading: isLoadingEducation } = useEducation()

  // Initialize education data from fetched data (only once when data loads)
  useEffect(() => {
    if (savedEducation && Object.keys(savedEducation).length > 0) {
      dispatch({ type: 'SET_EDUCATION_DATA', data: savedEducation })
    }
  }, [savedEducation])

  // Fetch saved job history from database
  const { data: savedJobHistory, isLoading: isLoadingJobHistory } =
    useJobHistory()

  // Initialize job history data from fetched data (only once when data loads)
  useEffect(() => {
    if (savedJobHistory?.jobs && savedJobHistory.jobs.length > 0) {
      dispatch({ type: 'SET_JOB_HISTORY_DATA', data: savedJobHistory })
    }
  }, [savedJobHistory])

  // Fetch saved identity document from database
  const { data: savedIdentityDocument, isLoading: isLoadingIdentityDocument } =
    useIdentityDocument()

  // Initialize identity document files from fetched data (only once when data loads)
  const hasInitializedFromSaved = useRef(false)
  useEffect(() => {
    if (savedIdentityDocument && !hasInitializedFromSaved.current) {
      hasInitializedFromSaved.current = true

      // Set document type
      dispatch({
        type: 'SET_DOC_TYPE',
        docType: savedIdentityDocument.documentType,
      })

      // Set front file from saved URL
      if (savedIdentityDocument.frontImageUrl) {
        dispatch({
          type: 'SET_FRONT_FILE',
          file: {
            name: 'Previously uploaded document',
            size: 0,
            progress: 100,
            status: 'success',
            url: savedIdentityDocument.frontImageUrl,
          },
        })
      }

      // Set back file from saved URL
      if (savedIdentityDocument.backImageUrl) {
        dispatch({
          type: 'SET_BACK_FILE',
          file: {
            name: 'Previously uploaded document',
            size: 0,
            progress: 100,
            status: 'success',
            url: savedIdentityDocument.backImageUrl,
          },
        })
      }
    }
  }, [savedIdentityDocument])

  // Auto-save identity document when files are uploaded
  const { mutate: saveIdentityDocument } = useSaveIdentityDocument()
  const lastSavedFrontUrl = useRef<string | undefined>(undefined)
  const lastSavedBackUrl = useRef<string | undefined>(undefined)

  useEffect(() => {
    const frontUrl =
      state.frontFile?.status === 'success' ? state.frontFile.url : undefined
    const backUrl =
      state.backFile?.status === 'success' ? state.backFile.url : undefined

    const frontChanged = frontUrl !== lastSavedFrontUrl.current
    const backChanged = backUrl !== lastSavedBackUrl.current

    if ((frontChanged || backChanged) && (frontUrl || backUrl)) {
      lastSavedFrontUrl.current = frontUrl
      lastSavedBackUrl.current = backUrl

      saveIdentityDocument({
        documentType: state.selectedDocType,
        frontImageUrl: frontUrl,
        backImageUrl: backUrl,
      })
    }
  }, [
    state.frontFile?.status,
    state.frontFile?.url,
    state.backFile?.status,
    state.backFile?.url,
    state.selectedDocType,
    saveIdentityDocument,
  ])

  const currentStepIndex = applicableSteps.findIndex(
    (s) => s.id === state.currentStep,
  )
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === applicableSteps.length - 1

  const canContinue = useMemo(() => {
    switch (state.currentStep) {
      case 'personal_info':
        return state.personalInfo.isValid
      case 'education':
        // This case won't be reached for Employer/Agency, but keep for safety
        return requiresEducationAndJobHistory(userType)
          ? state.education.isValid
          : true
      case 'upload':
        return (
          state.frontFile?.status === 'success' &&
          state.backFile?.status === 'success'
        )
      case 'job_history':
        // This case won't be reached for Employer/Agency, but keep for safety
        return requiresEducationAndJobHistory(userType)
          ? state.jobHistory.isValid
          : true
      case 'review':
        return true
      default:
        return false
    }
  }, [
    state.currentStep,
    state.personalInfo.isValid,
    state.education.isValid,
    state.frontFile,
    state.backFile,
    state.jobHistory.isValid,
    userType,
  ])

  // Actions
  const actions = useMemo(
    () => ({
      goNext: () => dispatch({ type: 'GO_NEXT', steps: applicableSteps }),
      goBack: () => dispatch({ type: 'GO_BACK', steps: applicableSteps }),
      setStep: (step: VerificationStep) => dispatch({ type: 'SET_STEP', step }),
      setDocType: (docType: DocumentType) =>
        dispatch({ type: 'SET_DOC_TYPE', docType }),
      setFrontFile: (file: UploadedFile | null) =>
        dispatch({ type: 'SET_FRONT_FILE', file }),
      setBackFile: (file: UploadedFile | null) =>
        dispatch({ type: 'SET_BACK_FILE', file }),
      updateFrontFile: (
        updater: (prev: UploadedFile | null) => UploadedFile | null,
      ) => dispatch({ type: 'UPDATE_FRONT_FILE', updater }),
      updateBackFile: (
        updater: (prev: UploadedFile | null) => UploadedFile | null,
      ) => dispatch({ type: 'UPDATE_BACK_FILE', updater }),
      setPersonalInfoValid: (isValid: boolean) =>
        dispatch({ type: 'SET_PERSONAL_INFO_VALID', isValid }),
      setPersonalInfoData: (data: Partial<PersonalInfoFormData>) =>
        dispatch({ type: 'SET_PERSONAL_INFO_DATA', data }),
      setEducationValid: (isValid: boolean) =>
        dispatch({ type: 'SET_EDUCATION_VALID', isValid }),
      setEducationData: (data: Partial<EducationFormData>) =>
        dispatch({ type: 'SET_EDUCATION_DATA', data }),
      setJobHistoryValid: (isValid: boolean) =>
        dispatch({ type: 'SET_JOB_HISTORY_VALID', isValid }),
      setJobHistoryData: (data: JobHistoryFormData) =>
        dispatch({ type: 'SET_JOB_HISTORY_DATA', data }),
    }),
    [applicableSteps],
  )

  // Stable callbacks for form components
  const handlePersonalInfoValidChange = useCallback(
    (isValid: boolean) => actions.setPersonalInfoValid(isValid),
    [actions],
  )

  const handlePersonalInfoDataChange = useCallback(
    (data: Partial<PersonalInfoFormData>) => actions.setPersonalInfoData(data),
    [actions],
  )

  const handleEducationValidChange = useCallback(
    (isValid: boolean) => actions.setEducationValid(isValid),
    [actions],
  )

  const handleEducationDataChange = useCallback(
    (data: Partial<EducationFormData>) => actions.setEducationData(data),
    [actions],
  )

  const handleJobHistoryValidChange = useCallback(
    (isValid: boolean) => actions.setJobHistoryValid(isValid),
    [actions],
  )

  const handleJobHistoryDataChange = useCallback(
    (data: JobHistoryFormData) => actions.setJobHistoryData(data),
    [actions],
  )

  return {
    state,
    actions,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    canContinue,
    // User type and applicable steps
    userType,
    applicableSteps,
    // Loading states
    isLoadingPersonalInfo,
    isLoadingEducation,
    isLoadingIdentityDocument,
    isLoadingJobHistory,
    // Initial data from server (for form defaultValues)
    savedPersonalInfo,
    savedEducation,
    savedIdentityDocument,
    savedJobHistory,
    // Stable callbacks for child components
    handlePersonalInfoValidChange,
    handlePersonalInfoDataChange,
    handleEducationValidChange,
    handleEducationDataChange,
    handleJobHistoryValidChange,
    handleJobHistoryDataChange,
  }
}

// Alias for backwards compatibility
export const useWizardStateLocal = useWizardState
