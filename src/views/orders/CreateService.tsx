import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  GridProps,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material"
import React, { useCallback, useEffect, useState } from "react"
import { Section } from "../../components/paper/Section"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { BACKEND_URL, PAYMENT_TYPES } from "../../util/constants"
import throttle from "lodash/throttle"
import { useAlertHook } from "../../hooks/alert/AlertHook"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { orderIcons, Service, PaymentType } from "../../datatypes/Order"
import { MarkdownEditor } from "../../components/markdown/Markdown"
import { NumericFormat } from "react-number-format"
import { SelectPhotosArea } from "../../components/modal/SelectPhotosArea"
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from "../../store/services"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import i18n from "../../util/i18n"

function romanize(num: number) {
  if (isNaN(num)) return NaN
  let digits = String(+num).split(""),
    key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ],
    roman = "",
    i = 3
  while (i--) {
    const digit = digits.pop()
    if (digit == null) break
    roman = (key[+digit + i * 10] || "") + roman
  }
  return Array(+digits.join("") + 1).join("M") + roman
}

interface StarmapObject {
  id: string
  code: string
  designation: string
  name: null | string
  star_system_id: string
  status: string
  type: string
  star_system: {
    id: string
    code: string
    name: null | string
    type: string
  }
}

export interface ServiceState {
  service_name: string
  service_description: string
  title: string
  rush: boolean
  description: string
  type: string
  collateral: number
  estimate: number
  offer: number
  payment_type: PaymentType
  departure: StarmapObject | null
  departureInput: string
  departChangeTimer: number
  destination: StarmapObject | null
  destinationInput: string
  destChangeTimer: number
  status: string
  photos: string[]
}

export function CreateServiceForm(props: GridProps & { service?: Service }) {
  const { t } = useTranslation()
  const [currentOrg] = useCurrentOrg()
  const [state, setState] = React.useState<ServiceState>({
    service_name: "",
    service_description: "",
    title: "",
    rush: false,
    description: "",
    type: "",
    collateral: 0,
    estimate: 0,
    offer: 0,
    payment_type: "one-time",
    departure: null,
    departureInput: "",
    departChangeTimer: Date.now(),
    destination: null,
    destinationInput: "",
    destChangeTimer: Date.now(),
    status: "active",
    photos: [],
  })

  useEffect(() => {
    if (props.service) {
      setState({
        ...props.service,
        estimate: 0,
        departure: null,
        departureInput: "",
        departChangeTimer: Date.now(),
        destination: null,
        destinationInput: "",
        destChangeTimer: Date.now(),
        type: props.service.kind,
        offer: props.service.cost || 0,
        payment_type: props.service.payment_type || "one-time",
      })
    }
  }, [props.service])

  const issueAlert = useAlertHook()

  const [departSuggest, setDepartSuggest] = useState<StarmapObject[]>([])
  const [destSuggest, setDestSuggest] = useState<StarmapObject[]>([])
  const [departTarget, setDepartTarget] = useState("")
  const [destTarget, setDestTarget] = useState("")
  const [departTargetObject, setDepartTargetObject] =
    useState<StarmapObject | null>(null)
  const [destTargetObject, setDestTargetObject] =
    useState<StarmapObject | null>(null)
  const navigate = useNavigate()

  const getSuggestions = React.useCallback(async (query: string) => {
    if (query.length < 3) {
      return []
    }

    const resp = await fetch(
      `${BACKEND_URL}/api/starmap/search/${encodeURIComponent(query)}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept-Language": i18n.language,
        },
      },
    )
    const data = await resp.json()

    const extended: StarmapObject[] = []

    await Promise.all(
      data.objects.resultset.map(async (obj: StarmapObject) => {
        if (obj.type === "SATELLITE") {
          const planetNum = obj.designation.replace(/\D/g, "")
          const planetDes = `${obj.star_system.name} ${romanize(
            parseInt(planetNum),
          )}`

          extended.push(...(await getSuggestions(planetDes)))
        }
      }),
    )
    extended.push(...data.objects.resultset)

    return extended
  }, [])

  const retrieveDepart = React.useMemo(
    () =>
      throttle(async (query: string) => {
        const suggestions = await getSuggestions(query)
        setDepartSuggest(suggestions)
      }, 400),
    [getSuggestions],
  )
  const retrieveDest = React.useMemo(
    () =>
      throttle(async (query: string) => {
        const suggestions = await getSuggestions(query)
        setDestSuggest(suggestions)
      }, 400),
    [getSuggestions],
  )

  useEffect(() => {
    retrieveDepart(departTarget)
  }, [departTarget, retrieveDepart])
  useEffect(() => {
    retrieveDest(destTarget)
  }, [destTarget, retrieveDest])

  const [
    createService, // This is the mutation trigger
  ] = useCreateServiceMutation()

  const [
    updateService, // This is the mutation trigger
  ] = useUpdateServiceMutation()

  const submitService = useCallback(
    async (event: any) => {
      // event.preventDefault();
      let res: { data?: any; error?: any }

      if (props.service) {
        res = await updateService({
          service_id: props.service.service_id,
          body: {
            service_name: state.service_name,
            service_description: state.service_description,
            title: state.title,
            rush: state.rush,
            description: state.description,
            kind: state.type, // ? state.type : null,
            collateral: state.collateral,
            departure: departTargetObject ? departTargetObject.code : null,
            destination: destTargetObject ? destTargetObject.code : null,
            cost: state.offer,
            payment_type: state.payment_type,
            contractor: currentOrg?.spectrum_id,
            status: state.status,
            photos: state.photos,
          },
        })
      } else {
        res = await createService({
          service_name: state.service_name,
          service_description: state.service_description,
          title: state.title,
          rush: state.rush,
          description: state.description,
          kind: state.type, // ? state.type : null,
          collateral: state.collateral,
          departure: departTargetObject ? departTargetObject.code : null,
          destination: destTargetObject ? destTargetObject.code : null,
          cost: state.offer,
          payment_type: state.payment_type,
          contractor: currentOrg?.spectrum_id,
          status: state.status,
          photos: state.photos,
        })
      }

      if (res?.data && !res?.error) {
        setState({
          service_name: "",
          service_description: "",
          title: "",
          rush: false,
          description: "",
          type: "",
          collateral: 0,
          estimate: 0,
          offer: 0,
          payment_type: "one-time",
          departure: null,
          departureInput: "",
          departChangeTimer: Date.now(),
          destination: null,
          destinationInput: "",
          destChangeTimer: Date.now(),
          status: "active",
          photos: [],
        })

        issueAlert({
          message: t("CreateServiceForm.alert.submitted"),
          severity: "success",
        })

        if (props.service) {
          navigate("/order/services")
        }
      } else {
        issueAlert({
          message: `${t("CreateServiceForm.alert.failed")} ${
            res.error?.error || res.error?.data?.error || res.error
          }`,
          severity: "error",
        })
      }
      return false
    },
    [
      createService,
      currentOrg?.spectrum_id,
      departTargetObject,
      destTargetObject,
      props.service,
      issueAlert,
      state.collateral,
      state.description,
      state.offer,
      state.payment_type,
      state.rush,
      state.status,
      state.service_description,
      state.service_name,
      state.title,
      state.type,
      updateService,
      t, // add t to dependencies
    ],
  )

  return (
    // <FormControl component={Grid} item xs={12} container spacing={2}>
    <>
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            {t("CreateServiceForm.serviceDetails")}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              fullWidth
              label={t("CreateServiceForm.serviceName") + "*"}
              id="order-title"
              value={state.service_name}
              onChange={(event: React.ChangeEvent<{ value: string }>) => {
                setState({ ...state, service_name: event.target.value })
              }}
              color={"secondary"}
            />
          </Grid>

          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setState({
                        ...state,
                        status: event.target.checked ? "active" : "inactive",
                      })
                    }}
                    checked={state.status === "active"}
                  />
                }
                label={
                  state.status === "active"
                    ? t("CreateServiceForm.serviceActive")
                    : t("CreateServiceForm.serviceInactive")
                }
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <MarkdownEditor
              value={state.service_description}
              variant={"vertical"}
              TextFieldProps={{
                label: t("CreateServiceForm.serviceDescription"),
                helperText: t("CreateServiceForm.serviceDescriptionHelper"),
              }}
              onChange={(value) =>
                setState({ ...state, service_description: value })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <SelectPhotosArea
              photos={state.photos}
              setPhotos={(photos) =>
                setState((state) => ({ ...state, photos }))
              }
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
            {t("CreateServiceForm.orderServiceDetails")}
          </Typography>
        </Grid>
        <Grid item xs={12} lg={8} container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              fullWidth
              label={t("CreateServiceForm.title") + "*"}
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
              label={t("CreateServiceForm.typeOptional")}
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
              label={t("CreateServiceForm.rush")}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              multiline
              fullWidth={true}
              label={t("CreateServiceForm.description")}
              id="description"
              helperText={t("CreateServiceForm.descriptionHelper")}
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
      {/*<Section xs={12}>*/}
      {/*    <Grid item xs={12} lg={4}>*/}
      {/*        <Typography variant={'h6'} align={'left'} color={'text.secondary'}*/}
      {/*                    sx={{fontWeight: 'bold'}}>*/}
      {/*            Location*/}
      {/*        </Typography>*/}
      {/*    </Grid>*/}
      {/*    <Grid item xs={12} lg={8} container spacing={2}>*/}
      {/*        <Grid item xs={12} lg={12}>*/}
      {/*            <Autocomplete*/}
      {/*                id="departure-select"*/}
      {/*                options={departSuggest}*/}
      {/*                getOptionLabel={(option: StarmapObject) => {*/}
      {/*                    console.log(option)*/}
      {/*                    if (option.type === "SATELLITE") {*/}
      {/*                        const planetNum = option.designation.replace(/\D/g, '');*/}
      {/*                        const planetDes = `${option.star_system.name} ${romanize(parseInt(planetNum))}`*/}
      {/*                        const planet = departSuggest.find((obj) => obj.designation === planetDes)*/}

      {/*                        return `${option.name || option.designation} - ${planet ? planet.name : ''} - ${option.star_system.name} (${option.designation})`*/}
      {/*                    } else if (option.type === "STAR") {*/}
      {/*                        return `${option.name || option.designation} (${option.designation})`*/}
      {/*                    }*/}

      {/*                    return `${option.name || option.designation} - ${option.star_system.name} (${option.designation})`*/}
      {/*                }}*/}

      {/*                value={departTargetObject}*/}
      {/*                onChange={(event: any, newValue: StarmapObject | null) => {*/}
      {/*                    setDepartTargetObject(newValue);*/}
      {/*                }}*/}
      {/*                inputValue={departTarget}*/}
      {/*                onInputChange={(event, newInputValue) => {*/}
      {/*                    setDepartTarget(newInputValue);*/}
      {/*                }}*/}

      {/*                renderInput={(params) => {*/}
      {/*                    return <TextField*/}
      {/*                        {...params}*/}
      {/*                        label="Source (Optional)"*/}
      {/*                        color={'secondary'}*/}
      {/*                        SelectProps={{*/}
      {/*                            IconComponent: KeyboardArrowDownRoundedIcon*/}
      {/*                        }}*/}
      {/*                        sx={{*/}
      {/*                            '& .MuiSelect-icon': {*/}
      {/*                                fill: 'white',*/}
      {/*                            },*/}
      {/*                        }}*/}

      {/*                        helperText={"For Escort and Transport, for example, " +*/}
      {/*                            "from where to where will the order occur? " +*/}
      {/*                            "For Support, where should the contractor find you?"}*/}
      {/*                    />*/}
      {/*                }}*/}
      {/*            />*/}
      {/*        </Grid>*/}

      {/*        <Grid item xs={12} lg={12}>*/}
      {/*            <Autocomplete*/}
      {/*                id="destination-select"*/}
      {/*                options={destSuggest}*/}
      {/*                getOptionLabel={(option: StarmapObject) => {*/}
      {/*                    if (option.type === "SATELLITE") {*/}
      {/*                        const planetNum = option.designation.replace(/\D/g, '');*/}
      {/*                        const planetDes = `${option.star_system.name} ${romanize(parseInt(planetNum))}`*/}
      {/*                        const planet = destSuggest.find((obj) => obj.designation === planetDes)*/}

      {/*                        return `${option.name || option.designation} - ${planet ? planet.name : ''} - ${option.star_system.name} (${option.designation})`*/}
      {/*                    } else if (option.type === "STAR") {*/}
      {/*                        return `${option.name || option.designation} (${option.designation})`*/}
      {/*                    }*/}

      {/*                    return `${option.name || option.designation} - ${option.star_system.name} (${option.designation})`*/}
      {/*                }}*/}

      {/*                value={destTargetObject}*/}
      {/*                onChange={(event: any, newValue: StarmapObject | null) => {*/}
      {/*                    setDestTargetObject(newValue);*/}
      {/*                }}*/}
      {/*                inputValue={destTarget}*/}
      {/*                onInputChange={(event, newInputValue) => {*/}
      {/*                    setDestTarget(newInputValue);*/}
      {/*                }}*/}

      {/*                renderInput={(params) => {*/}
      {/*                    return <TextField*/}
      {/*                        {...params}*/}
      {/*                        label="Destination (Optional)"*/}
      {/*                        color={'secondary'}*/}
      {/*                        SelectProps={{*/}
      {/*                            IconComponent: KeyboardArrowDownRoundedIcon*/}
      {/*                        }}*/}
      {/*                        sx={{*/}
      {/*                            '& .MuiSelect-icon': {*/}
      {/*                                fill: 'white',*/}
      {/*                            },*/}
      {/*                        }}*/}
      {/*                    />*/}
      {/*                }}*/}
      {/*            />*/}
      {/*        </Grid>*/}

      {/*    </Grid>*/}
      {/*</Section>*/}
      <Section xs={12}>
        <Grid item xs={12} lg={4}>
          <Typography
            variant={"h6"}
            align={"left"}
            color={"text.secondary"}
            sx={{ fontWeight: "bold" }}
          >
            {t("CreateServiceForm.costs")}
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
                  collateral: values.floatValue || 0,
                })
              }}
              fullWidth={true}
              label={t("CreateServiceForm.collateralOptional")}
              id="collateral"
              color={"secondary"}
              value={state.collateral}
              type={"tel"}
              helperText={t("CreateServiceForm.collateralHelper")}
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
                setState({
                  ...state,
                  offer: values.floatValue || 0,
                })
              }}
              fullWidth={true}
              label={t("CreateServiceForm.cost")}
              id="offer"
              color={"secondary"}
              value={state.offer}
              type={"tel"}
              helperText={t("CreateServiceForm.costHelper")}
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
              label={t("CreateServiceForm.paymentType")}
              value={state.payment_type}
              onChange={(event: any) => {
                setState({ ...state, payment_type: event.target.value })
              }}
              fullWidth
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            >
              {PAYMENT_TYPES.map((paymentType) => (
                <MenuItem key={paymentType.value} value={paymentType.value}>
                  {t(paymentType.translationKey)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Section>
      <Grid item xs={12} container justifyContent={"right"}>
        <Button
          size={"large"}
          variant="contained"
          color={"secondary"}
          type="submit"
          // component={Link}
          // to={'/p/myoffers'}
          onClick={submitService}
        >
          {props.service
            ? t("CreateServiceForm.update")
            : t("CreateServiceForm.submit")}
        </Button>
      </Grid>
    </>
    // </FormControl>
  )
}
