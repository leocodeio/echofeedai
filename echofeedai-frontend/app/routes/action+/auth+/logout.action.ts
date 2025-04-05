import { userSession } from "@/services/sessions.server";
import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "@/services/auth.server";
export async function action({ request }: ActionFunctionArgs) {
  const session = await userSession(request);
  const role = session.getUserSession().role;
  await logout(role);
  session.clearUserSession();
  return redirect("/");
}
