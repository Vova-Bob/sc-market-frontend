import {
  Checkbox,
  FormControlLabel,
  Grid,
  GridProps,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Section } from "../../components/paper/Section"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { BACKEND_URL } from "../../util/constants"
import throttle from "lodash/throttle"
import { useCreateOrderMutation } from "../../store/orders"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { orderIcons, Service } from "../../datatypes/Order"
import { useNavigate } from "react-router-dom"
import LoadingButton from "@mui/lab/LoadingButton"
import { NumericFormat } from "react-number-format"
import {
  useGetServicesContractorQuery,
  useGetServicesQuery,
} from "../../store/services"
import { PublicContract } from "../../store/public_contracts"

interface WorkRequestState {
  title: string
  rush: boolean
  description: string
  type: string
  collateral: number
  estimate: number
  offer: number
  service_id?: string | null
  payment_type: "one-time" | "hourly" | "daily"
}

export function CreateOrderForm(
  props: GridProps & {
    contractor_id?: string | null
    assigned_to?: string | null
    service?: Service
  },
) {
  const [state, setState] = React.useState<WorkRequestState>({
    title: "",
    rush: false,
    description: "",
    type: "Escort",
    collateral: 0,
    estimate: 0,
    offer: 0,
    service_id: null,
    payment_type: "one-time",
  })

  const issueAlert = useAlertHook()

  const [
    createOrder, // This is the mutation trigger
    { isLoading },
  ] = useCreateOrderMutation()

  const { data: userServices } = useGetServicesQuery(props.assigned_to!, {
    skip: !props.assigned_to,
  })
  const { data: contractorServices } = useGetServicesContractorQuery(
    props.contractor_id!,
    { skip: !props.contractor_id },
  )
  const services = useMemo(
    () => userServices || contractorServices,
    [contractorServices, userServices],
  )

  const [service, setService] = useState<Service | null>(props.service || null)
  useEffect(() => {
    if (service) {
      setState((state) => ({
        ...state,
        title: service.title,
        rush: service.rush,
        description: service.description,
        collateral: service.collateral,
        offer: service.cost,
        type: service.kind,
        service_id: service.service_id,
        // collateral: service.collateral,
        payment_type: service.payment_type,
      }))
    } else {
      setState((state) => ({
        title: "",
        rush: false,
        description: "",
        type: "Escort",
        collateral: 0,
        estimate: 0,
        offer: 0,
        departure: null,
        departureInput: "",
        departChangeTimer: Date.now(),
        destination: null,
        destinationInput: "",
        destChangeTimer: Date.now(),
        service_id: null,
        payment_type: "one-time",
      }))
    }
  }, [service])

  const navigate = useNavigate()
  const submitOrder = useCallback(
    async (event: any) => {
      // event.preventDefault();
      createOrder({
        title: state.title,
        rush: state.rush,
        description: state.description,
        kind: state.type,
        collateral: state.collateral,
        cost: state.offer,
        contractor: props.contractor_id,
        assigned_to: props.assigned_to,
        payment_type: state.payment_type,
        service_id: service?.service_id,
        departure: null,
        destination: null,
      })
        .unwrap()
        .then((data) => {
          setState({
            title: "",
            rush: false,
            description: "",
            type: "Escort",
            collateral: 0,
            estimate: 0,
            offer: 0,
            payment_type: "one-time",
          })

          issueAlert({
            message: "Submitted!",
            severity: "success",
          })

          if (data.discord_invite) {
            const newWindow = window.open(
              `https://discord.gg/${data.discord_invite}`,
              "_blank",
            )
            if (newWindow) {
              newWindow.focus()
            }
          }

          navigate(`/offer/${data.session_id}`)
        })
        .catch((error) => {
          issueAlert(error)
        })
      return false
    },
    [
      service?.service_id,
      createOrder,
      state.title,
      state.rush,
      state.description,
      state.type,
      state.collateral,
      state.offer,
      state.payment_type,
      props.contractor_id,
      props.assigned_to,
      issueAlert,
      navigate,
    ],
  )

  return (
    // <FormControl component={Grid} item xs={12} container spacing={2}>
    <>
      {services && !!services.length && !props.service && (
        <Section xs={12}>
          <Grid item xs={12} lg={4}>
            <Typography
              variant={"h6"}
              align={"left"}
              color={"text.secondary"}
              sx={{ fontWeight: "bold" }}
            >
              Services
            </Typography>
          </Grid>
          <Grid item xs={12} lg={8} container spacing={1}>
            <Grid item xs={12} lg={12}>
              <TextField
                fullWidth
                select
                label="Select Service (Optional)"
                id="order-service"
                value={service?.service_name}
                onChange={(event: React.ChangeEvent<{ value: string }>) => {
                  if (event.target.value === "") {
                    setService(null)
                  } else {
                    setService(
                      (services || []).find(
                        (t) => t.service_name === event.target.value,
                      )!,
                    )
                  }
                }}
                color={"secondary"}
                SelectProps={{
                  IconComponent: KeyboardArrowDownRoundedIcon,
                }}
              >
                <MenuItem value={""}>No Service</MenuItem>
                {(services || []).map((t) => (
                  <MenuItem value={t.service_name} key={t.service_name}>
                    {t.service_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Section>
      )}
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            About
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              fullWidth
              label="Title*"
              id="order-title"
              value={state.title}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setState({ ...state, title: event.target.value })
              }}
              color={"secondary"}
            />
          </Grid>

          <Grid item xs={12} lg={10}>
            <TextField
              fullWidth
              select
              label="Type*"
              id="order-type"
              value={state.type}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setState({ ...state, type: event.target.value })
              }}
              color={"secondary"}
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              {Object.keys(orderIcons).map((k) => (
                <MenuItem value={k} key={k}>
                  {k}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={2} container alignItems={"center"}>
            <FormControlLabel
              control={
                <Checkbox
                  // checked={state.checkedB}
                  onChange={(
                    event: React.ChangeEvent<{ checked: boolean }>,
                  ) => {
                    setState({ ...state, rush: event.target.checked })
                  }}
                  color={"secondary"}
                  name="Rush"
                />
              }
              label="Rush"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth={true}
              label={"Description*"}
              id="description"
              helperText={"E.g. Transport Lithium from New Babbage to Hurston"}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setState({ ...state, description: event.target.value })
              }}
              value={state.description}
              minRows={4}
              maxRows={4}
              color={"secondary"}
              // InputProps={{sx: {color: 'inherit'}}}
            />
          </Grid>
        </Grid>
      </Section>
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            Costs
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12}>
            <NumericFormat
              decimalScale={0}
              allowNegative={false}
              customInput={TextField}
              thousandSeparator
              onValueChange={async (values, sourceInfo) => {
                setState({
                  ...state,
                  collateral: +(values.floatValue || 0),
                })
              }}
              fullWidth={true}
              label={"Collateral (Optional)"}
              id="collateral"
              color={"secondary"}
              value={state.collateral}
              type={"tel"}
              helperText={
                "If the contractor offers insurance, " +
                "what is the lost value in the event the contractor fails to deliver? " +
                "E.g. the value of the cargo being transported"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">{`aUEC`}</InputAdornment>
                ),
                inputMode: "numeric",
              }}
            />
          </Grid>

          {/*<Grid item xs={12}>*/}
          {/*    <TextField multiline disabled fullWidth={true} label={"Estimated Cost"}*/}
          {/*               id="estimated-cost"*/}
          {/*               value={*/}
          {/*                   `${((state.estimate + state.collateral * 0.05) * (state.rush ? 1.3 : 1)).toLocaleString(*/}
          {/*                       undefined*/}
          {/*                   )} aUEC`*/}
          {/*               }*/}
          {/*               variant={'filled'}*/}
          {/*    />*/}
          {/*</Grid>*/}

          <Grid item xs={12}>
            <NumericFormat
              decimalScale={0}
              allowNegative={false}
              customInput={TextField}
              thousandSeparator
              onValueChange={async (values, sourceInfo) => {
                console.log(values)
                setState({
                  ...state,
                  offer: values.floatValue || 0,
                })
              }}
              fullWidth={true}
              label={"aUEC Offer"}
              id="offer"
              color={"secondary"}
              value={state.offer}
              type={"tel"}
              helperText={
                "How much will you offer the contractor to fulfill this order?"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">{`aUEC`}</InputAdornment>
                ),
                inputMode: "numeric",
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label={"Payment Type"}
              value={state.payment_type}
              onChange={(event: any) => {
                setState({ ...state, payment_type: event.target.value })
              }}
              fullWidth
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              <MenuItem value={"one-time"}>One time</MenuItem>
              <MenuItem value={"hourly"}>Hourly</MenuItem>
              <MenuItem value={"daily"}>Daily</MenuItem>
              <MenuItem value={"unit"}>Unit</MenuItem>
              <MenuItem value={"box"}>Box</MenuItem>
              <MenuItem value={"scu"}>SCU</MenuItem>
              <MenuItem value={"cscu"}>cSCU</MenuItem>
              <MenuItem value={"mscu"}>mSCU</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Section>
      <Grid item xs={12} container justifyContent={"right"}>
        <LoadingButton
          loading={isLoading}
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          onClick={submitOrder}
        >
          Submit
        </LoadingButton>
      </Grid>
    </>
    // </FormControl>
  )
}
