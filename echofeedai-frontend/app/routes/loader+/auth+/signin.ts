import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "@/services/sessions.server";

export const ROUTE_PATH = "/auth/signin" as const;

export async function loader({ request }: LoaderFunctionArgs): Promise<Response | null> {
  // If user is already authenticated, redirect to dashboard
  const session = await getUserSession(request);
  const isAuthenticated = session.getIsAuthenticated();
  if (isAuthenticated) {
    return redirect("/home");
  }
  return null;
}
