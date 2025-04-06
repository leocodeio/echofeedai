import {
  getParticipants,
  getFeedbackInitiatives,
} from "@/services/source.server";
import { getAllMailTemplateIdentifier } from "@/services/nm.server";
import { redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { ActionResultError } from "@/types/action-result";
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const sourceId = params.id;
  if (!sourceId) {
    return redirect("/feature/source");
  }
  // get participants for the source
  const getParticipantsResponse = await getParticipants(sourceId, request);
  if (!getParticipantsResponse.ok) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Failed to get participants",
      data: null,
      origin: "source",
    };
    return result;
  }
  const participants = await getParticipantsResponse.json();
  const participantsData = participants.payload;

  // get feedback initiators for the source
  const getFeedbackInitiativesResponse = await getFeedbackInitiatives(
    sourceId,
    request
  );
  if (!getFeedbackInitiativesResponse.ok) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Failed to get feedback initiators",
      data: null,
      origin: "source",
    };
    return result;
  }
  const feedbackInitiatives = await getFeedbackInitiativesResponse.json();
  const feedbackInitiativesData = feedbackInitiatives.payload;

  // get mail template identifier for the source
  const getMailTemplateIdentifierResponse = await getAllMailTemplateIdentifier(
    request
  );

  if (!getMailTemplateIdentifierResponse.ok) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Failed to get mail template identifier",
      data: null,
      origin: "source",
    };
    return result;
  }
  const mailTemplateIdentifier = await getMailTemplateIdentifierResponse.json();
  const mailTemplateIdentifierData = mailTemplateIdentifier.payload;

  return {
    participants: participantsData || [],
    feedbackInitiatives: feedbackInitiativesData || [],
    mailTemplateIdentifiers: mailTemplateIdentifierData || [],
  };
};
