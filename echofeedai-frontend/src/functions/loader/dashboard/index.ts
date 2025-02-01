import { redirect } from "react-router-dom";
import { getUserSession } from "@/services/sessions.server";

export const ROUTE_PATH = "/dashboard" as const;

export async function loader(): Promise<Response | null> {
  // If user is not authenticated, redirect to signin
  const session = getUserSession();
  const user = session.getUser();
  if (!user) {
    return redirect("/auth/signin");
  }
  return null;
}
