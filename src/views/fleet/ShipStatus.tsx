import { Ship } from "../../datatypes/Ship"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Fade,
  Grid,
  Typography,
} from "@mui/material"
import React from "react"

const statusColors = new Map<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
>()
statusColors.set("flight-ready", "success")
statusColors.set("in-repair", "warning")
statusColors.set("awaiting-repair", "error")
statusColors.set("in-concept", "info")

// Get images https://api.fleetyards.net/v1/models?perPage=240&page=1
export function ShipStatus(props: { ship: Ship; index: number }) {
  const { ship, index } = props

  return (
    <Grid item xs={12} md={6} lg={4} xl={4}>
      <Fade
        in={true}
        style={{
          transitionDelay: `${50 + 50 * index}ms`,
          transitionDuration: "500ms",
        }}
      >
        <Card
          sx={{
            borderRadius: 4,
            height: 400,
          }}
        >
          <CardHeader
            title={
              <Typography variant={"subtitle1"} color={"text.secondary"}>
                {ship.manufacturer} {ship.name}
              </Typography>
            }
            subheader={
              <Typography variant={"subtitle2"} color={"text.primary"}>
                {ship.size} - {ship.kind}
              </Typography>
            }
            sx={{
              padding: 2,
            }}
          />

          <CardMedia
            component="img"
            loading="lazy"
            image={ship.image}
            alt={ship.name}
            sx={{
              height: 200,
              // maxHeight: '100%',
              // maxHeight: 200,
              overflow: "hidden",
            }}
          />

          <CardContent>
            <Typography variant={"body2"} fontWeight={"bold"}>
              Condition:{" "}
              <Typography
                display={"inline"}
                color={statusColors.get(ship.condition) + ".main"}
                variant={"body2"}
                fontWeight={"bold"}
              >
                {ship.condition}
              </Typography>
            </Typography>
          </CardContent>
          <CardActions
            sx={{
              paddingLeft: 2,
              paddingRight: 2,
            }}
          >
            <Grid container justifyContent={"space-between"}>
              <Button color={"primary"}>Report Condition</Button>
            </Grid>
          </CardActions>
        </Card>
      </Fade>
    </Grid>
  )
}
