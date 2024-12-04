import React from "react"
import { AlertInterface } from "../../datatypes/Alert"

export const AlertHookContext = React.createContext<
  | [
      AlertInterface | null,
      React.Dispatch<React.SetStateAction<AlertInterface | null>>,
    ]
  | null
>(null)

export interface ErrorInterface {
  status: number
  data: {
    message: string
    error?: {
      message: string
    }
    errors: {
      message: string
    }[]
    validationErrors: {
      instancePath: string
      schemaPath: string
      keyword: string
      params: object
      message: string
    }[]
  }
}

export function formatErrorAlert(error: ErrorInterface): AlertInterface {
  let message = error.data.error?.message || error.data.message
  if (error.data.errors?.length) {
    message = message.concat(" ", error.data.errors[0].message)
  } else if (error.data.validationErrors?.length) {
    const splitPath = error.data.validationErrors[0].instancePath.split("/")
    const field = splitPath[splitPath.length - 1]
    message = message.concat(
      ": ",
      field,
      " ",
      error.data.validationErrors[0].message,
    )
  }

  return {
    message,
    severity: "error",
  }
}

export const useAlertHook = () => {
  const val = React.useContext(AlertHookContext)
  if (val == null) {
    throw new Error("Cannot use useAlertHook outside of AlertHookContext")
  }

  const [, setAlert] = val

  function issueAlert(alert: AlertInterface): void
  function issueAlert(error: ErrorInterface): void
  function issueAlert(arg1: AlertInterface | ErrorInterface): void {
    if ((arg1 as AlertInterface).severity) {
      setAlert(arg1 as AlertInterface)
    } else {
      setAlert(formatErrorAlert(arg1 as ErrorInterface))
    }
  }

  return issueAlert
}
