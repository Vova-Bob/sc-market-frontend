import React, { useMemo } from "react"
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Fade,
  Grid,
  IconButton,
  Link as MaterialLink,
  Typography,
} from "@mui/material"
import { Link } from "react-router-dom"
import { UnderlineLink } from "../../components/typography/UnderlineLink"
import { getRelativeTime } from "../../util/time"
import { useCurrentOrg } from "../../hooks/login/CurrentOrg"
import { useGetUserProfileQuery } from "../../store/profile"
import { CreateRounded } from "@mui/icons-material"
import { orderIcons, Service } from "../../datatypes/Order"
import { MarkdownRender } from "../../components/markdown/Markdown"
import { dateDiffInDays } from "../market/MarketListingView"
import { statusColors } from "../orders/OrderList"
import { ImagePreviewPaper } from "../../components/paper/ImagePreviewPaper"
import { paymentTypeMessages } from "../orders/Services"
import { useTranslation } from "react-i18next"

export function ServiceView(props: { service: Service }) {
  const { service } = props
  const { data: profile } = useGetUserProfileQuery()
  const [currentOrg] = useCurrentOrg()
  const { t } = useTranslation()
  const paymentType = paymentTypeMessages.get(service.payment_type)

  const amAssigned = useMemo(
    () => profile && service.user?.username === profile?.username,
    [service, profile],
  )
  const amContractor = useMemo(
    () =>
      profile && currentOrg?.spectrum_id === service?.contractor?.spectrum_id,
    [currentOrg?.spectrum_id, profile, service?.contractor?.spectrum_id],
  )
  const amRelated = useMemo(
    () => amAssigned || amContractor,
    [amAssigned, amContractor],
  )
  // const amContractorManager = useMemo(() =>
  //         amContractor && has_permission(service.contractor, profile, 'manage_orders'),
  //     [currentOrg, profile, amContractor]
  // )

  // TODO: Display all fields, like collateral

  return (
    <>
      <Grid item xs={12} lg={4}>
        <ImagePreviewPaper photos={service.photos} />
      </Grid>

      <Grid item xs={12} lg={8}>
        <Fade in={true}>
          <Card
            sx={{
              borderRadius: 3,
              padding: 0,
            }}
          >
            <CardHeader
              disableTypography
              title={
                <Typography
                  sx={{ marginRight: 1 }}
                  variant={"h6"}
                  color={"text.secondary"}
                >
                  {service.service_name}
                </Typography>
              }
              subheader={
                <Box
                  sx={{ padding: 1.5, paddingLeft: 0 }}
                  display={"flex"}
                  alignItems={"center"}
                >
                  {dateDiffInDays(new Date(), new Date(service.timestamp)) <
                    1 && (
                    <Chip
                      color={"secondary"}
                      label={t("serviceListings.new")}
                      sx={{
                        marginRight: 1,
                        textTransform: "uppercase",
                        fontSize: "0.85em",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  {amRelated && (
                    <Chip
                      label={t(
                        `orders.status.${service.status.replace(
                          /-([a-z])/g,
                          (g) => g[1].toUpperCase(),
                        )}`,
                        { defaultValue: service.status.replace("-", " ") },
                      )}
                      color={statusColors.get(service.status)}
                      sx={{
                        marginRight: 1,
                        textTransform: "capitalize",
                        fontSize: "0.85em",
                        fontWeight: "bold",
                      }}
                    />
                  )}
                  <MaterialLink
                    component={Link}
                    to={
                      service.user?.username
                        ? `/user/${service.user.username}`
                        : `/contractor/${service.contractor?.spectrum_id}`
                    }
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <UnderlineLink
                      color={"text.primary"}
                      variant={"subtitle2"}
                      sx={{
                        fontWeight: "400",
                      }}
                    >
                      {service.user?.display_name || service.contractor?.name}
                    </UnderlineLink>
                  </MaterialLink>
                  <Typography
                    display={"inline"}
                    color={"text.primary"}
                    variant={"subtitle2"}
                  >
                    &nbsp;- {getRelativeTime(new Date(service.timestamp))}{" "}
                    -&nbsp;
                  </Typography>
                  <Typography
                    display={"inline"}
                    color={"primary"}
                    variant={"subtitle2"}
                  >
                    {service.cost.toLocaleString(undefined)} aUEC{" "}
                    {paymentType ? t(`paymentTypes.${paymentType}`) : ""}
                  </Typography>
                </Box>
              }
              action={
                <>
                  {amRelated ? (
                    <Link to={`/order/service/${service.service_id}/edit`}>
                      <IconButton>
                        <CreateRounded style={{ color: "white" }} />
                      </IconButton>
                    </Link>
                  ) : undefined}
                </>
              }
            />
            <CardContent sx={{ width: "auto", minHeight: 120, paddingTop: 0 }}>
              {
                <Typography>
                  <MarkdownRender text={service.service_description} />
                </Typography>
              }
            </CardContent>
            <CardActions>
              <Grid
                container
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Chip
                  color={"primary"}
                  label={t(`myServices.${service.kind}`, {
                    defaultValue: service.kind,
                  })}
                  sx={{ marginRight: 1, marginBottom: 1, padding: 1 }}
                  variant={"outlined"}
                  icon={orderIcons[service.kind]}
                  onClick={
                    (event) => event.stopPropagation() // Don't highlight cell if button clicked
                  }
                />
              </Grid>
            </CardActions>
          </Card>
        </Fade>
      </Grid>
    </>
  )
}
