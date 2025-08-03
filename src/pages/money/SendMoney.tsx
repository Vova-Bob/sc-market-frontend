import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { ContainerGrid } from "../../components/layout/ContainerGrid"
import React, { useEffect, useState } from "react"
import { Section } from "../../components/paper/Section"
import {
  Autocomplete,
  Avatar,
  Button,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { BACKEND_URL } from "../../util/constants"
import { MinimalUser, User } from "../../datatypes/User"
import { Contractor, MinimalContractor } from "../../datatypes/Contractor"
import { Navigate } from "react-router-dom"
import throttle from "lodash/throttle"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useCreateTransaction } from "../../store/transactions"
import { useTranslation } from "react-i18next"

export function SendMoney(props: { org?: boolean }) {
  const { t } = useTranslation()
  const containerRef = React.useRef(null)
  const [error, setError] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [next, setNext] = useState(false)

  const [recipientType, setRecipientType] = useState("user")
  const [options, setOptions] = useState<(User | Contractor)[]>([])
  const [target, setTarget] = useState("")
  const [targetObject, setTargetObject] = useState<User | Contractor | null>(
    null,
  )
  // const [success, setSuccess] = useState(false)

  const [currentOrg] = useCurrentOrg()

  const getOptions = React.useCallback(
    (query: string) => {
      if (query.length < 3) {
        return
      }

      fetch(
        `${BACKEND_URL}/api/${
          recipientType === "user" ? "profile" : "contractor"
        }/search/${encodeURIComponent(query)}`,
        {
          method: "GET",
          credentials: "include",
        },
      )
        .then(async (resp) => {
          const data = await resp.json()
          if (data.error) {
            // setError(`Invalid ${recipientType}!`)
            setOptions([])
          } else {
            // setError("")
            // setTargetObject(data)
            setOptions(data as (User | Contractor)[])
          }
        })
        .catch(() => {
          // setError(`Invalid ${recipientType}!`)
          // setTargetObject(null)
          setOptions([])
        })
    },
    [recipientType],
  )

  const retrieve = React.useMemo(
    () =>
      throttle((query: string) => {
        getOptions(query)
      }, 400),
    [getOptions],
  )

  useEffect(() => {
    retrieve(target)
  }, [target, retrieve])

  const [
    createTransaction, // This is the mutation trigger
    { isSuccess }, // This is the destructured mutation result
  ] = useCreateTransaction()

  const initiateSend = async () => {
    if (target === "") {
      setError(t("sendMoney.errors.enterUser"))
      return
    }
    if (targetObject === null) {
      setError(t("sendMoney.errors.invalidUser"))
      return
    }

    if (isNaN(Number.parseInt(amount))) {
      return
    }

    await createTransaction({
      spectrum_id: props.org ? currentOrg?.spectrum_id : null,
      body: {
        amount: Number.parseInt(amount),
        note: note,
        contractor_recipient_id: (targetObject as Contractor).spectrum_id
          ? (targetObject as Contractor).spectrum_id
          : null,
        user_recipient_id: (targetObject as User).username
          ? (targetObject as User).username
          : null,
      },
    })
  }

  return (
    <ContainerGrid maxWidth={"sm"} sidebarOpen={true} ref={containerRef}>
      {isSuccess && <Navigate to={props.org ? "/org/money" : "/dashboard"} />}
      <HeaderTitle>{t("sendMoney.title")}</HeaderTitle>

      {/*TODO: Add slide animation*/}
      {!next ? (
        <Section xs={12} title={t("sendMoney.recipient")}>
          <Grid item lg={9} xs={12}>
            <Autocomplete
              filterOptions={(x) => x}
              fullWidth
              options={options}
              getOptionLabel={(option) =>
                (option as User).display_name
                  ? (option as User).display_name
                  : (option as Contractor).name
              }
              disablePortal
              color={targetObject ? "success" : "primary"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={
                    recipientType === "user"
                      ? t("sendMoney.username")
                      : t("sendMoney.contractor")
                  }
                  SelectProps={{
                    IconComponent: KeyboardArrowDownRoundedIcon,
                  }}
                />
              )}
              value={targetObject}
              onChange={(event: any, newValue: User | Contractor | null) => {
                setTargetObject(newValue)
              }}
              inputValue={target}
              onInputChange={(event, newInputValue) => {
                setTarget(newInputValue)
              }}
            />
          </Grid>
          <Grid item lg={3} xs={12}>
            <Select
              label={t("sendMoney.targetKind")}
              value={recipientType}
              onChange={(event: any) => {
                setRecipientType(event.target.value)
              }}
              fullWidth
            >
              <MenuItem value={"user"}>{t("sendMoney.user")}</MenuItem>
              <MenuItem value={"contractor"}>
                {t("sendMoney.contractor")}
              </MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant={"contained"}
              color={"secondary"}
              disabled={!(target && !error && targetObject)}
              onClick={() => setNext(true)}
            >
              {t("sendMoney.next")}
            </Button>
          </Grid>
        </Section>
      ) : (
        <Section
          xs={12}
          title={t("sendMoney.recipient")}
          justifyContent={"space-between"}
        >
          <Grid item xs={12} container>
            <Grid item>
              <Avatar
                src={targetObject?.avatar}
                sx={{ marginRight: 3, height: 64, width: 64 }}
                alt={`Avatar of ${
                  (targetObject as MinimalUser).username ||
                  (targetObject as MinimalContractor).spectrum_id
                }`}
                variant={"rounded"}
              />
            </Grid>
            <Grid item>
              <Typography variant={"h6"} display={"inline"}>
                {targetObject &&
                  ((targetObject as User)?.display_name ||
                    (targetObject as Contractor)?.spectrum_id)}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <TextField
              type={"number"}
              fullWidth
              label={t("sendMoney.amount")}
              value={amount}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setAmount(event.target.value)
              }}
              error={isNaN(Number.parseInt(amount))}
              helperText={
                amount === "" ? t("sendMoney.errors.enterAmount") : ""
              }
              color={!isNaN(Number.parseInt(amount)) ? "success" : "primary"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("sendMoney.note")}
              value={note}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setNote(event.target.value)
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <Button
              variant={"contained"}
              color={"secondary"}
              onClick={() => setNext(false)}
            >
              {t("sendMoney.back")}
            </Button>
          </Grid>
          <Grid item xs={6} justifyContent={"right"} container>
            <Grid item>
              <Button
                variant={"contained"}
                color={"primary"}
                onClick={initiateSend}
              >
                {t("sendMoney.send")}
              </Button>
            </Grid>
          </Grid>
        </Section>
      )}
    </ContainerGrid>
  )
}
