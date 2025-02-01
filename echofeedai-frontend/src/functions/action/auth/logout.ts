import { getUserSession } from "@/services/sessions.server";

export async function action() {
  const session = getUserSession();
  session.removeUser();
  return Response.json({ success: true });
}
