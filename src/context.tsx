import * as React from 'react'

export const HotkeysContext = React.createContext<any>({})

interface HotkeysProviderProps {
  defaultScope: string[]
}

export const HotkeysProvider: React.FunctionComponent<HotkeysProviderProps> = ({
  children,
  defaultScope = []
}) => {
  const [scopes, setScope] = React.useState<string[]>(defaultScope)

  function addScopes (scopesToAdd: string[]) {
    setScope(scopes.concat(scopesToAdd))
  }

  function removeScopes (scopesToRemove: string[]) {
    setScope(scopes.filter(el => !scopesToRemove.includes(el)))
  }

  const value = {
    activeScope: scopes[scopes.length - 1],
    addScopes,
    removeScopes
  }

  return (
    <HotkeysContext.Provider
      children={children}
      value={value}
    />
  )
}

export const HotkeysConsumer = HotkeysContext.Consumer
