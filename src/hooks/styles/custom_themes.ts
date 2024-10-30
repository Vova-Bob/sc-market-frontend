import { Theme } from "@mui/material"
import { BWINCORP_theme } from "./themes/BWINCORP"
import { MEDRUNNER_theme } from "./themes/MEDRUNNER"
import { RSNM_theme } from "./themes/RSNM"

export const CUSTOM_THEMES = new Map<string, Theme>()
CUSTOM_THEMES.set("BWINCORP", BWINCORP_theme)
CUSTOM_THEMES.set("MEDRUNNER", MEDRUNNER_theme)
CUSTOM_THEMES.set("RSNM", RSNM_theme)
