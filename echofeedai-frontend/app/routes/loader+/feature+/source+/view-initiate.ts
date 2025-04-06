import {
  getFeedbackInitiative,
  getFeedbackResponse,
} from "@/services/source.server";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { ActionResultError } from "@/types/action-result";
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const feedbackInitiateId = params.id;
  if (!feedbackInitiateId) {
    return redirect("/feature/source");
  }
  // get feedback initiative
  const getFeedbackInitiativesResponse = await getFeedbackInitiative(
    feedbackInitiateId,
    request
  );
  if (!getFeedbackInitiativesResponse.ok) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Failed to get feedback initiatives",
      data: null,
      origin: "source",
    };
    return result;
  }

  const feedbackInitiative = await getFeedbackInitiativesResponse.json();
  const feedbackInitiativeData = feedbackInitiative.payload as any;

  // get responses

  const getFeedbackResponseResponse = await getFeedbackResponse(
    feedbackInitiateId,
    request
  );
  if (!getFeedbackResponseResponse.ok) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Failed to get feedback responses",
      data: null,
      origin: "source",
    };
    return result;
  }

  const feedbackResponse = await getFeedbackResponseResponse.json();
  const feedbackResponseData = feedbackResponse.payload as any;

  return {
    topics:
      feedbackInitiativeData.topics.map((topic: any) => ({
        tid: Math.random().toString(36).substring(2, 15),
        name: topic,
      })) || [],
    questions:
      feedbackInitiativeData.questions.map((question: any) => ({
        tid: Math.random().toString(36).substring(2, 15),
        name: question,
      })) || [],
    responses: feedbackResponseData || [],
  };
};
