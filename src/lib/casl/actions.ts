export const Actions = {
  // CRUD actions
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',

  // CASL special action - represents all actions
  MANAGE: 'manage',

  // Domain-specific actions
  APPROVE: 'approve',
  REJECT: 'reject',
  REQUEST_INFO: 'request_info',
  SUBMIT: 'submit',
  INVITE: 'invite',
  REMOVE: 'remove',
} as const

export type Action = (typeof Actions)[keyof typeof Actions]
