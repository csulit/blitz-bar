import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { steps } from '../constants'
import { usePersonalInfo } from './queries/use-personal-info'
import { useEducation } from './queries/use-education'
import type { DocumentType, UploadedFile, VerificationStep } from '../types'
import type { PersonalInfoFormData } from '@/lib/schemas/personal-info'
import type { EducationFormData } from '@/lib/schemas/education'

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
}

// Actions
type WizardAction =
  | { type: 'GO_NEXT' }
  | { type: 'GO_BACK' }
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
}

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'GO_NEXT': {
      const currentIndex = steps.findIndex((s) => s.id === state.currentStep)
      if (currentIndex < steps.length - 1) {
        return { ...state, currentStep: steps[currentIndex + 1].id }
      }
      return state
    }
    case 'GO_BACK': {
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
    default:
      return state
  }
}

export function useWizardState() {
  const { step: urlStep } = useSearch({
    from: '/_pending_verification/verification-documents',
  })
  const navigate = useNavigate()

  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    currentStep: urlStep ?? 'personal_info',
  })

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

  // Sync current step to URL query params
  useEffect(() => {
    void navigate({
      to: '/verification-documents',
      search: { step: state.currentStep },
      replace: true,
    })
  }, [state.currentStep, navigate])

  const currentStepIndex = steps.findIndex((s) => s.id === state.currentStep)
  const isFirstStep = currentStepIndex === 0
  const isLastStep = currentStepIndex === steps.length - 1

  const canContinue = useMemo(() => {
    switch (state.currentStep) {
      case 'personal_info':
        return state.personalInfo.isValid
      case 'education':
        return state.education.isValid
      case 'setup':
        return (
          state.frontFile?.status === 'success' &&
          state.backFile?.status === 'success'
        )
      case 'verification':
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
  ])

  // Actions
  const actions = useMemo(
    () => ({
      goNext: () => dispatch({ type: 'GO_NEXT' }),
      goBack: () => dispatch({ type: 'GO_BACK' }),
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
    }),
    [],
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

  return {
    state,
    actions,
    currentStepIndex,
    isFirstStep,
    isLastStep,
    canContinue,
    // Loading states
    isLoadingPersonalInfo,
    isLoadingEducation,
    // Initial data from server (for form defaultValues)
    savedPersonalInfo,
    savedEducation,
    // Stable callbacks for child components
    handlePersonalInfoValidChange,
    handlePersonalInfoDataChange,
    handleEducationValidChange,
    handleEducationDataChange,
  }
}
