import { getUserSession } from "@/services/sessions.server";
import { redirect } from "react-router-dom";
import { logout } from "@/services/auth.server";
export async function action() {
  const session = getUserSession();
  const user = session.getUser();
  session.removeUser();
  // make a request to the backend to logout
  await logout(user.role);
  return redirect("/");
}
