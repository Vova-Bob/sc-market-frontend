import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowSelectionModel,
  GridRowsProp,
  Toolbar,
} from "@mui/x-data-grid"
import React, { useEffect } from "react"
import { SelectGameItem } from "../../components/select/SelectGameItem"
import { Stack } from "@mui/system"
import { MinimalUser } from "../../datatypes/User"
import { defaultAvatar } from "../comments/CommentTree"
import { Autocomplete, IconButton, TextField } from "@mui/material"
import {
  AddRounded,
  CancelRounded,
  CreateRounded,
  DeleteRounded,
  SaveRounded,
} from "@mui/icons-material"
import { useGetUserProfileQuery } from "../../store/profile"
import { UserProfileState } from "../../hooks/login/UserProfile"
import { UserAvatar } from "../../components/avatar/UserAvatar"

interface StockEntry {
  id: string
  listing_id: string | null
  item_name: string | null
  item_category: string
  quantity_available: number
  location: string
  status: string
  owner: MinimalUser | UserProfileState
  isNew: boolean
}

export function StockEntryItemDisplay(props: {
  item_name: string
  item_category: string
  listing_id: string
}) {
  return `${props.item_category} ${props.item_name}`
}

declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void
  }
}

export function ItemStockRework() {
  const { data: profile } = useGetUserProfileQuery()
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>({ type: "include", ids: new Set() })
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
    {},
  )
  const [rows, setRows] = React.useState<StockEntry[]>([
    {
      isNew: false,
      id: "0",
      listing_id: "123",
      item_name: null,
      item_category: "Other",
      quantity_available: 15,
      location: "Area-18",
      status: "",
      owner: profile || {
        username: "...",
        display_name: "...",
        avatar: defaultAvatar,
        rating: {
          avg_rating: 0,
          rating_count: 0,
          streak: 0,
          total_orders: 0,
        },
      },
    },
  ])

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
  }

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = rows.find((row) => row.id === id)
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  const processRowUpdate = (newRow: StockEntry) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns: GridColDef<StockEntry>[] = [
    {
      sortable: true,
      field: "owner",
      display: "flex",
      headerName: "Owner",
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <UserAvatar user={params.value} />
      ),
    },
    {
      sortable: true,
      field: "item_category",
      width: 500,
      display: "flex",
      headerName: "Item",
      editable: true,
      renderCell: (params: GridRenderCellParams) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return (
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"center"}
              spacing={1}
              sx={{
                flexGrow: "1",
                "& > *": {
                  flexGrow: "1",
                },
              }}
            >
              <SelectGameItem
                item_type={params.row.item_category}
                item_name={params.row.item_name}
                onTypeChange={(item_category) =>
                  processRowUpdate({
                    ...params.row,
                    item_category,
                    item_name: null,
                  })
                }
                onItemChange={(item_name) => {
                  setRows((prev) =>
                    prev.map((row) =>
                      row.id === params.row.id ? { ...row, item_name } : row,
                    ),
                  )
                }}
                TextfieldProps={{
                  size: "small",
                }}
              />
            </Stack>
          )
        } else {
          return <StockEntryItemDisplay {...params.row} />
        }
      },
    },
    {
      field: "quantity_available",
      headerName: "Quantity",
      valueFormatter: (value: number) => value.toLocaleString(undefined),
    },
    {
      sortable: true,
      field: "location",
      width: 200,
      display: "flex",
      headerName: "Location",
      renderCell: (params: GridRenderCellParams) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return (
            <Autocomplete
              fullWidth
              size={"small"}
              freeSolo
              disableClearable
              value={params.value}
              options={rows.map((option) => option.location).filter((x) => x)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      type: "search",
                    },
                  }}
                />
              )}
            />
          )
        } else {
          return params.value
        }
      },
    },
    {
      sortable: false,
      field: "actions",
      type: "actions",
      headerName: "Actions",
      cellClassName: "actions",
      width: 75,
      getActions: ({ id, row }: GridRowParams<StockEntry>) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveRounded style={{ color: "primary.main" }} />}
              label="Save"
              key={"save"}
              // disabled={row.game_item === null}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelRounded />}
              key={"cancel"}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<CreateRounded />}
            label="Edit"
            key={"edit"}
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteRounded />}
            label="Delete"
            key={"delete"}
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  useEffect(() => {
    console.log(rows)
  }, [rows])

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      onRowSelectionModelChange={setRowSelectionModel}
      rowSelectionModel={rowSelectionModel}
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
      }}
      processRowUpdate={processRowUpdate}
      showToolbar
      slots={{
        toolbar: () => {
          return (
            <Toolbar>
              <IconButton
                onClick={() => {
                  const id = rows.length.toString()
                  setRows((prev) => [
                    ...prev,
                    {
                      id,
                      listing_id: null,
                      item_name: null,
                      item_category: "Other",
                      quantity_available: 0,
                      location: "",
                      status: "",
                      owner: profile!,
                      isNew: true,
                    },
                  ])

                  setRowModesModel((oldModel) => ({
                    ...oldModel,
                    [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
                  }))
                }}
              >
                <AddRounded />
              </IconButton>
            </Toolbar>
          )
        },
      }}
    />
  )
}
