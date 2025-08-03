import { Section } from "../../components/paper/Section"
import React, { useState } from "react"
import { Autocomplete, Box, Button, Grid, TextField } from "@mui/material"
import { shipList, ShipName } from "../../datatypes/Ship"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"
import { useTranslation } from "react-i18next" // Translation hook

export function RegisterShip(props: {}) {
  const [ship, setShip] = useState<ShipName | null>(null)
  const { t } = useTranslation()

  return (
    <Section xs={12} lg={8} title={t("ships.register.title")} fill>
      <Grid item xs={12} lg={12}>
        <Autocomplete
          id="jobs"
          options={shipList}
          filterSelectedOptions
          value={ship}
          getOptionLabel={(option) => option}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={t("ships.register.ship_label")}
              fullWidth
              SelectProps={{
                IconComponent: KeyboardArrowDownRoundedIcon,
              }}
            />
          )}
          onChange={(event: any, newValue: ShipName | null) => {
            setShip(newValue)
          }}
        />
      </Grid>

      <Grid item xs={12} container justifyContent={"center"}>
        <Box>
          <Button color={"primary"}>{t("ships.register.submit")}</Button>
        </Box>
      </Grid>
    </Section>
  )
}
