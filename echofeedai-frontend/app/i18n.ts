import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocaleResources } from "./functions/i18n.load-locales";

// Since getI18nSession is now async and requires a Request object,
// we'll need to initialize with a default language first
const defaultLanguage = "en";

const resources = await getLocaleResources("public/locales");

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

// Language changes will need to be handled in your routes/components
// where you have access to the Request object and can use getI18nSession

export default i18n;
