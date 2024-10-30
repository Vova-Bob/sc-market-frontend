import React, { useCallback, useEffect, useState } from "react"
import { FlatSection } from "../../components/paper/Section"
import { Divider, Grid, InputAdornment, Paper, TextField } from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import { MarketAggregate } from "../../datatypes/MarketListing"
import { HeaderTitle } from "../../components/typography/HeaderTitle"
import { DateTimePicker } from "@mui/x-date-pickers"
import moment from "moment/moment"
import { useMarketCreateBuyOrderMutation } from "../../store/market"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useNavigate } from "react-router-dom"
import { NumericFormat } from "react-number-format"

export function BuyOrderForm(props: { aggregate: MarketAggregate }) {
  const { aggregate } = props
  const [state, setState] = useState({
    game_item_id: aggregate.details.game_item_id,
    price: 0,
    quantity: 1,
    expiry: moment().add(3, "days").endOf("day"),
  })

  useEffect(() => {
    setState((s) => ({ ...s, game_item_id: aggregate.details.game_item_id }))
  }, [aggregate])

  const [createBuyOrder, { isLoading }] = useMarketCreateBuyOrderMutation()
  const issueAlert = useAlertHook()
  const navigate = useNavigate()

  const callback = useCallback(async () => {
    const res: { data?: any; error?: any } = await createBuyOrder(state)

    if (res?.data && !res?.error) {
      issueAlert({
        message: "Submitted!",
        severity: "success",
      })

      navigate(`/market/aggregate/${aggregate.details.game_item_id}`)
    } else {
      issueAlert({
        message: `Failed to submit! ${
          res.error?.error || res.error?.data?.error || res.error
        }`,
        severity: "error",
      })
    }

    return false
  }, [state])

  return (
    <>
      <HeaderTitle>{aggregate.details.title}</HeaderTitle>
      <Grid item xs={12} lg={4}>
        <Paper
          sx={{
            borderRadius: 3,
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
            maxHeight: 600,
            height: 400,
            width: "100%",
            position: "relative",
          }}
        >
          <img
            // component="img"
            style={{
              display: "block",
              maxHeight: "100%",
              maxWidth: "100%",
              margin: "auto",
            }}
            loading="lazy"
            src={
              aggregate.photos[0] ||
              "https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png"
            }
            alt={aggregate.details.title}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null
              currentTarget.src =
                "https://cdn.robertsspaceindustries.com/static/images/Temp/default-image.png"
            }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} lg={8}>
        <Grid container spacing={2}>
          <FlatSection title={"Create Buy Order"}>
            <Grid item xs={12} display={"flex"} justifyContent={"right"}>
              <NumericFormat
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                thousandSeparator
                onValueChange={async (values, sourceInfo) => {
                  setState({
                    ...state,
                    price: values.floatValue || 0,
                  })
                }}
                fullWidth
                label={"Price per Unit"}
                id="price"
                color={"secondary"}
                value={state.price}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">{`aUEC`}</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                type={"tel"}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"right"}>
              <NumericFormat
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                thousandSeparator
                onValueChange={async (values, sourceInfo) => {
                  setState({
                    ...state,
                    quantity: values.floatValue || 1,
                  })
                }}
                fullWidth
                label={"Quantity"}
                id="quantity"
                color={"secondary"}
                value={state.quantity}
                type={"tel"}
              />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"right"}>
              <NumericFormat
                decimalScale={0}
                allowNegative={false}
                customInput={TextField}
                thousandSeparator
                fullWidth
                label={"Total Price"}
                id="price-per-unit"
                color={"secondary"}
                variant={"standard"}
                value={Math.ceil(state.price * state.quantity)}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="start">{`aUEC`}</InputAdornment>
                  ),
                  inputMode: "numeric",
                }}
                type={"tel"}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"right"}>
              <DateTimePicker
                label={`Order Expiration (${
                  Intl.DateTimeFormat().resolvedOptions().timeZone
                })`}
                value={state.expiry}
                onChange={(newValue) =>
                  setState({
                    ...state,
                    expiry: newValue || moment().add(3, "days").endOf("day"),
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} display={"flex"} justifyContent={"right"}>
              <LoadingButton
                variant={"contained"}
                loading={isLoading}
                onClick={callback}
              >
                Submit
              </LoadingButton>
            </Grid>
          </FlatSection>
        </Grid>
      </Grid>
    </>
  )
}
