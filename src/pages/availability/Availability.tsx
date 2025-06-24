import { Page } from "../../components/metadata/Page"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import React, { useCallback, useMemo, useState } from "react"
import {
  AvailabilitySelector,
  generateInitialSelection,
} from "../../components/time/AvailabilitySelector"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useProfileGetAvailabilityQuery,
  useProfileUpdateAvailabilityMutation,
} from "../../store/profile"
import { Grid, Skeleton } from "@mui/material"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { AvailabilitySelection } from "../../hooks/login/UserProfile"

interface Span {
  start: number
  finish: number
}

export function convertAvailability(availability: AvailabilitySelection[]) {
  const result = generateInitialSelection()

  for (const span of availability) {
    for (let i = span.start; i <= span.finish; i++) {
      result[i] = true
    }
  }

  return result
}

export function Availability() {
  const [savedSelections, setSavedSelections] = useState<boolean[][] | null>(
    null,
  )

  const [currentOrg] = useCurrentOrg()

  const [updateAvailability] = useProfileUpdateAvailabilityMutation()

  const { data: availability } = useProfileGetAvailabilityQuery(
    currentOrg?.spectrum_id,
  )

  const issueAlert = useAlertHook()

  const saveCallback = useCallback(
    async (selections: boolean[]) => {
      const spans: Span[] = []
      let current: Span | null = null

      // Convert boolean slots to bounded spans
      for (let i = 0; i < selections.length; i++) {
        if (selections[i]) {
          if (current) {
            current.finish = i
          } else {
            current = { start: i, finish: i - 1 }
          }
        } else {
          if (current) {
            spans.push(current)
            current = null
          }
        }
      }

      if (current) {
        spans.push(current)
        current = null
      }

      updateAvailability({
        contractor: currentOrg?.spectrum_id || null,
        selections: spans,
      })
        .unwrap()
        .then((data) => {
          issueAlert({
            message: "Updated availability!",
            severity: "success",
          })
        })
        .catch((error) =>
          issueAlert({
            message: `Failed to update! ${
              error?.error || error?.data?.error || error
            }`,
            severity: "error",
          }),
        )
    },
    [currentOrg?.spectrum_id, issueAlert, updateAvailability],
  )

  const initial = useMemo(
    () => convertAvailability(availability?.selections || []),
    [availability],
  )

  return (
    <Page title={"My Availability"}>
      <ContainerGrid maxWidth={"lg"} sidebarOpen={true}>
        <HeaderTitle xs={12}>My Availability</HeaderTitle>

        {availability ? (
          <AvailabilitySelector
            onSave={saveCallback}
            initialSelections={initial}
          />
        ) : (
          <Grid item xs={12}>
            <Skeleton width={"100%"} height={400} />
          </Grid>
        )}
      </ContainerGrid>
    </Page>
  )
}
