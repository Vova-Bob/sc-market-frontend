import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import { Section } from "../../components/paper/Section"
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import { useGetUserProfileQuery } from "../../store/profile"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { Contractor, ContractorRole } from "../../datatypes/Contractor"
import {
  KeyboardArrowDownRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material"
import { BorderlessCell } from "../orders/Services"
import { useTheme } from "@mui/material/styles"
import { ExtendedTheme } from "../../hooks/styles/Theme"
import {
  useCreateContractorRoleMutation,
  useDeleteContractorRoleMutation,
  useUpdateContractorRoleMutation,
} from "../../store/contractor"
import { useTranslation } from "react-i18next"

export function has_permission(
  contractor: Contractor | undefined | null,
  user:
    | {
        username: string
      }
    | undefined
    | null,
  permission_name: keyof ContractorRole,
) {
  if (!contractor || !user) {
    return false
  }

  const member = contractor.members.find((u) => u.username === user.username)

  if (!member) {
    return false
  }

  for (const role_id of member.roles) {
    const role = (contractor.roles || []).find((r) => r.role_id === role_id)

    if (!role) continue
    if (role[permission_name]) return true
  }

  return false
}

export function min_position(
  contractor: Contractor,
  user: { username: string },
) {
  if (!contractor || !user) {
    return undefined
  }

  const member = contractor.members.find((u) => u.username === user.username)

  if (!member) {
    return undefined
  }

  return Math.min(
    ...contractor
      .roles!.filter((r) => member.roles.includes(r.role_id))
      .map((r) => r.position),
  )
}

export function min_role(contractor: Contractor, user: { username: string }) {
  const member = contractor.members.find((u) => u.username === user.username)

  if (!member) {
    return undefined
  }

  const roles = contractor.roles!.filter((r) =>
    member.roles.includes(r.role_id),
  )

  let result = roles[0]

  for (const role of roles) {
    if (role.position < result.position) {
      result = role
    }
  }

  return result
}

function RolePermissionCheck(props: {
  label: string
  permission_name: keyof ContractorRole
  role: ContractorRole
  setRole: (a: ContractorRole) => void
}) {
  const { permission_name, setRole, label, role } = props
  const { t } = useTranslation()
  return (
    <Grid item xs={6}>
      <FormControlLabel
        control={
          <Checkbox
            checked={role[permission_name] as boolean}
            onChange={(event: React.ChangeEvent<{ checked: boolean }>) => {
              setRole({ ...role, [permission_name]: event.target.checked })
            }}
            color={"secondary"}
            name={label}
          />
        }
        label={t(`manageRoles.permissions.${permission_name}`)}
      />
    </Grid>
  )
}

function RoleDetailsRow(props: { role: ContractorRole; open: boolean }) {
  const { role, open } = props
  const [newRole, setNewRole] = useState(role)
  const { t } = useTranslation()

  useEffect(() => {
    setNewRole(role)
  }, [role])

  const issueAlert = useAlertHook()
  const [currentOrg] = useCurrentOrg()

  const [updateRole] = useUpdateContractorRoleMutation()
  const [deleteRole] = useDeleteContractorRoleMutation()

  const theme = useTheme<ExtendedTheme>()

  const submitUpdate = useCallback(async () => {
    const { contractor_id, role_id, ...body } = newRole

    updateRole({
      contractor: currentOrg!.spectrum_id,
      role_id: role.role_id,
      body,
    })
      .unwrap()
      .then(() => {
        issueAlert({
          message: t("manageRoles.updated"),
          severity: "success",
        })
      })
      .catch((err) => issueAlert(err))
  }, [currentOrg, role, issueAlert, newRole, t])

  const deleteRoleCallback = useCallback(async () => {
    deleteRole({
      contractor: currentOrg!.spectrum_id,
      role_id: role.role_id,
    })
      .unwrap()
      .then(() => {
        issueAlert({
          message: t("manageRoles.deleted"),
          severity: "success",
        })
      })
      .catch((err) => issueAlert(err))
  }, [currentOrg, role, issueAlert, role, t])

  return (
    <>
      <TableCell colSpan={7} sx={{ padding: 0 }}>
        <Collapse in={open}>
          <Box
            sx={{
              width: "100%",
              padding: 2,
              paddingTop: 0,
            }}
          >
            <Card
              variant={"outlined"}
              sx={{
                width: "100%",
                borderColor: theme.palette.outline.main,
                borderRadius: 4,
              }}
            >
              <CardContent sx={{ padding: 2 }}>
                <Grid container spacing={1} direction={"column"}>
                  <Grid item>
                    <TextField
                      fullWidth
                      label={t("manageRoles.role_name")}
                      value={newRole.name}
                      onChange={(event) =>
                        setNewRole({ ...newRole, name: event.target.value })
                      }
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      label={t("manageRoles.role_position")}
                      type="number"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      helperText={t("manageRoles.position_helper")}
                      value={newRole.position}
                      onChange={(event) =>
                        setNewRole({
                          ...newRole,
                          position: Math.max(1, +event.target.value),
                        })
                      }
                    />
                  </Grid>

                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Org Details"}
                    permission_name={"manage_org_details"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Roles"}
                    permission_name={"manage_roles"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Orders"}
                    permission_name={"manage_orders"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Invites"}
                    permission_name={"manage_invites"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Stock"}
                    permission_name={"manage_stock"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Market"}
                    permission_name={"manage_market"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Recruiting"}
                    permission_name={"manage_recruiting"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Manage Webhooks"}
                    permission_name={"manage_webhooks"}
                  />
                  <RolePermissionCheck
                    role={newRole}
                    setRole={setNewRole}
                    label={"Kick Members"}
                    permission_name={"kick_members"}
                  />
                  <Box display={"flex"} justifyContent={"center"}>
                    <Button
                      color={"primary"}
                      onClick={submitUpdate}
                      variant={"contained"}
                      sx={{ marginRight: 1 }}
                    >
                      {t("manageRoles.save")}
                    </Button>
                    <Button
                      color={"error"}
                      variant={"contained"}
                      onClick={deleteRoleCallback}
                    >
                      {t("manageRoles.delete")}
                    </Button>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Collapse>
      </TableCell>
    </>
  )
}

function RoleRow(props: {
  row: ContractorRole
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
  manage?: boolean
}): JSX.Element {
  const { row, index, onClick, isItemSelected, labelId } = props
  const [open, setOpen] = useState(false)

  const [currentOrg] = useCurrentOrg()
  const { data: profile } = useGetUserProfileQuery()

  const myPosition = useMemo(
    () => min_position(currentOrg!, profile!),
    [currentOrg, profile],
  )

  useEffect(() => {
    setOpen(false) // row changed, so close
  }, [row])

  return (
    <>
      <TableRow
        hover
        // onClick={onClick}
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={index}
        selected={isItemSelected}
        // component={Link} to={`/contract/${row.order_id}`}
        sx={{
          textDecoration: "none",
          color: "inherit",
          borderBottom: "none",
          border: "none",
        }}
      >
        <BorderlessCell align={"left"}>{row.name}</BorderlessCell>

        <BorderlessCell align={"right"}>
          {row.position.toLocaleString(undefined)}
        </BorderlessCell>

        <BorderlessCell
          padding="checkbox"
          onClick={(event) => {
            event.stopPropagation()
          }}
          align={"right"}
        >
          {(myPosition != undefined ? myPosition : row.position) <
            row.position && (
            <IconButton
              onClick={(event) => {
                setOpen((o) => !o)
                event.stopPropagation()
              }}
            >
              {open ? (
                <KeyboardArrowDownRounded />
              ) : (
                <KeyboardArrowRightRounded />
              )}
            </IconButton>
          )}
        </BorderlessCell>
      </TableRow>
      <RoleDetailsRow open={open} role={row} />
    </>
  )
}

const headCells: readonly HeadCell<ContractorRole>[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "position",
    numeric: true,
    disablePadding: false,
    label: "Position",
  },
  {
    id: "role_id",
    numeric: true,
    disablePadding: false,
    label: "",
  },
]

export function ManageRoles(): JSX.Element {
  const [contractor] = useCurrentOrg()
  const { t } = useTranslation()

  return (
    <Section xs={12} title={t("manageRoles.title")} disablePadding>
      <PaginatedTable<ContractorRole>
        rows={contractor?.roles || []}
        initialSort={"position"}
        generateRow={(props) => <RoleRow {...props} />}
        keyAttr={"role_id"}
        headCells={headCells.map((cell) => ({
          ...cell,
          label: cell.label
            ? t(`manageRoles.headCells.${cell.id}`, cell.label)
            : "",
        }))}
        disableSelect
      />
    </Section>
  )
}

const defaultRole = {
  name: "",
  position: 10,
  manage_roles: false,
  manage_orders: false,
  kick_members: false,
  manage_invites: false,
  manage_org_details: false,
  manage_stock: false,
  manage_market: false,
  manage_recruiting: false,
  manage_webhooks: false,
  role_id: "",
  contractor_id: "",
}

export function AddRole() {
  const [newRole, setNewRole] = useState<ContractorRole>(defaultRole)
  const { t } = useTranslation()

  const [createRole] = useCreateContractorRoleMutation()
  const [currentOrg] = useCurrentOrg()

  const issueAlert = useAlertHook()

  const submitUpdate = useCallback(async () => {
    const { contractor_id, role_id, position, ...body } = newRole

    createRole({
      contractor: currentOrg!.spectrum_id,
      body,
    })
      .unwrap()
      .then(() => {
        issueAlert({
          message: t("manageRoles.updated"),
          severity: "success",
        })
        setNewRole(defaultRole)
      })
      .catch((err) => {
        issueAlert(err)
      })
  }, [currentOrg, issueAlert, newRole, t])

  return (
    <>
      <Section xs={12} title={t("manageRoles.add_role")}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t("manageRoles.role_name")}
            value={newRole.name}
            onChange={(event) =>
              setNewRole({ ...newRole, name: event.target.value })
            }
          />
        </Grid>

        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Org Details"}
          permission_name={"manage_org_details"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Roles"}
          permission_name={"manage_roles"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Orders"}
          permission_name={"manage_orders"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Invites"}
          permission_name={"manage_invites"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Stock"}
          permission_name={"manage_stock"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Market"}
          permission_name={"manage_market"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Recruiting"}
          permission_name={"manage_recruiting"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Manage Webhooks"}
          permission_name={"manage_webhooks"}
        />
        <RolePermissionCheck
          role={newRole}
          setRole={setNewRole}
          label={"Kick Members"}
          permission_name={"kick_members"}
        />

        <Grid item display={"flex"} justifyContent={"center"} xs={12}>
          <Button
            color={"primary"}
            onClick={submitUpdate}
            variant={"contained"}
            sx={{ marginRight: 1 }}
          >
            {t("manageRoles.create")}
          </Button>
        </Grid>
      </Section>
    </>
  )
}
