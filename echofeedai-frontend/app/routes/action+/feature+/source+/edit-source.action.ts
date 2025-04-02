import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { updateSource } from "@/services/source.server";
import { ActionResult, ActionResultError } from "@/types/action-result";
import { sourcePayloadSchema } from "@/services/schemas/source.schema";

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
  const sourceId = params.id;

  // Handle create/update actions
  const companyName = formData.get("companyName") as string;
  const sourcePayload = { companyName };

  // Validate with zod
  const parsedSourcePayload = sourcePayloadSchema.safeParse(sourcePayload);
  if (!parsedSourcePayload.success) {
    const result: ActionResultError<any> = {
      success: false,
      origin: "companyName",
      message: parsedSourcePayload.error.issues[0].message,
      data: parsedSourcePayload.data,
    };
    return result;
  }

  console.log("sourceId", sourceId);
  console.log("parsedSourcePayload", parsedSourcePayload);

  try {
    let response;

    // Update existing source
    if (sourceId) {
      response = await updateSource(sourceId, parsedSourcePayload.data);
    } else {
      const result: ActionResultError<any> = {
        success: false,
        message: "Source ID is required",
        origin: "source",
        data: parsedSourcePayload.data,
      };
      return result;
    }

    if (!response.ok) {
      const result: ActionResultError<any> = {
        success: false,
        message: "No response received from server",
        origin: "source",
        data: parsedSourcePayload.data,
      };
      return result;
    }
    return redirect("/feature/source");
    // const result: ActionResultSuccess<any> = {
    //   success: true,
    //   message: "Source updated successfully",
    //   data: parsedSourcePayload.data,
    // };
    // return result;
  } catch (error) {
    const result: ActionResultError<any> = {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
      origin: "source",
      data: parsedSourcePayload.data,
    };
    return result;
  }
}
