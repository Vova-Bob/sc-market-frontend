import { Navigate, useParams } from "react-router-dom"
import React, { useCallback, useEffect, useState } from "react"
import { Page } from "../../components/metadata/Page"
import { useAcceptContractorInviteCodeMutation } from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"

export function AcceptOrgInvite() {
  const { invite_id } = useParams<{ invite_id: string }>()
  const [redirect, setRedirect] = useState(false)
  const [errorRedirect, setErrorRedirect] = useState(false)

  const issueAlert = useAlertHook()

  const [
    acceptInvite, // This is the mutation trigger
  ] = useAcceptContractorInviteCodeMutation()

  const runAccept = useCallback(async () => {
    let res: { data?: any; error?: any } = await acceptInvite(invite_id || "")

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Accepted invite!",
        severity: "success",
      })
      setRedirect(true)
    } else {
      issueAlert({
        message: `Failed to accept! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
      setErrorRedirect(true)
    }
  }, [acceptInvite, invite_id, issueAlert])

  useEffect(() => {
    runAccept()
  }, [runAccept])

  return (
    <Page title={`Accept Invite`}>
      {redirect && <Navigate to={"/"} />}
      {errorRedirect && <Navigate to={"/404"} />}
    </Page>
  )
}
