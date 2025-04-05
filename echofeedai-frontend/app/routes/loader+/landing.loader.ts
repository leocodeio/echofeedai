import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { userSession } from "@/services/sessions.server";

export const ROUTE_PATH = "/" as const;

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response | null> {
  // If user is already authenticated, redirect to dashboard
  const session = await userSession(request);
  const isAuthenticated = session.isAuthenticated();
  console.log("debug log 0 - landing.loader.ts", isAuthenticated);
  if (isAuthenticated) {
    return redirect("/home");
  }
  return null;
}
