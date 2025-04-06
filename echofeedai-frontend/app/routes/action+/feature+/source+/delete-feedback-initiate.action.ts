import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { deleteFeedbackInitiate } from "@/services/source.server";
import { ActionResult, ActionResultError } from "@/types/action-result";
export async function action({
  params,
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  if (!params.id) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Source ID is required",
      origin: "source",
      data: null,
    };
    return result;
  }

  try {
    const response = await deleteFeedbackInitiate(params.id, request);

    if (!response.ok) {
      const result: ActionResultError<any> = {
        success: false,
        message: "Failed to delete feedback initiate",
        origin: "source",
        data: null,
      };
      return result;
    }

    // This will cause React Router to reload all data on the target route
    return redirect(`/feature/source`);
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
