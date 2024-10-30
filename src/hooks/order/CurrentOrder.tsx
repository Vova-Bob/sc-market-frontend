import React from "react"
import { Order } from "../../datatypes/Order"

export const CurrentOrderContext = React.createContext<
  [Order, () => void] | null
>(null)

export const useCurrentOrder = () => {
  let val = React.useContext(CurrentOrderContext)
  if (val == null) {
    throw new Error("Cannot use useCurrentOrder outside of CurrentOrderContext")
  }
  return val
}
