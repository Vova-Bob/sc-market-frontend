import React, { MouseEventHandler, useCallback, useMemo, useState } from "react"
import { Section } from "../../components/paper/Section"
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import { HeadCell, PaginatedTable } from "../../components/table/PaginatedTable"
import {
  useGetUserByUsernameQuery,
  useGetUserProfileQuery,
} from "../../store/profile"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import {
  useApplyContractorRoleMutation,
  useKickContractorMemberMutation,
  useRemoveContractorRoleMutation,
} from "../../store/contractor"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { has_permission, min_position } from "./OrgRoles"
import { Contractor, ContractorRole } from "../../datatypes/Contractor"
import SearchIcon from "@mui/icons-material/Search"
import { Stack } from "@mui/system"
import { BACKEND_URL } from "../../util/constants"
import { useTranslation } from "react-i18next"

function PeopleRow(props: {
  row: OrgMember
  index: number
  onClick?: MouseEventHandler
  isItemSelected: boolean
  labelId: string
  manage?: boolean
  contractor: Contractor
}) {
  const { row, onClick, isItemSelected, labelId, contractor } = props
  const { t } = useTranslation()
  const user = useGetUserByUsernameQuery(row.username)

  const [roles, setRoles] = useState(row.roles)

  const [applyRole] = useApplyContractorRoleMutation()
  const [removeRole] = useRemoveContractorRoleMutation()
  const [kickMember] = useKickContractorMemberMutation()
  const issueAlert = useAlertHook()

  const { data: profile } = useGetUserProfileQuery()
  const myPosition = useMemo(
    () => min_position(contractor, profile!),
    [contractor, profile],
  )
  const theirPosition = useMemo(
    () => min_position(contractor, row),
    [contractor, row],
  )
  const canKick = useMemo(
    () => has_permission(contractor, profile, "kick_members"),
    [contractor, profile],
  )

  const addRoleCallback = useCallback(
    async (role_id: string) => {
      const res: { data?: any; error?: any } = await applyRole({
        contractor: contractor!.spectrum_id,
        username: row.username,
        role_id,
      })

      if (res?.data && !res?.error) {
        issueAlert({
          message: t("manageMemberList.updated"),
          severity: "success",
        })
      } else {
        issueAlert({
          message: t("manageMemberList.update_failed", {
            reason:
              res.error?.error || res.error?.data?.error || res.error || "",
          }),
          severity: "error",
        })
      }
    },
    [contractor, row.username, issueAlert, applyRole, t],
  )

  const removeRoleCallback = useCallback(
    async (role_id: string) => {
      const res: { data?: any; error?: any } = await removeRole({
        contractor: contractor.spectrum_id,
        username: row.username,
        role_id,
      })

      if (res?.data && !res?.error) {
        issueAlert({
          message: t("manageMemberList.updated"),
          severity: "success",
        })
      } else {
        issueAlert({
          message: t("manageMemberList.update_failed", {
            reason:
              res.error?.error || res.error?.data?.error || res.error || "",
          }),
          severity: "error",
        })
      }
    },
    [contractor, row.username, issueAlert, removeRole, t],
  )

  const kickMemberCallback = useCallback(async () => {
    const res: { data?: any; error?: any } = await kickMember({
      contractor: contractor.spectrum_id,
      username: row.username,
    })

    if (res?.data && !res?.error) {
      issueAlert({
        message: t("manageMemberList.member_kicked"),
        severity: "success",
      })
    } else {
      issueAlert({
        message: t("manageMemberList.kick_failed", {
          reason: res.error?.error || res.error?.data?.error || res.error || "",
        }),
        severity: "error",
      })
    }
  }, [contractor, row.username, issueAlert, kickMember, t])

  return (
    <TableRow
      hover
      onClick={onClick}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={row.username}
      selected={isItemSelected}
    >
      {/*<TableCell padding="checkbox">*/}
      {/*    <Checkbox*/}
      {/*        color="primary"*/}
      {/*        checked={isItemSelected}*/}
      {/*        inputProps={{*/}
      {/*            'aria-labelledby': labelId,*/}
      {/*        }}*/}
      {/*    />*/}
      {/*</TableCell>*/}
      <TableCell
        component="th"
        id={labelId}
        scope="row"
        // padding="none"
      >
        <Grid container spacing={2}>
          <Grid item>
            <Avatar src={user.data?.avatar} />
          </Grid>
          <Grid item>
            <Link to={`/user/${row.username}`}>
              <UnderlineLink
                color={"text.secondary"}
                variant={"subtitle1"}
                fontWeight={"bold"}
              >
                {row.username}
              </UnderlineLink>
            </Link>
            <Typography variant={"subtitle2"}>
              {user.data?.display_name}
            </Typography>
          </Grid>
        </Grid>
      </TableCell>
      {props.manage &&
      myPosition !== undefined &&
      myPosition < theirPosition! ? (
        <>
          <TableCell align="right">
            {canKick && (
              <Button
                color={"error"}
                sx={{ marginRight: 2 }}
                onClick={kickMemberCallback}
              >
                {t("manageMemberList.kick")}
              </Button>
            )}
          </TableCell>
          <TableCell align="right">
            <Autocomplete
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  label={t("manageMemberList.roles")}
                />
              )}
              options={(contractor?.roles || []).filter(
                (r) => myPosition < r.position,
              )}
              getOptionLabel={(role) => role.name}
              onChange={async (event: any, newValue) => {
                const oldSet = new Set(row.roles)
                const newSet = new Set(newValue.map((r) => r.role_id))

                for (const role_id of oldSet) {
                  if (!newSet.has(role_id)) {
                    await removeRoleCallback(role_id)
                  }
                }
                for (const role_id of newSet) {
                  if (!oldSet.has(role_id)) {
                    await addRoleCallback(role_id)
                  }
                }
              }}
              value={row.roles.map(
                (rowRole) =>
                  contractor?.roles!.find((r) => rowRole === r.role_id)!,
              )}
              renderTags={(value: readonly ContractorRole[], getTagProps) =>
                value.map((option: ContractorRole, index: number) => (
                  <Chip
                    variant="filled"
                    label={option.name}
                    {...getTagProps({ index })}
                    color={"secondary"}
                  />
                ))
              }
              multiple
            />
          </TableCell>
        </>
      ) : (
        <>
          <TableCell align={"right"}></TableCell>
          <TableCell align="right">
            <Typography
              variant={"subtitle1"}
              sx={{ textTransform: "capitalize" }}
            >
              {props.manage && (
                <>
                  {row.roles
                    .map(
                      (rowRole) =>
                        contractor!.roles!.find((r) => r.role_id == rowRole)
                          ?.name,
                    )
                    .join(", ")}
                </>
              )}
            </Typography>
          </TableCell>
        </>
      )}
    </TableRow>
  )
}

interface OrgMember {
  username: string
  roles: string[]
}

const headCells: readonly HeadCell<OrgMember>[] = [
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "manageMemberList.username",
  },
  {
    id: "username",
    numeric: true,
    disablePadding: false,
    label: "",
  },
  {
    id: "roles",
    numeric: true,
    disablePadding: false,
    label: "manageMemberList.role",
  },
]

export function MemberList(props: { contractor: Contractor }) {
  const { t } = useTranslation()
  return (
    <Section xs={12} title={t("manageMemberList.members")} disablePadding>
      <PaginatedTable<OrgMember>
        rows={props.contractor?.members || []}
        initialSort={"username"}
        generateRow={(iprops) => (
          <PeopleRow {...iprops} manage contractor={props.contractor} />
        )}
        keyAttr={"username"}
        headCells={headCells.map((cell) => ({
          ...cell,
          label: t(cell.label, cell.label),
        }))}
        disableSelect
      />
    </Section>
  )
}

export function ManageMemberList() {
  const [contractor] = useCurrentOrg()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("any")

  const filteredMembers = useMemo(
    () =>
      (contractor?.members || []).filter(
        (m) =>
          (roleFilter === "any" || m.roles.find((r) => r === roleFilter)) &&
          m.username.includes(searchQuery),
      ),
    [contractor, searchQuery, roleFilter],
  )

  return (
    <Section
      xs={12}
      title={t("manageMemberList.members")}
      disablePadding
      subtitle={
        <Stack spacing={1} direction="row" sx={{ minWidth: 100 }}>
          <Button
            href={`${BACKEND_URL}/api/contractor/${contractor?.spectrum_id}/members/csv`}
          >
            {t("manageMemberList.export")}
          </Button>
          <TextField
            label={t("manageMemberList.search")}
            size={"small"}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{ marginRight: 1 }}
            value={searchQuery}
            onChange={(event: any) => {
              setSearchQuery(event.target.value)
            }}
          />
          <TextField
            select
            label={t("manageMemberList.role")}
            value={roleFilter}
            onChange={(event: any) => {
              setRoleFilter(event.target.value)
            }}
            // fullWidth
            size={"small"}
            defaultValue={"any"}
          >
            <MenuItem value={"any"}>{t("manageMemberList.any")}</MenuItem>
            {(contractor?.roles || []).map((r) => (
              <MenuItem value={r.role_id}>{r.name}</MenuItem>
            ))}
          </TextField>
        </Stack>
      }
    >
      <PaginatedTable<OrgMember>
        rows={filteredMembers}
        initialSort={"username"}
        generateRow={(props) => (
          <PeopleRow {...props} manage contractor={contractor!} />
        )}
        keyAttr={"username"}
        headCells={headCells.map((cell) => ({
          ...cell,
          label: t(cell.label, cell.label),
        }))}
        disableSelect
      />
    </Section>
  )
}
