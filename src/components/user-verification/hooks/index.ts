// Query keys
export { personalInfoKeys, educationKeys, identityDocumentKeys } from './keys'

// Query hooks
export { usePersonalInfo, getPersonalInfo } from './queries/use-personal-info'
export { useEducation, getEducation } from './queries/use-education'
export {
  useIdentityDocument,
  getIdentityDocument,
} from './queries/use-identity-document'

// Mutation hooks
export {
  useUpdatePersonalInfo,
  updatePersonalInfo,
} from './mutations/use-update-personal-info'
export {
  useUpdateEducation,
  updateEducation,
} from './mutations/use-update-education'
export {
  useSubmitIdentityDocument,
  submitIdentityDocument,
} from './mutations/use-submit-identity-document'
export {
  useSaveIdentityDocument,
  saveIdentityDocument,
} from './mutations/use-save-identity-document'
export {
  useDeleteIdentityFile,
  deleteIdentityFile,
} from './mutations/use-delete-identity-file'

// State hooks
export { useWizardState } from './use-wizard-state'
export type { WizardState } from './use-wizard-state'
