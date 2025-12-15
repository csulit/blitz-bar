export type VerificationStep =
  | 'personal_info'
  | 'education'
  | 'upload'
  | 'job_history'
  | 'review'
export type DocumentType = 'identity_card' | 'driver_license' | 'passport'
export type UploadStatus = 'uploading' | 'success' | 'error'

export interface UploadedFile {
  name: string
  size: number
  progress: number
  status: UploadStatus
  url?: string
}
