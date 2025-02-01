import { type ActionFunctionArgs } from "react-router-dom";
import { userSession } from "@/services/sessions.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await userSession(request);
  return Response.json(
    { success: true },
    {
      headers: {
        "Set-Cookie": await session.clearUserSession(),
      },
    }
  );
}
