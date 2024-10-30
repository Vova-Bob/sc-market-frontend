import React, { useEffect, useState } from "react"
import { Contractor } from "../../datatypes/Contractor"

export const CurrentOrgContext = React.createContext<
  | [Contractor | null, React.Dispatch<React.SetStateAction<Contractor | null>>]
  | null
>(null)

export const useCurrentOrg = () => {
  let val = React.useContext(CurrentOrgContext)
  if (val == null) {
    throw new Error("Cannot use useCurrentOrg outside of CurrentOrgContext")
  }
  return val
}

export function CurrentOrgProvider(props: { children: React.ReactNode }) {
  const [currentOrg, setCurrentOrg] = useState<Contractor | null>(null)

  return (
    <CurrentOrgContext.Provider value={[currentOrg, setCurrentOrg]}>
      {props.children}
    </CurrentOrgContext.Provider>
  )
}
