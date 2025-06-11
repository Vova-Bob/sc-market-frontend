import React, { useState } from "react"
import { Button, FormControlLabel, Grid, Paper, Switch } from "@mui/material"
import { GridColDef } from "@mui/x-data-grid"
import { useGetUserProfileQuery } from "../../store/profile"
import {
  useGetContractorBySpectrumIDQuery,
  useLeaveContractorMutation,
} from "../../store/contractor"
import { ThemedDataGrid } from "../../components/grid/ThemedDataGrid"

export function SettingsManageContractors() {
  const { data: profile } = useGetUserProfileQuery()
  const [showOrgOnProfile, setShowOrgOnProfile] = useState(true)

  const [leaveOrg] = useLeaveContractorMutation()

  const handleLeaveOrg = (spectrum_id: string) => {
    leaveOrg(spectrum_id)
  }

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    // {
    //   field: "shown",
    //   renderHeader: () => null,
    //   headerName: "Show on Profile",
    //   sortable: true,
    //   renderCell: ({ value }) => (
    //     <FormControlLabel
    //       control={
    //         <Switch
    //           checked={showOrgOnProfile}
    //           onChange={(e) => setShowOrgOnProfile(e.target.checked)}
    //         />
    //       }
    //       label="Show organization on profile"
    //       sx={{ mb: 2 }}
    //     />
    //   ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      align: "right",
      renderCell: ({ row }) => {
        const { data: contractor } = useGetContractorBySpectrumIDQuery(
          row.spectrum_id,
        )

        const ownerRole = (contractor?.roles || []).find(
          (role) => role.position === 0,
        )

        const myMember = (contractor?.members || [])?.find(
          (member) => member.username === profile?.username,
        )

        const isOwner = !!myMember?.roles?.find(
          (role) => ownerRole?.role_id === role,
        )

        if (isOwner) {
          return null
        }

        return (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleLeaveOrg(row.spectrum_id)}
          >
            Leave Organization
          </Button>
        )
      },
    },
  ]

  return (
    <Grid item xs={12}>
      <Paper>
        <ThemedDataGrid
          rows={profile?.contractors || []}
          getRowId={(row) => row.spectrum_id}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
        />
      </Paper>
    </Grid>
  )
}
