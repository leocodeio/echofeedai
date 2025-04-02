import clsx from "clsx";
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme,
} from "remix-themes";

import { themeSessionResolver } from "./services/sessions.server";
import { getI18nSession } from "./services/sessions.server";

import {
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Links } from "@remix-run/react";
import { Outlet } from "@remix-run/react";
import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

// i18n

//-------------------------- i18n---------------------------------------
import { useChangeLanguage } from "remix-i18next/react";
export let handle = {
  // In the handle export, we can add a i18n key with namespaces our route
  // will need to load. This key can be a single string or an array of strings.
  // TIP: In most cases, you should set this to your defaultNS from your i18n config
  // or if you did not set one, set it to the i18next default namespace "translation"
  i18n: "common",
};
//-------------------------- i18n---------------------------------------

export async function loader({ request }: LoaderFunctionArgs) {
  //-------------------------- i18n---------------------------------------
  const i18nSession = await getI18nSession(request);
  let locale = i18nSession.getLanguage();
  const { getTheme } = await themeSessionResolver(request);
  //-------------------------- i18n---------------------------------------
  return {
    theme: getTheme(),
    locale,
  };
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  );
}

import "./tailwind.css";

//-------------------------- i18n---------------------------------------
import { useTranslation } from "react-i18next";
//-------------------------- i18n---------------------------------------
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function App() {
  const data = useLoaderData<typeof loader>();
  //-------------------------- i18n---------------------------------------
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  //-------------------------- i18n---------------------------------------
  useChangeLanguage(data.locale);
  let { i18n } = useTranslation();
  //-------------------------- i18n---------------------------------------

  const [theme] = useTheme();
  return (
    <html className={clsx(theme)} lang={data.locale} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
