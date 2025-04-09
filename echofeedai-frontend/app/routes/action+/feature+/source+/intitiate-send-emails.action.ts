import { ActionFunctionArgs } from "@remix-run/node";
import {
  ActionResult,
  ActionResultError,
  ActionResultSuccess,
} from "@/types/action-result";
import { sendMailPayloadSchema } from "@/services/schemas/source.schema";
import { sendMail } from "@/services/nm.server";

export async function action({
  params,
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response | null> {
  // Handle create action
  const feedbackInitiateId = params.id;
  if (!feedbackInitiateId) {
    const result: ActionResultError<any> = {
      success: false,
      origin: "source",
      message: "Feedback initiate ID is required",
      data: null,
    };
    return result;
  }
  const sourcePayload = { feedbackInitiateId };
  console.log("sourcePayload", sourcePayload);

  // Validate with zod
  const parsedSourcePayload = sendMailPayloadSchema.safeParse(sourcePayload);
  if (!parsedSourcePayload.success) {
    const result: ActionResultError<any> = {
      success: false,
      origin: "source",
      message: parsedSourcePayload.error.issues[0].message,
      data: parsedSourcePayload.data,
    };
    return result;
  }

  try {
    const response = await sendMail(parsedSourcePayload.data, request);
    console.log("mail response", response);

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

    const result: ActionResultSuccess<any> = {
      success: true,
      message: "Emails sent successfully",
      data: parsedSourcePayload.data,
    };
    return result;
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
