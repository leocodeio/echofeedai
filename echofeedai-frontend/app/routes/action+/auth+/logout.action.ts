import { getUserSession } from "@/services/sessions.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "@/services/auth.server";
export async function action({ request }: LoaderFunctionArgs) {
  const session = await getUserSession(request);
  const role = session.getRole();
  await logout(role);
  session.destroyUserSession();
  return redirect("/");
}
