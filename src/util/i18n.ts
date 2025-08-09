import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import moment from "moment"

import en from "../locales/en/english.json"
import uk from "../locales/uk/ukrainian.json"
import de from "../locales/de/de.json"
import ja from "../locales/ja/ja.json"
import es from "../locales/es/es.json"
import fr from "../locales/fr/fr.json"
import zhCN from "../locales/zh/zh_Hans.json"
import zhTW from "../locales/zh/zh_Hant.json"
import { useEffect, useState } from "react"

// MUI locale bundles (centralized mapping here)
import {
  enUS as coreEnUS,
  deDE as coreDeDE,
  esES as coreEsES,
  frFR as coreFrFR,
  jaJP as coreJaJP,
  zhCN as coreZhCN,
  zhTW as coreZhTW,
  ukUA as coreUkUA,
} from "@mui/material/locale"
import {
  enUS as pickersEnUS,
  deDE as pickersDeDE,
  esES as pickersEsES,
  frFR as pickersFrFR,
  jaJP as pickersJaJP,
  zhCN as pickersZhCN,
  zhTW as pickersZhTW,
  ukUA as pickersUkUA,
} from "@mui/x-date-pickers/locales"
import {
  enUS as gridEnUS,
  deDE as gridDeDE,
  esES as gridEsES,
  frFR as gridFrFR,
  jaJP as gridJaJP,
  zhCN as gridZhCN,
  zhTW as gridZhTW,
  ukUA as gridUkUA,
} from "@mui/x-data-grid/locales"

// Language configuration with endonyms
export const languages = [
  { code: "en", endonym: "English" },
  { code: "uk", endonym: "Українська" },
  // { code: "es", endonym: "Español" },
  // { code: "de", endonym: "Deutsch" },
  // { code: "fr", endonym: "Français" },
  // { code: "ja", endonym: "日本語" },
  { code: "zh-CN", endonym: "简体中文" },
  // { code: "zh-TW", endonym: "繁體中文" }, // Not currently supported by API
]

export function getMuiLocales(languageCode: string): {
  core: any
  pickers: any
  grid: any
} {
  switch (languageCode) {
    case "de":
      return { core: coreDeDE, pickers: pickersDeDE, grid: gridDeDE }
    case "es":
      return { core: coreEsES, pickers: pickersEsES, grid: gridEsES }
    case "fr":
      return { core: coreFrFR, pickers: pickersFrFR, grid: gridFrFR }
    case "ja":
      return { core: coreJaJP, pickers: pickersJaJP, grid: gridJaJP }
    case "uk":
      return { core: coreUkUA, pickers: pickersUkUA, grid: gridUkUA }
    case "zh-CN":
      return { core: coreZhCN, pickers: pickersZhCN, grid: gridZhCN }
    case "zh-TW":
      return { core: coreZhTW, pickers: pickersZhTW, grid: gridZhTW }
    case "en":
    default:
      return { core: coreEnUS, pickers: pickersEnUS, grid: gridEnUS }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: { translation: en },
      uk: { translation: uk },
      // es: { translation: es },
      // de: { translation: de },
      // fr: { translation: fr },
      // ja: { translation: ja },
      "zh-CN": { translation: zhCN },
      // "zh-TW": { translation: zhTW }, // Not currently supported by API
    },
  })

i18n.on("languageChanged", (lng) => {
  moment.locale(lng)
})

export default i18n
