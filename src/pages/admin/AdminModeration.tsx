import React, { useState } from "react"
import { Page } from "../../components/metadata/Page"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import { useTranslation } from "react-i18next"
import {
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
} from "@mui/material"
import { useGetAdminReportsQuery } from "../../store/moderation"
import { ContentReport } from "../../store/moderation"
import { UserDetails } from "../../components/list/UserDetails"
import { ThemedDataGrid } from "../../components/grid/ThemedDataGrid"
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { HeaderTitle } from "../../components/typography/HeaderTitle"

export function AdminModeration() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [statusFilter, setStatusFilter] = useState<string>("")

  const {
    data: reportsData,
    isLoading,
    error,
  } = useGetAdminReportsQuery({
    page,
    page_size: pageSize,
    ...(statusFilter && { status: statusFilter as any }),
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const columns: GridColDef[] = [
    {
      field: "reporter",
      headerName: "Reporter",
      width: 200,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <UserDetails user={params.value} />
      ),
    },
    {
      field: "reported_url",
      headerName: "Reported URL",
      width: 300,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="text"
          color="primary"
          onClick={() => window.open(params.value, "_blank")}
        >
          Link
        </Button>
      ),
    },
    {
      field: "report_reason",
      headerName: "Reason",
      width: 150,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color="primary"
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      field: "created_at",
      headerName: "Created",
      width: 120,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">
          {new Date(params.value).toLocaleDateString()}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={
            params.value === "pending"
              ? "warning"
              : params.value === "in_progress"
                ? "info"
                : params.value === "resolved"
                  ? "success"
                  : "default"
          }
          size="small"
        />
      ),
    },
  ]

  // Transform the data to include an 'id' field for DataGrid
  const rows = React.useMemo(() => {
    if (!reportsData?.reports) return []
    return reportsData.reports.map((report) => ({
      ...report,
      id: report.report_id,
    }))
  }, [reportsData?.reports])

  return (
    <Page title={t("admin.moderation", "Admin Moderation")}>
      <ContainerGrid maxWidth={"xl"} sidebarOpen={true}>
        <Grid
          item
          container
          xs={12}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <HeaderTitle xs={12} md={6}>
            Moderation Dashboard
          </HeaderTitle>
          <Grid item xs={12} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="dismissed">Dismissed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {reportsData && (
          <Grid item xs={12}>
            <ThemedDataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              disableRowSelectionOnClick
              autoHeight
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: {
                  paginationModel: { page: page - 1, pageSize },
                },
              }}
              onPaginationModelChange={(model) => {
                setPage(model.page + 1)
                setPageSize(model.pageSize)
              }}
              loading={isLoading}
            />
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <Typography variant="body1" color="error">
              Error loading moderation reports: {JSON.stringify(error)}
            </Typography>
          </Grid>
        )}
      </ContainerGrid>
    </Page>
  )
}
