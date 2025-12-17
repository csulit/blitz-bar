'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { createMongoAbility } from '@casl/ability'
import { createContextualCan } from '@casl/react'
import {
  createAbilityFromRules,
  type AppAbility,
  type AppAbilityRules,
} from '@/lib/casl'

// Create a default empty ability for initial context
const defaultAbility = createMongoAbility([])

const AbilityContext = createContext<AppAbility>(defaultAbility as AppAbility)

export const Can = createContextualCan(AbilityContext.Consumer)

interface AbilityProviderProps {
  children: ReactNode
  rules: AppAbilityRules
}

export function AbilityProvider({ children, rules }: AbilityProviderProps) {
  const ability = useMemo(() => {
    return createAbilityFromRules(rules)
  }, [rules])

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  )
}

export function useAbilityContext(): AppAbility {
  return useContext(AbilityContext)
}
