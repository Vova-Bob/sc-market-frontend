import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import moment from "moment"
import "moment/locale/uk"

import en from "../locales/en/english.json"
import uk from "../locales/uk/ukrainian.json"
import de from "../locales/de/de.json"
import ja from "../locales/ja/ja.json"
import es from "../locales/es/es.json"
import fr from "../locales/fr/fr.json"
import zh_Hans from "../locales/zh/zh_Hans.json"
import zh_Hant from "../locales/zh/zh_Hant.json"

// Language configuration with endonyms
export const languages = [
  { code: "en", endonym: "English" },
  { code: "uk", endonym: "Українська" },
  // { code: "de", endonym: "Deutsch" },
  // { code: "es", endonym: "Español" },
  // { code: "fr", endonym: "Français" },
  // { code: "ja", endonym: "日本語" },
  // { code: "zh_Hans", endonym: "简体中文" },
  // { code: "zh_Hant", endonym: "繁體中文" },
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
      // zh_Hans: { translation: zh_Hans },
      // zh_Hant: { translation: zh_Hant },
    },
  })

i18n.on("languageChanged", (lng) => {
  moment.locale(lng)
})

export default i18n
