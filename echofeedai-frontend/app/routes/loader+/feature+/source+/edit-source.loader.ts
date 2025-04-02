import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserSession } from "@/services/sessions.server";
import { getSource } from "@/services/source.server";
import {
  ActionResult,
  ActionResultError,
  ActionResultSuccess,
} from "@/types/action-result";
export async function loader({
  request,
  params,
}: LoaderFunctionArgs): Promise<ActionResult<any> | any> {
  // Check authentication
  const session = await getUserSession(request);
  const isAuthenticated = session.getIsAuthenticated();
  if (!isAuthenticated) {
    return redirect("/auth/signin");
  }

  // If there's an ID parameter, fetch a specific source
  if (params.id) {
    try {
      const response = await getSource(params.id);

      if (!response.ok) {
        const result: ActionResultError<any> = {
          success: false,
          origin: "source",
          message: "Failed to fetch source",
          data: null,
        };
        return result;
      }

      const data = await response.json();
      const sourceData = data.payload;
      console.log("sourceData", sourceData);
      if (!sourceData) {
        return redirect("/feature/source");
      }
      const result: ActionResultSuccess<any> = {
        success: true,
        message: "Source fetched successfully",
        data: sourceData,
      };
      return result;
    } catch (error) {
      const result: ActionResultError<any> = {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
        origin: "source",
        data: null,
      };
      return result;
    }
  }
}
