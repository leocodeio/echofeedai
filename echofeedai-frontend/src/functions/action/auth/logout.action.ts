import { getUserSession } from "@/services/sessions.server";
import { redirect } from "react-router-dom";
import { logout } from "@/services/auth.server";
export async function action() {
  const session = getUserSession();
  const role = session.getRole();
  await logout(role);
  session.removeUser();
  return redirect("/");
}
