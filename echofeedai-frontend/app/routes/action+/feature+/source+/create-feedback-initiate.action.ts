import { ActionFunctionArgs } from "@remix-run/node";
import { createFeedbackInitiative } from "@/services/source.server";
import { FeedbackInitiativePayload } from "@/types/initiate";
import {
  ActionResult,
  ActionResultError,
  ActionResultSuccess,
} from "@/types/action-result";
export async function action({
  request,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
  const feedbackInitiativePayload: FeedbackInitiativePayload = {
    sourceId: formData.get("sourceId") as string,
    topics: formData.get("topics")?.toString().split(",") || [],
    mailTemplateIdentifier: formData.get("mailTemplateIdentifier") as string,
  };
  console.log("payload", feedbackInitiativePayload);
  const response = await createFeedbackInitiative(feedbackInitiativePayload);
  if (!response.ok) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Failed to create feedback initiative",
      data: null,
      origin: "source",
    };
    return result;
  }
  const result: ActionResultSuccess<any> = {
    success: true,
    message: "Feedback initiative created successfully",
    data: null,
  };
  return result;
}
