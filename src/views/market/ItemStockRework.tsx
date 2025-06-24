import {
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
  GridValidRowModel,
  Toolbar,
} from "@mui/x-data-grid"
import React, { useCallback, useEffect } from "react"
import { Stack } from "@mui/system"
import { MinimalUser } from "../../datatypes/User"
import {
  Autocomplete,
  Button,
  ButtonGroup,
  IconButton,
  Switch,
  TextField,
  Tooltip,
} from "@mui/material"
import {
  AddRounded,
  CancelRounded,
  CreateRounded,
  DeleteRounded,
  RemoveRounded,
  SaveRounded,
} from "@mui/icons-material"
import { useGetUserProfileQuery } from "../../store/profile"
import { UserProfileState } from "../../hooks/login/UserProfile"
import { UserAvatar } from "../../components/avatar/UserAvatar"
import { ThemedDataGrid } from "../../components/grid/ThemedDataGrid"
import { SelectMarketListing } from "../../components/select/SelectMarketListing.tsx"
import { UniqueListing } from "../../datatypes/MarketListing.ts"
import { NumericFormat } from "react-number-format"

interface StockEntry extends GridValidRowModel {
  id: string
  listing: UniqueListing | null
  quantity_available: number
  location: string
  status: string
  owner: MinimalUser | UserProfileState
  isNew: boolean
  listed: boolean
}

export function StockEntryItemDisplay(props: {
  listing: UniqueListing | null
}) {
  if (!props.listing || !props.listing.details) {
    return "No item selected"
  }
  return `${props.listing.details.item_type} / ${props.listing.details.title}`
}

export function ManageStockArea(props: { 
  selectedRows: StockEntry[]
  onUpdateQuantity: (rowId: string, newQuantity: number) => void
}) {
  const [quantity, setQuantity] = React.useState(1)
  const { selectedRows, onUpdateQuantity } = props

  const updateSelectedRows = useCallback((operation: (currentQty: number) => number) => {
    selectedRows.forEach((row) => {
      const currentQuantity = row.quantity_available
      const newQuantity = operation(currentQuantity)
      onUpdateQuantity(row.id, Math.max(0, newQuantity))
    })
  }, [selectedRows, onUpdateQuantity])

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <NumericFormat
        decimalScale={0}
        allowNegative={false}
        customInput={TextField}
        thousandSeparator
        onValueChange={async (values) => {
          setQuantity(values.floatValue || 0)
        }}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          type: "numeric",
          size: "small",
        }}
        sx={{
          minWidth: 200,
        }}
        size="small"
        label={"Update Amount"}
        value={quantity}
        color={"secondary"}
      />

      <ButtonGroup size={"small"}>
        <Button
          variant={"contained"}
          onClick={() => updateSelectedRows((currentQty) => currentQty + quantity)}
          color={"success"}
          startIcon={<AddRounded />}
        >
          Add
        </Button>

        <Button
          variant={"contained"}
          onClick={() => updateSelectedRows(() => 0)}
          color={"warning"}
        >
          0
        </Button>
        <Button
          variant={"contained"}
          onClick={() => updateSelectedRows((currentQty) => currentQty - quantity)}
          color={"error"}
          startIcon={<RemoveRounded />}
        >
          Sub
        </Button>
      </ButtonGroup>
    </Stack>
  )
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
  const [rows, setRows] = React.useState<StockEntry[]>([])

  // Temporary state for editing - changes are only applied on save
  const [editingRows, setEditingRows] = React.useState<
    Record<string, Partial<StockEntry>>
  >({})

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event,
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    // Initialize editing state with current row data
    const currentRow = rows.find((row) => row.id === id)
    if (currentRow) {
      setEditingRows((prev) => ({
        ...prev,
        [id]: { ...currentRow },
      }))
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id: GridRowId) => () => {
    // Apply the editing changes to the actual rows
    const editingRow = editingRows[id]
    console.log('Saving row:', id, 'Editing data:', editingRow)
    
    if (editingRow) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, ...editingRow, isNew: false } : row,
        ),
      )
      // Clear the editing state for this row
      setEditingRows((prev) => {
        const newState = { ...prev }
        delete newState[id]
        return newState
      })
    }
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleToggleEnable = (id: GridRowId) => () => {
    setRows(
      rows.map((entry) =>
        entry.id === id ? { ...entry, listed: !entry.listed } : entry,
      ),
    )
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id))
    // Clear editing state if this row was being edited
    setEditingRows((prev) => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
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

    // Clear the editing state for this row
    setEditingRows((prev) => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
  }

  const processRowUpdate = (newRow: StockEntry) => {
    const updatedRow = { ...newRow, isNew: false }
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const handleUpdateQuantity = useCallback((rowId: string, newQuantity: number) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === rowId ? { ...row, quantity_available: newQuantity } : row,
      ),
    )
    
    // Also update editing state if this row is being edited
    setEditingRows((prev) => {
      if (prev[rowId]) {
        return {
          ...prev,
          [rowId]: { ...prev[rowId], quantity_available: newQuantity },
        }
      }
      return prev
    })
  }, [])

  const selectedRows = React.useMemo(() => {
    return rows.filter((row) => rowSelectionModel.ids.has(row.id))
  }, [rows, rowSelectionModel.ids])

  const columns: GridColDef[] = [
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
      field: "listing",
      width: 450,
      display: "flex",
      headerName: "Item",
      renderCell: (params: GridRenderCellParams) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          // Use editing state for the current value
          const editingRow = editingRows[params.id]
          const currentListing = editingRow?.listing || params.value?.listing

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
              <SelectMarketListing
                listing_id={currentListing?.listing?.listing_id || null}
                onListingChange={(newListing) => {
                  // Update editing state instead of immediately updating rows
                  setEditingRows((prev) => ({
                    ...prev,
                    [params.id]: { ...prev[params.id], listing: newListing },
                  }))
                }}
                TextfieldProps={{
                  size: "small",
                }}
              />
            </Stack>
          )
        } else {
          return <StockEntryItemDisplay listing={params.value} />
        }
      },
    },
    {
      field: "quantity_available",
      headerName: "Quantity",
      display: "flex",
      valueFormatter: (value: number) => value.toLocaleString(undefined),
      renderCell: (params: GridRenderCellParams) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          const editingRow = editingRows[params.id]
          const currentQuantity = editingRow?.quantity_available ?? params.value
          
          return (
            <NumericFormat
              decimalScale={0}
              allowNegative={false}
              customInput={TextField}
              thousandSeparator
              onValueChange={async (values) => {
                // Update editing state instead of immediately updating rows
                setEditingRows((prev) => {
                  const newState = {
                    ...prev,
                    [params.id]: {
                      ...prev[params.id],
                      quantity_available: +values.floatValue! || 1,
                    },
                  }
                  console.log('Quantity editing state updated:', params.id, newState[params.id])
                  return newState
                })
              }}
              inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              InputProps={{
                inputMode: "numeric",
              }}
              size="small"
              label={"Qty."}
              value={currentQuantity}
              color={"secondary"}
            />
          )
        } else {
          // Show formatted value when not editing
          return params.value.toLocaleString(undefined)
        }
      },
    },
    {
      sortable: true,
      field: "location",
      width: 150,
      display: "flex",
      headerName: "Location",
      renderCell: (params: GridRenderCellParams) => {
        const isInEditMode =
          rowModesModel[params.id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          const editingRow = editingRows[params.id]
          const currentLocation = editingRow?.location ?? params.value

          return (
            <Autocomplete
              fullWidth
              size={"small"}
              freeSolo
              disableClearable
              value={currentLocation}
              options={rows.map((option) => option.location).filter((x) => x)}
              onChange={(event, newValue) => {
                // Update editing state instead of immediately updating rows
                setEditingRows((prev) => {
                  const newState = {
                    ...prev,
                    [params.id]: { ...prev[params.id], location: newValue || "" },
                  }
                  console.log('Location editing state updated:', params.id, newState[params.id])
                  return newState
                })
              }}
              onInputChange={(event, newInputValue) => {
                // Also update on input change to capture typing immediately
                setEditingRows((prev) => {
                  const newState = {
                    ...prev,
                    [params.id]: { ...prev[params.id], location: newInputValue || "" },
                  }
                  console.log('Location input updated:', params.id, newState[params.id])
                  return newState
                })
              }}
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
          // Check if the listing is null to disable save button
          const editingRow = editingRows[id]
          const hasValidListing = editingRow?.listing
          
          return [
            <GridActionsCellItem
              icon={<SaveRounded style={{ color: "primary.main" }} />}
              label="Save"
              key={"save"}
              onClick={handleSaveClick(id)}
              disabled={!hasValidListing}
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
    {
      sortable: true,
      field: "listed",
      display: "flex",
      headerName: "Listed",
      width: 75,
      renderCell: ({ id, value }) => {
        return (
          <Tooltip title="Toggle whether stock is listed">
            <Switch checked={value} onClick={handleToggleEnable(id)} />
          </Tooltip>
        )
      },
    },
  ]

  useEffect(() => {
    console.log(rows)
  }, [rows])

  return (
    <ThemedDataGrid
      rows={rows}
      columns={columns}
      getRowId={(row) => row.id}
      disableRowSelectionOnClick
      checkboxSelection
      onRowSelectionModelChange={setRowSelectionModel}
      rowSelectionModel={rowSelectionModel}
      processRowUpdate={
        processRowUpdate as unknown as (
          newRow: GridValidRowModel,
        ) => GridValidRowModel
      }
      showToolbar
      slots={{
        toolbar: () => {
          return (
            <Toolbar>
              <ManageStockArea 
                selectedRows={selectedRows}
                onUpdateQuantity={handleUpdateQuantity}
              />
              <Tooltip title={"Add Row"}>
                <IconButton
                  onClick={() => {
                    const id = rows.length.toString()
                    const newRow = {
                      id,
                      listing: null,
                      quantity_available: 0,
                      location: "",
                      status: "",
                      owner: profile!,
                      isNew: true,
                      listed: true,
                    }

                    setRows((prev) => [...prev, newRow])

                    // Initialize editing state for the new row
                    setEditingRows((prev) => ({
                      ...prev,
                      [id]: { ...newRow },
                    }))

                    setRowModesModel((oldModel) => ({
                      ...oldModel,
                      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
                    }))
                  }}
                >
                  <AddRounded />
                </IconButton>
              </Tooltip>
            </Toolbar>
          )
        },
      }}
    />
  )
}
