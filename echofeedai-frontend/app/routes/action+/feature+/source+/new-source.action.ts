import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { createSource } from "@/services/source.server";
import { ActionResult, ActionResultError } from "@/types/action-result";
import { sourcePayloadSchema } from "@/services/schemas/source.schema";

export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
  console.log(formData);

  // Handle create action
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

  try {
    const response = await createSource(parsedSourcePayload.data);
    console.log("Response", response);
    if (!response.ok) {
      const responseData = await response.json();
      const result: ActionResultError<any> = {
        success: false,
        message: responseData.message,
        origin: "source",
        data: parsedSourcePayload.data,
      };
      return result;
    }

    return redirect("/feature/source");
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
