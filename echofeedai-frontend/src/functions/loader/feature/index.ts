import { redirect } from "react-router-dom";
import { getUserSession } from "@/services/sessions.server";

export async function loader(): Promise<Response | null> {
  // If user is not authenticated, redirect to signin
  const session = getUserSession();
  const isAuthenticated = session.getIsAuthenticated();
  if (!isAuthenticated) {
    return redirect("/auth/signin");
  }
  return null;
}