import { DataGrid, DataGridProps } from "@mui/x-data-grid"
import React from "react"
import { useTranslation } from "react-i18next"

export function ThemedDataGrid(props: DataGridProps) {
  const { t } = useTranslation()
  return (
    <DataGrid
      {...props}
      localeText={{
        noRowsLabel: t("ui.datagrid.noRows"),
        noResultsOverlayLabel: t("ui.datagrid.noResults"),
        footerPaginationRowsPerPage: t("ui.datagrid.rowsPerPage"),
        footerPaginationLabelDisplayedRows: ({ from, to, count }) =>
          t("ui.datagrid.displayedRows", { from, to, count }),
        ...props.localeText,
      }}
      sx={{
        borderColor: "outline.main",
        [`& .MuiDataGrid-cell, & .MuiDataGrid-filler > *, & .MuiDataGrid-footerContainer, & .MuiDataGrid-columnSeparator, & .MuiDataGrid-toolbar`]:
          {
            borderColor: "outline.main",
          },
        ".MuiDataGrid-columnSeparator": {
          color: "outline.main",
        },
        [".MuiDataGrid-menu"]: {
          color: "white",
        },
        ...props.sx,
      }}
    />
  )
}
