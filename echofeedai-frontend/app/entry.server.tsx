/**
 * By default, Remix will handle generating the HTTP Response for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.server
 */

import type { AppLoadContext, EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import Backend from "i18next-http-backend";
import i18n from "./i18n";
import i18next from "./lib/i18next.server";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { getI18nSession } from "./services/sessions.server";
import { getLocaleResources } from "./functions/i18n.load-locales";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  // This is ignored so we can keep it in the template for visibility.  Feel
  // free to delete this parameter in your app if you're not using it!
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  loadContext: AppLoadContext
) {
  let instance = createInstance();
  let { getLocale } = await getI18nSession(request);
  let lng = getLocale();
  let ns = i18next.getRouteNamespaces(remixContext);

  // Get all locale resources dynamically
  const resources = await getLocaleResources("public/locales");

  await instance
    .use(initReactI18next)
    .use(Backend)
    .init({
      ...i18n,
      lng,
      ns,
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
      resources,
    });

  const controller = new AbortController();
  let didError = false;

  const body = await renderToReadableStream(
    <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>,
    {
      signal: controller.signal,
      onError(error: unknown) {
        didError = true;
        console.error(error);
        responseStatusCode = 500;
      },
    }
  );

  try {
    if (isbot(request.headers.get("user-agent"))) {
      await body.allReady;
    }

    responseHeaders.set("Content-Type", "text/html");
    return new Response(body, {
      status: didError ? 500 : responseStatusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    controller.abort();
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
