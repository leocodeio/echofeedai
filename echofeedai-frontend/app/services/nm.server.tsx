import { getFeedbackInitiative } from "./source.server";

// start ------------------------------ getAllMailTemplateIdentifier ------------------------------
export const getAllMailTemplateIdentifier = async () => {
  const response = await fetch(
    `${import.meta.env.VITE_APP_NM_BACKEND_USER_URL}/template/get-all`,
    {
      method: "GET",
      headers: {
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
    }
  );
  return response;
};
// end ------------------------------ getAllMailTemplateIdentifier ------------------------------
// start ------------------------------ sendMail -- ----------------------------
export const sendMail = async (mailPayload: { feedbackInitiateId: string }) => {
  const { feedbackInitiateId } = mailPayload;
  // get the iniitiate
  const initiateResponse = await getFeedbackInitiative(feedbackInitiateId);
  const initiate = await initiateResponse.json();
  const initiateData = initiate.payload as any;
  const participantIds = initiateData.participantIds;
  const templateIdentifier = initiateData.mailTemplateIdentifier;
  console.log("participantIds", participantIds);
  console.log("templateIdentifier", templateIdentifier);
  // promise all
  const response = await fetch(
    `${import.meta.env.VITE_APP_NM_BACKEND_USER_URL}/participants/send-mail`,
    {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_APP_API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({ participantIds, templateIdentifier }),
    }
  );
  const responseData = await response.json();
  console.log(responseData);
  return response;
};
// end ------------------------------ sendMail ------------------------------
