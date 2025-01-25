import { json, type ActionFunctionArgs } from "@remix-run/node";
import { userSession } from "~/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await userSession(request);
  return json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await session.clearUserSession(),
      },
    }
  );
}
