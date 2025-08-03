import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import moment from "moment"
import "moment/locale/uk"

import en from "../locales/en/english.json"
import uk from "../locales/uk/ukrainian.json"
// Language configuration with endonyms
export const languages = [
  { code: "en", endonym: "English" },
  { code: "uk", endonym: "Українська" },
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
    },
  })

i18n.on("languageChanged", (lng) => {
  moment.locale(lng)
})

export default i18n
