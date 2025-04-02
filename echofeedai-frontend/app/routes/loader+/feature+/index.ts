import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "@/services/sessions.server";

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response | null> {
  // If user is not authenticated, redirect to signin
  const session = await getUserSession(request);
  const isAuthenticated = session.getIsAuthenticated();
  if (!isAuthenticated) {
    return redirect("/auth/signin");
  }
  return null;
}
