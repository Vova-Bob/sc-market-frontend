// ThemedDataGrid.tsx
import React, { useMemo } from "react"
import {
  DataGrid,
  DataGridProps,
  GridLocaleText,
  useGridApiContext,
  useGridSelector,
  gridPageSelector,
  gridPageCountSelector,
  gridPageSizeSelector,
  gridRowCountSelector,
} from "@mui/x-data-grid"
import TablePagination from "@mui/material/TablePagination"
import { useTranslation } from "react-i18next"

// Custom pagination wired to DataGrid state
function LocalizedTablePagination() {
  const { t } = useTranslation()
  const apiRef = useGridApiContext()
  const page = useGridSelector(apiRef, gridPageSelector)
  const pageCount = useGridSelector(apiRef, gridPageCountSelector)
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector)
  const rowCount = useGridSelector(apiRef, gridRowCountSelector)

  const handlePageChange = (_: any, value: number) =>
    apiRef.current.setPage(value)
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    apiRef.current.setPageSize(Number(e.target.value))

  return (
    <TablePagination
      // rows per page
      labelRowsPerPage={t("ui.datagrid.rowsPerPage")}
      // "1–10 of 123" / "1–10 of more than 10"
      labelDisplayedRows={({ from, to, count }) =>
        count === -1
          ? t("ui.datagrid.displayedRowsMore", { from, to })
          : t("ui.datagrid.displayedRows", { from, to, count })
      }
      component="div"
      count={rowCount ?? -1}
      page={Math.min(page, Math.max(0, pageCount - 1))}
      onPageChange={handlePageChange}
      rowsPerPage={pageSize}
      onRowsPerPageChange={handleRowsPerPageChange}
      // let MUI render the same icons/styles
      SelectProps={{ native: true }}
      showFirstButton
      showLastButton
    />
  )
}

export function ThemedDataGrid(props: DataGridProps) {
  const { t } = useTranslation()

  // Grid own strings
  const localeText: GridLocaleText = useMemo(
    () => ({
      noRowsLabel: t("ui.datagrid.noRows"),
      noResultsOverlayLabel: t("ui.datagrid.noResults"),
      ...(props.localeText || {}),
    }),
    [t, props.localeText],
  )

  // Attach our pagination slot for both v5/v6 APIs
  const mergedProps: any = {
    ...props,
    slots: { ...(props as any).slots, pagination: LocalizedTablePagination },
    components: {
      ...(props as any).components,
      Pagination: LocalizedTablePagination,
    },
  }

  return (
    <DataGrid
      {...mergedProps}
      localeText={localeText}
      sx={{
        borderColor: "outline.main",
        [`& .MuiDataGrid-cell, & .MuiDataGrid-filler > *, & .MuiDataGrid-footerContainer, & .MuiDataGrid-columnSeparator, & .MuiDataGrid-toolbar`]:
          { borderColor: "outline.main" },
        ".MuiDataGrid-columnSeparator": { color: "outline.main" },
        [".MuiDataGrid-menu"]: { color: "white" },
        ...(props.sx as any),
      }}
    />
  )
}
