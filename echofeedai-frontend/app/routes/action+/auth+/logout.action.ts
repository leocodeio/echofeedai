import { userSession } from "@/services/sessions.server";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "@/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const session = await userSession(request);
  const role = session.getRole();
  console.log("debug log 1 - logout.action.ts", role);
  if (!role) {
    return redirect("/");
  }
  console.log("debug log 2 - logout.action.ts", role);
  const logoutResponse = await logout(role, request);
  console.log("debug log 3 - logout.action.ts", logoutResponse);
  console.log("debug log 4 - logout.action.ts", role);
  return redirect("/", {
    headers: {
      "Set-Cookie": await session.removeUser(),
    },
  });
}
