import {
  json,
  LoaderFunctionArgs,
  redirect,
  type ActionFunctionArgs,
} from "@remix-run/node";

import { getI18nSession } from "~/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const locale = formData.get("locale");

  if (typeof locale !== "string") {
    return json({ success: false }, { status: 400 });
  }

  const i18nSession = await getI18nSession(request);
  i18nSession.setLocale(locale);

  return json(
    { success: true, locale },
    {
      headers: {
        "Set-Cookie": await i18nSession.commitI18nSession(),
      },
    }
  );
}
// [TODO]

export async function loader({ request }: LoaderFunctionArgs) {
  const previousUrl = request.headers.get("Referer");
  return redirect(previousUrl || "/");
}
