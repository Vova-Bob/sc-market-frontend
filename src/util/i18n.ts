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
