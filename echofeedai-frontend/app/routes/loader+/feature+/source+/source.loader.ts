import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { userSession } from "@/services/sessions.server";
import { getSources } from "@/services/source.server";
import { NavLinks } from "@/models/navlinks";

export async function loader({ request }: LoaderFunctionArgs): Promise<any> {
  // Check authentication
  const session = await userSession(request);
  const isAuthenticated = session.isAuthenticated();

  const pathname = new URL(request.url).pathname;
  const neededRoles = NavLinks.find((link) => pathname.includes(link.to))?.role;
  const isRole = session.getIsRole(neededRoles || []);
  if (!isRole) {
    return redirect("/home");
  }

  if (!isAuthenticated) {
    return redirect("/auth/signin");
  }

  try {
    const response = await getSources(request);

    if (!response.ok) {
      throw new Error("Failed to fetch sources");
    }

    const data = await response.json();
    return { sources: data.payload || [] };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      sources: [],
    };
  }
}
