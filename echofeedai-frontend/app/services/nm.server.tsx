import { userSession } from "./sessions.server";
import { getFeedbackInitiative } from "./source.server";

// start ------------------------------ getAllMailTemplateIdentifier ------------------------------
export const getAllMailTemplateIdentifier = async (request: Request) => {
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  const response = await fetch(
    `${process.env.VITE_APP_NM_BACKEND_USER_URL}/template/get-all`,
    {
      method: "GET",
      headers: {
        "x-api-key": process.env.VITE_APP_API_KEY!,
        "Content-Type": "application/json",
        Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
      },
      credentials: "include",
      mode: "cors",
    }
  );
  return response;
};
// end ------------------------------ getAllMailTemplateIdentifier ------------------------------
// start ------------------------------ sendMail -- ----------------------------
export const sendMail = async (
  mailPayload: { feedbackInitiateId: string },
  request: Request
) => {
  const session = await userSession(request);
  const { accessToken, refreshToken } = session.getAcessAndRefreshToken();
  const { feedbackInitiateId } = mailPayload;
  // get the iniitiate
  const initiateResponse = await getFeedbackInitiative(
    feedbackInitiateId,
    request
  );
  const initiate = await initiateResponse.json();
  const initiateData = initiate.payload as any;
  const participantIds = initiateData.participantIds;
  const templateIdentifier = initiateData.mailTemplateIdentifier;
  console.log("participantIds", participantIds);
  console.log("templateIdentifier", templateIdentifier);
  // promise all
  const response = await fetch(
    `${process.env.VITE_APP_NM_BACKEND_USER_URL}/participants/send-mail`,
    {
      method: "POST",
      headers: {
        "x-api-key": process.env.VITE_APP_API_KEY!,
        "Content-Type": "application/json",
        Cookie: `access-token=${accessToken}; refresh-token=${refreshToken};`,
      },
      credentials: "include",
      mode: "cors",
      body: JSON.stringify({ participantIds, templateIdentifier, feedbackInitiateId }),
    }
  );
  const responseData = await response.json();
  console.log(responseData);
  return response;
};
// end ------------------------------ sendMail ------------------------------
