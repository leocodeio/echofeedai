import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enCommon from "@/locales/en/common.json";
import esCommon from "@/locales/es/common.json";
import hiCommon from "@/locales/hi/common.json";
import jaCommon from "@/locales/ja/common.json";
import zhCommon from "@/locales/zh-cn/common.json";

import { getI18nSession } from "@/services/sessions.server";
const session = getI18nSession();

const savedLanguage = session.getLanguage() || "en";

const resources = {
  en: {
    common: enCommon,
  },
  es: {
    common: esCommon,
  },
  hi: {
    common: hiCommon,
  },
  ja: {
    common: jaCommon,
  },
  zh: {
    common: zhCommon,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: "en",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (lng) => {
  session.setLanguage(lng);
});

export default i18n;
