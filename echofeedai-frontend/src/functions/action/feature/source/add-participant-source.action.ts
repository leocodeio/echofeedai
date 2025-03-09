import { ActionFunctionArgs, redirect } from "react-router-dom";
import {
  getParticipantByName,
  addParticipantToSource,
} from "@/services/source.server";
import { ActionResult, ActionResultError } from "@/types/action-result";

export async function action({
  request,
  params,
}: ActionFunctionArgs): Promise<ActionResult<any> | Response> {
  const formData = await request.formData();
  const participantName = formData.get("participantName") as string;
  const sourceId = params.id;

  console.log("sourceId", sourceId);
  console.log("participantName", participantName);

  if (!sourceId || !participantName) {
    const result: ActionResultError<any> = {
      success: false,
      message: "Source ID and participant name are required",
      origin: "source",
      data: null,
    };
    return result;
  }
  const participants = participantName.split(",");

  for (const participant of participants) {
    try {
      // First get participant by name
      const participantResponse = await getParticipantByName(participant);

      if (!participantResponse.ok) {
        const responseData = await participantResponse.json();
        const result: ActionResultError<any> = {
          success: false,
          message: responseData.message || "Participant not found",
          origin: "source",
          data: {
            existing: false,
            participant: null,
          },
        };
        return result;
      }

      const participantData = await participantResponse.json();

      // Then add participant to source
      const addParticipantToSourceResponse = await addParticipantToSource(
        sourceId,
        participantData.payload.id
      );

      if (!addParticipantToSourceResponse.ok) {
        const responseData = await addParticipantToSourceResponse.json();
        const result: ActionResultError<any> = {
          success: false,
          message: responseData.message,
          origin: "source",
          data: {
            existing: false,
            participant: participantData.payload,
          },
        };
        return result;
      }

      // const result: ActionResultSuccess<any> = {
      //   success: true,
      //   message: "Participant added to source",
      //   data: {
      //     existing: true,
      //     participant: participantData.payload,
      //   },
      // };
      // return result;
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

  return redirect(`/feature/source`);
}
