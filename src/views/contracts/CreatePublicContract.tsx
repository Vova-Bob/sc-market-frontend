import {
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material"
import { orderIcons, OrderKind, PaymentType } from "../../datatypes/Order"
import React, { useCallback, useState } from "react"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useNavigate } from "react-router-dom"
import { Section } from "../../components/paper/Section"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { NumericFormat } from "react-number-format"
import LoadingButton from "@mui/lab/LoadingButton"
import { useCreatePublicContractMutation } from "../../store/public_contracts"

export function CreatePublicContract() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [kind, setKind] = useState<OrderKind>("Escort")
  const [cost, setCost] = useState(0)
  const [collateral, setCollateral] = useState(0)
  const [paymentType, setPaymentType] = useState<PaymentType>("one-time")

  const issueAlert = useAlertHook()

  const [
    createPublicContract, // This is the mutation trigger
    { isLoading },
  ] = useCreatePublicContractMutation()

  const navigate = useNavigate()
  const submitOrder = useCallback(
    async (event: any) => {
      // event.preventDefault();
      createPublicContract({
        title,
        description,
        kind,
        collateral,
        cost,
        payment_type: paymentType,
      })
        .unwrap()
        .then((data) => {
          issueAlert({
            message: "Submitted!",
            severity: "success",
          })

          navigate(`/contracts/public/${data.contract_id}`)
        })
        .catch((error) => {
          issueAlert(error)
        })
      return false
    },
    [
      collateral,
      cost,
      createPublicContract,
      description,
      issueAlert,
      kind,
      navigate,
      paymentType,
      title,
    ],
  )

  return (
    <Grid item xs={12}>
      <FormControl component={Grid} item xs={12} container spacing={2}>
        <Grid container spacing={4}>
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
                  value={title}
                  onChange={(event: React.ChangeEvent<{ value: string }>) => {
                    setTitle(event.target.value)
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
                  value={kind}
                  onChange={(event: React.ChangeEvent<{ value: string }>) => {
                    setKind(event.target.value as OrderKind)
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

              <Grid item xs={12}>
                <TextField
                  multiline
                  fullWidth={true}
                  label={"Description*"}
                  id="description"
                  helperText={
                    "E.g. Transport Lithium from New Babbage to Hurston"
                  }
                  onChange={(event: React.ChangeEvent<{ value: string }>) => {
                    setDescription(event.target.value)
                  }}
                  value={description}
                  minRows={4}
                  maxRows={4}
                  color={"secondary"}
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
                    setCollateral(+(values.floatValue || 0))
                  }}
                  fullWidth={true}
                  label={"Collateral (Optional)"}
                  id="collateral"
                  color={"secondary"}
                  value={collateral}
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

              <Grid item xs={12}>
                <NumericFormat
                  decimalScale={0}
                  allowNegative={false}
                  customInput={TextField}
                  thousandSeparator
                  onValueChange={async (values, sourceInfo) => {
                    console.log(values)
                    setCost(values.floatValue || 0)
                  }}
                  fullWidth={true}
                  label={"aUEC Offer"}
                  id="offer"
                  color={"secondary"}
                  value={cost}
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
                  value={paymentType}
                  onChange={(event: any) => {
                    setPaymentType(event.target.value)
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
        </Grid>
      </FormControl>
    </Grid>
  )
}
