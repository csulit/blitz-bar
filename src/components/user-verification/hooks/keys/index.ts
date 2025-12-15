export const personalInfoKeys = {
  all: ['personalInfo'] as const,
  detail: () => [...personalInfoKeys.all, 'detail'] as const,
}

export const educationKeys = {
  all: ['education'] as const,
  detail: () => [...educationKeys.all, 'detail'] as const,
}

export const identityDocumentKeys = {
  all: ['identityDocument'] as const,
  detail: () => [...identityDocumentKeys.all, 'detail'] as const,
}

export const jobHistoryKeys = {
  all: ['jobHistory'] as const,
  detail: () => [...jobHistoryKeys.all, 'detail'] as const,
}

export const verificationStatusKeys = {
  all: ['verificationStatus'] as const,
  detail: () => [...verificationStatusKeys.all, 'detail'] as const,
}
