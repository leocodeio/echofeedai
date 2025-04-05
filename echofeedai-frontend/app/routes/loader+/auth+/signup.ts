import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { userSession } from "@/services/sessions.server";

export const ROUTE_PATH = "/auth/signin" as const;

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response | null> {
  // If user is already authenticated, redirect to dashboard
  const session = await userSession(request);
  const isAuthenticated = session.getUserSession().isAuthenticated;
  if (isAuthenticated) {
    return redirect("/dashboard");
  }
  return null;
}
