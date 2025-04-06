import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteSource } from "@/services/source.server";
import { ActionResult, ActionResultError } from "@/types/action-result";

export async function action({
  params,
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  console.log("deleteSourceAction", params);
  if (!params.id) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Source ID is required",
      origin: "source",
      data: null,
    };
    console.log("Source ID is required", result);
    return result;
  }

  try {
    const response = await deleteSource(params.id, request);
    console.log("deleteSourceResponse", response);
    if (!response.ok) {
      const result: ActionResultError<any> = {
        success: false,
        message: "Failed to delete source",
        origin: "source",
        data: null,
      };
      return result;
    }

    // This will cause React Router to reload all data on the target route
    return redirect("/feature/source");
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
