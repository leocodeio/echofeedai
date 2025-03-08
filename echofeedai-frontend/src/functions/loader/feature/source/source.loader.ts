import { redirect } from "react-router-dom";
import { getUserSession } from "@/services/sessions.server";
import { getSources } from "@/services/source.server";

export async function loader(): Promise<any> {
  // Check authentication
  const session = getUserSession();
  const isAuthenticated = session.getIsAuthenticated();
  if (!isAuthenticated) {
    return redirect("/auth/signin");
  }

  try {
    const response = await getSources();

    if (!response.ok) {
      throw new Error("Failed to fetch sources");
    }

    const data = await response.json();
    return { sources: data.payload };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
      sources: [],
    };
  }
}
