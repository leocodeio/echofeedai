import { redirect, type LoaderFunctionArgs } from "react-router-dom";
import { userSession } from "@/services/sessions.server";

export const ROUTE_PATH = "/dashboard" as const;

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<Response | null> {
  // If user is not authenticated, redirect to signin
  const session = await userSession(request);
  const user = session.getUserSession();
  if (!user) {
    return redirect("/auth/signin");
  }
  return null;
}