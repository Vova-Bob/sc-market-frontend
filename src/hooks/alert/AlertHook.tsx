import React from "react"
import { AlertInterface } from "../../datatypes/Alert"
import i18n from "../../util/i18n"

export const AlertHookContext = React.createContext<
  | [
      AlertInterface | null,
      React.Dispatch<React.SetStateAction<AlertInterface | null>>,
    ]
  | null
>(null)

export interface UnwrappedErrorInterface {
  message: string
  code?: string
  error?: {
    message: string
    code?: string
  }
  errors: {
    message: string
    code?: string
  }[]
  validationErrors: {
    instancePath: string
    schemaPath: string
    keyword: string
    params: object
    message: string
  }[]
}

export interface ErrorInterface {
  status: number
  data: UnwrappedErrorInterface
}

export function formatErrorAlert(
  error: UnwrappedErrorInterface,
): AlertInterface {
  const code = error.error?.code || error.code || error.errors?.[0]?.code
  if (code) {
    return {
      message: i18n.t(`errors.${code}`),
      severity: "error",
    }
  }
  let message = error.error?.message || error.message
  if (error.errors?.length) {
    message = message.concat(" ", error.errors[0].message)
  } else if (error.validationErrors?.length) {
    const splitPath = error.validationErrors[0].instancePath.split("/")
    const field = splitPath[splitPath.length - 1]
    message = message.concat(
      ": ",
      field,
      " ",
      error.validationErrors[0].message,
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
  function issueAlert(error: UnwrappedErrorInterface): void
  function issueAlert(
    arg1: AlertInterface | ErrorInterface | UnwrappedErrorInterface,
  ): void {
    if ((arg1 as AlertInterface).severity) {
      setAlert(arg1 as AlertInterface)
    } else if ((arg1 as ErrorInterface).data) {
      setAlert(formatErrorAlert((arg1 as ErrorInterface).data))
    } else {
      setAlert(formatErrorAlert(arg1 as UnwrappedErrorInterface))
    }
  }

  return issueAlert
}
